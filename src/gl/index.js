/* copyright 2018, stefano bovio @allyoucanmap. */

import {createElement, updateElement} from '../utils/DOMUtils';
import {modelViewProjectionMatrix, modelMatrix, viewMatrix, projectionMatrix} from '../utils/MatrixUtils';
import {createProgram, startShader, stopShader, loadUniforms, createModel, deleteModel, bindTextureFromUrl, destroyTextureFromUrl} from '../utils/GLUtils';
import {isArray, isNumber, isNil, range, max, min} from 'lodash';
import {mapValue} from '../utils/Utils';
import earcut from 'earcut';
import tinycolor from 'tinycolor2';

const shaders = {
    _: {
        vertex: require('raw-loader!./shader/_.vert'),
        fragment: require('raw-loader!./shader/_.frag')
    },
    point: {
        vertex: require('raw-loader!./shader/point.vert'),
        fragment: require('raw-loader!./shader/point.frag')
    },
    line: {
        vertex: require('raw-loader!./shader/_.vert'),
        fragment: require('raw-loader!./shader/_.frag')
    },
    polygon: {
        vertex: require('raw-loader!./shader/_.vert'),
        fragment: require('raw-loader!./shader/_.frag')
    },
    polygontexture: {
        vertex: require('raw-loader!./shader/polygontexture.vert'),
        fragment: require('raw-loader!./shader/polygontexture.frag')
    }
};

let gl;
let programs;

let animation;
let timeout;
let width = 0;
let height = 0;
let time = 0;
let frame = 0;
let fps = 0;
let  viewMat;
let projectionMat;
let background = [0.1, 0.1, 0.1, 1.0];

const attributes = {
    index: {},
    coordinates: {
        pos: 0,
        dim: 3
    },
    textureCoordinates: {
        pos: 1,
        dim: 2
    },
    size: {
        pos: 4,
        dim: 1
    },
    vcolor: {
        pos: 5,
        dim: 4
    }
};

const uniforms = {
    time: 'f',
    modelViewProjectionMatrix: 'mat4',
    color: 'vec4',
    baseTexture: 'i'
};

const camera = {
    type: 'perspective',
    position: [0, 0, 5],
    target: [0, 0, 0],
    up: [0, 1, 0],
    near: 3,
    far: 100,
    zoom: 50,
    fovy: 60
};

const loop = (draw = () => {}, options) => {
    let currentTime = Date.now();
    let lastTime = currentTime;
    let delta = 0;
    const start = () => {
        timeout = setTimeout(() => {
            animation = requestAnimationFrame(start);
        }, 1000 / (options.fps || 30));
        currentTime = Date.now();
        draw(time);
        delta = (currentTime - lastTime) / 1000;
        fps = Math.round(1 / delta);
        time += delta;
        lastTime = currentTime;
        frame++;
    };
    start();
};

const resetTime = () => {
    time = 0;
};

const resize = (canvas, parent) => {
    width = parent.clientWidth;
    height = parent.clientHeight;
    gl.viewport(0, 0, width, height);
    updateElement(canvas, { width, height }, { width: width + 'px', height: height + 'px'});
};

const stop = () => {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    if (animation) {
        cancelAnimationFrame(animation);
        animation = null;
    }
};

const checkEntityValue = value => !isNil(value) && isArray(value) && value || !isNil(value) && isNumber(value) && [value, value, value];

const cameraMatix = (camera, width, height) => ({
    projectionMat: projectionMatrix({
        type: camera.type,
        left: -(width / 2) / camera.zoom,
        right: width / 2 / camera.zoom,
        bottom: -(height / 2) / camera.zoom,
        top: height / 2 / camera.zoom,
        fovy: camera.fovy * (Math.PI / 180.0),
        aspect: width / height,
        near: camera.near,
        far: camera.far
    }),
    viewMat: viewMatrix(camera.position, camera.target, camera.up)
});

const enableVertexAttribArray = (attrs, entity) => {
    attrs.forEach(attr => {
        gl.enableVertexAttribArray(attributes[attr].pos);
        gl.bindBuffer(gl.ARRAY_BUFFER, entity.model[attr].buffer);
        gl.vertexAttribPointer(attributes[attr].pos, attributes[attr].dim, gl.FLOAT, false, 0, 0);
    });
};

const disableVertexAttribArray = attrs => {
    attrs.forEach(attr => {
        gl.disableVertexAttribArray(attributes[attr].pos);
    });
};

const renderPoint = entity => {
    if (!entity.model) { return null; }
    startShader(gl, programs[entity.type].programId);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, entity.model.index.buffer);

    const attr = ['coordinates', 'size', 'vcolor'];

    enableVertexAttribArray(attr, entity);

    const modelMat = modelMatrix(entity);
    const mvp = modelViewProjectionMatrix(modelMat, viewMat, projectionMat);
    
    loadUniforms({
        gl,
        ...programs[entity.type],
        uniforms: [
            {
                name: 'modelViewProjectionMatrix',
                value: mvp
            },
            {
                name: 'origin',
                value: entity.origin
            },
            {
                name: 'color',
                value: entity.color
            },
            {
                name: 'time',
                value: time
            }
        ]
    });
    
    gl.drawElements(gl.POINTS, entity.model.index.coords.length, gl.UNSIGNED_SHORT, 0);

    disableVertexAttribArray(attr);

    stopShader(gl);
};

const getColor = stringColor => {
    const color = tinycolor(stringColor).toRgb();
    return color && [color.r / 255, color.g / 255, color.b / 255, color.a].map(value => parseFloat(value.toFixed(2)));
};

const normalize = point => {
    const length = point[0] * point[0] + point[1] * point[1];
    return length > 0 ? [point[0] * 1 / Math.sqrt(length), point[1] * 1 / Math.sqrt(length)] : point;
};

const perpendicular = (pointA, pointB, direction) => {
    const left = [pointB[0] - pointA[0], pointB[1] - pointA[1]];
    const right = [direction, -1 / (left[1] / left[0]) * direction];
    if (left[0] === 0) {
        return normalize([direction, 0]);
    } else if (left[1] === 0) {
        return normalize([0, direction]);
    }
    return normalize(right);
};

const polylines = (coordinates, scale = 0.005) => {
    return coordinates.reduce((model, coords, idx) => {
        if (idx === coordinates.length - 1) {
            return {...model};
        }
        const pointA = coordinates[idx];
        const pointB = coordinates[idx + 1];
        const right = perpendicular(pointA, pointB, 1);
        const left = perpendicular(pointA, pointB, -1);
        let direction = scale;
        if (pointB[1] - pointA[1] <= 0
        && !(pointB[0] - pointA[0] < 0 && pointB[1] - pointA[1] === 0)) {
            direction = -1 * scale;
        }
        const position = idx * 4;
        return {
            index: [...model.index, position, position + 1, position + 3, position + 3, position + 1, position + 2],
            coordinates: [
                ...model.coordinates,
                pointA[0] + left[0] * direction, pointA[1] + left[1] * direction, pointA[2] || 0,
                pointA[0] + right[0] * direction, pointA[1] + right[1] * direction, pointA[2] || 0,
                pointB[0] + right[0] * direction, pointB[1] + right[1] * direction, pointB[2] || 0,
                pointB[0] + left[0] * direction, pointB[1] + left[1] * direction, pointB[2] || 0
            ],
            vcolor: [
                ...model.vcolor,
                ...(pointA[3] && getColor(pointA[3]) || [-1.0, -1.0, -1.0, -1.0]),
                ...(pointA[3] && getColor(pointA[3]) || [-1.0, -1.0, -1.0, -1.0]),
                ...(pointB[3] && getColor(pointB[3]) || [-1.0, -1.0, -1.0, -1.0]),
                ...(pointB[3] && getColor(pointB[3]) || [-1.0, -1.0, -1.0, -1.0])
            ]
        }
    }, {
        index: [],
        coordinates: [],
        vcolor: []
    });
};

const renderPolygon = entity => {
    if (!entity.model) { return null; }
    startShader(gl, programs[entity.type].programId);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, entity.model.index.buffer);

    const attr = ['coordinates', 'vcolor'];

    enableVertexAttribArray(attr, entity);

    const modelMat = modelMatrix(entity);
    const mvp = modelViewProjectionMatrix(modelMat, viewMat, projectionMat);
    
    loadUniforms({
        gl,
        ...programs[entity.type],
        uniforms: [
            {
                name: 'modelViewProjectionMatrix',
                value: mvp
            },
            {
                name: 'origin',
                value: entity.origin
            },
            {
                name: 'color',
                value: entity.color
            },
            {
                name: 'time',
                value: time
            }
        ]
    });
    
    gl.drawElements(gl.TRIANGLES, entity.model.index.coords.length, gl.UNSIGNED_SHORT, 0);
    
    disableVertexAttribArray(attr);

    stopShader(gl);
};

const renderPolygonTexture = entity => {
    if (!entity.model || !entity.texture || (entity.texture && !entity.texture.$_am_texture)) { return null; }
    startShader(gl, programs[entity.type + 'texture'].programId);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, entity.model.index.buffer);

    const attr = ['coordinates', 'vcolor', 'textureCoordinates'];

    enableVertexAttribArray(attr, entity);

    const modelMat = modelMatrix(entity);
    const mvp = modelViewProjectionMatrix(modelMat, viewMat, projectionMat);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, entity.texture.$_am_texture);

    loadUniforms({
        gl,
        ...programs[entity.type + 'texture'],
        uniforms: [
            {
                name: 'modelViewProjectionMatrix',
                value: mvp
            },
            {
                name: 'origin',
                value: entity.origin
            },
            {
                name: 'color',
                value: entity.color
            },
            {
                name: 'time',
                value: time
            },
            {
                name: 'baseTexture',
                value: 0
            }
        ]
    });
    
    gl.drawElements(gl.TRIANGLES, entity.model.index.coords.length, gl.UNSIGNED_SHORT, 0);
    
    disableVertexAttribArray(attr);
    gl.bindTexture(gl.TEXTURE_2D, null);
    stopShader(gl);
};

const drawEntity = entity => {
    if (!entity.model) { return null; }

    switch(entity.type) {
        case 'point':
        renderPoint(entity);
        break;
        case 'line':
        renderPolygon(entity);
        break;
        case 'polygon':
            if (!entity.texture) {
                renderPolygon(entity);
            } else {
                renderPolygonTexture(entity);
            }
        break;
        default:
            if (!entity.texture) {
                renderPolygon(entity);
            } else {
                renderPolygonTexture(entity);
            }
        break;
    }
};

const coordinatesToModel = coordinates => {
    let reverse = false;
    const threeDimensionsCoordinates = coordinates.map(group => {
        if (!group) {
            reverse = true;
            return null;
        }
        return group.map(coords => 
            coords.length === 2 ? [...coords, 0] :  [...coords.filter((coord, idx) => idx < 3)]
        )
    }).filter(group => group);

    const vcolor =  coordinates.reduce((colors, group) => {
        return !group ? [...colors] :
            [
                ...colors,
                ...group.reduce((plainGroup, coords) => [...plainGroup, ...((coords[3] && getColor(coords[3]) || [-1.0, -1.0, -1.0, -1.0]))], [])
            ];
    }, []);

    const {vertices, holes, dimensions} = earcut.flatten(threeDimensionsCoordinates);
    const index = earcut(vertices, holes, dimensions);
    const xy = vertices.filter((vertex, idx) => !((idx + 1) % 3 === 0));
    const xArray = xy.filter((vertex, idx) => idx % 2 === 0);
    const yArray = xy.filter((vertex, idx) => !(idx % 2 === 0));
    const maxx = max(xArray);
    const minx = min(xArray);
    const maxy = max(yArray);
    const miny = min(yArray);

    return {
        index: reverse ? [...index].reverse() : [...index],
        coordinates: vertices,
        textureCoordinates: xy.map((coord, idx) => idx % 2 === 0 ? mapValue(coord, minx, maxx, 0, 1) : mapValue(coord, miny, maxy, 1, 0)),
        vcolor
    };
}

const checkType = feature => {
    const geometry = feature.geometry || feature;
    if (!geometry.type && !geometry.coordinates) { return null; }
    switch(geometry.type) {
        case 'Point':
            return 'point';
        case 'MultiPoint':
            return 'point';
        case 'LineString':
            return 'line';
        case 'MultiLineString':
            return 'line';
        case 'Polygon':
            return 'polygon';
        case 'MultiPolygon':
            return 'polygon';
        default:
            return null;
    }
};

const backgroundColor = color => {
    background = getColor(color);
};

const getModelFromFeature = feature => {
    const geometry = feature.geometry || feature;
    if (!geometry.type && !geometry.coordinates) { return null; }
    switch(geometry.type) {
        case 'Point':
            return {
                index: [0],
                coordinates: geometry.coordinates.length === 2 ? [...geometry.coordinates, 0.0] : [...geometry.coordinates.filter((crds, idx) => idx < 3)],
                size: geometry.coordinates[3] || 1,
                vcolor: getColor(geometry.coordinates[4]) || [-1.0, -1.0, -1.0, -1.0]
            };
        case 'MultiPoint':
            return {
                index: [...range(geometry.coordinates.length)],
                coordinates: geometry.coordinates.reduce(((plainCoords, coords) => coords.length === 2 ? [...plainCoords, ...coords, 0.0] : [...plainCoords, ...coords.filter((crds, idx) => idx < 3)]), []),
                size: geometry.coordinates.reduce((plainCoords, coords) => [...plainCoords, coords[3] || 1], []),
                vcolor: geometry.coordinates.reduce((plainCoords, coords) => [...plainCoords, ...(getColor(coords[4]) || [-1.0, -1.0, -1.0, -1.0])], [])
            };
        case 'LineString':
            return {
                ...polylines(geometry.coordinates, geometry.scale)
            };
        case 'MultiLineString':
            return geometry.coordinates.reduce((model, coords) => {
                const {index, coordinates, vcolor} = polylines(coords, geometry.scale);
                return {
                    indexStart: Math.max(...index) + 1 + model.indexStart,
                    index: [...model.index, ...index.map(idx => idx + model.indexStart)],
                    coordinates: [...model.coordinates, ...coordinates],
                    vcolor: [...model.vcolor, ...vcolor]
                }                      
            }, {
                indexStart: 0,
                index: [],
                coordinates: [],
                vcolor: []
            });
        case 'Polygon':
            return {
                ...coordinatesToModel(geometry.coordinates)
            };
        case 'MultiPolygon':
            return geometry.coordinates.reduce((model, coords) => {
                const {index, coordinates, vcolor} = coordinatesToModel(coords);
                return {
                    indexStart: Math.max(...index) + 1 + model.indexStart,
                    index: [...model.index, ...index.map(idx => idx + model.indexStart)],
                    coordinates: [...model.coordinates, ...coordinates],
                    vcolor: [...model.vcolor, ...vcolor] 
                }
            }, {
                indexStart: 0,
                index: [],
                coordinates: [],
                vcolor: []
            });
        default:
            return null;
    }
};

const entity = ({id, feature, model, scale, position, rotation, origin, color, type, textureUrl, textureCallback = () => {}, textureError = () => {}} = {}) => ({
    id,
    position: checkEntityValue(position) || [0, 0, 0],
    rotation: checkEntityValue(rotation) || [0, 0, 0],
    scale: checkEntityValue(scale) || [1.0, 1.0, 1.0],
    origin: checkEntityValue(origin) || [0, 0, 0],
    color: color && getColor(color) || [1.0, 1.0, 1.0, 1.0],
    type: feature && checkType(feature) || type || '_',
    texture: textureUrl && bindTextureFromUrl(gl, textureUrl, (texture) => textureCallback(texture), textureError) || null,
    model: createModel(gl, feature && getModelFromFeature(feature) || model || {
        index: [0, 1, 3, 3, 1, 2],
        coordinates: [-1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0]
    })
});

const updateEntityTexture = (entity, textureUrl, callback = () => {}, error = () => {}) => {
    let tmpTexture = entity.texture;
    bindTextureFromUrl(gl, textureUrl, (texture) => {
        entity.texture = texture;
        destroyTextureFromUrl(gl, tmpTexture);
        callback();
    }, error) || null;
};

const updateModel = (entity, {feature, model}) => {
    let tmpModel = entity.model;
    entity.model = createModel(gl, feature && getModelFromFeature(feature) || model || {
        index: [0, 1, 3, 3, 1, 2],
        coordinates: [-1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0]
    });
    deleteModel(gl, tmpModel);
};

const destroyEntity = (entity) => {
    deleteModel(gl, entity.model);
    if (entity.texture) {
        destroyTextureFromUrl(gl, entity.texture);
    }
};

const start = (id, options = {}) => {
    const parent = document.querySelector(id);

    if (!parent) { return null; }

    // const view = isString(options.view) ? archive[options.view] || {} : options.view || {};
    const view = options.view || {};

    width = parent.clientWidth;
    height = parent.clientHeight;
    const canvas = createElement('canvas', { width, height }, { width: width + 'px', height: height + 'px'});

    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') || null;
    gl.viewport(0, 0, width, height);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.enable(gl.DEPTH_TEST);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.depthFunc(gl.LEQUAL);

    programs = Object.keys(shaders).reduce((createdPrograms, key) => ({
        ...createdPrograms,
        [key] : {
            ...createProgram({
                gl,
                attributes,
                uniforms,
                ...shaders[key]
            })
        }
    }), {});
  
    if (!gl) { return null; }  

    parent.appendChild(canvas);

    const getData = () => ({
        gl,
        parent,
        backgroundColor,
        width,
        height,
        canvas,
        camera,
        entity,
        createElement,
        updateElement,
        cameraMatix,
        time,
        frame,
        fps,
        drawEntity,
        updateModel,
        updateEntityTexture,
        resetTime,
        destroyEntity,
        ...options
    });

    if (view.before) {
        view.before(getData());
    }

    if (view.loop) {
        loop(() => {
            const camMatrix = cameraMatix(camera, width, height);
            
            viewMat = camMatrix.viewMat;
            projectionMat = camMatrix.projectionMat;

            gl.clearColor(background[0], background[1], background[2], background[3]);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            view.loop(getData());

        }, options.fps || 30);
    }

    let resizeEvent;

    addEventListener('resize', () => {
        clearTimeout(resizeEvent);
        resizeEvent = setTimeout(() => {
            resize(canvas, parent);
            if (view.resize) {
                view.resize(getData());
            }
        }, 500);
    }, false);

    addEventListener('beforeunload', () => {
        stop();
        if (view.after) { view.after(); } 
    }, false);

    addEventListener('unload', () => {
        stop();
    }, false);

};

export default {
    start
};