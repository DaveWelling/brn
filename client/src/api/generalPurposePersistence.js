import 'isomorphic-fetch';
import hal from '../halUtilities';

class HttpError extends Error {
    // constructor is optional; you should omit it if you just want a custom error
    // type for inheritance and type checking
    constructor(message = 'Default message', status) {
        super(message);
        this.status = status;
    }
}

export function getUrlForRelation(namespace, relation, optionalId) {
    if (typeof optionalId !== 'undefined') {
        return `/api/${namespace}/${relation}/${optionalId}`;
    }
    return `/api/${namespace}/${relation}`;
}


export default {
    get,
    getAll,
    save,
    insert: save,
    update: patch,
    remove
};

export function get(url) {
    let params = setGetMethod();
    return fetch(url, params).then(
        response => {
            if (response.ok) {
                // don't try to deserialize if no content
                if (response.status !== 204) {
                    return response.json();
                }
                return null;
            }
            throw new HttpError(`Request to patch ${url} failed with status ${response.status}:${response.statusText}.`, response.status);
        }
    );
}

function getAll(url) {
    let params = setGetMethod();
    return fetch(url, params).then(
        response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(`Request to get ${url} failed with status ${response.status}:${response.statusText}.`);
        }
    );
}

export function save(url, data) {
    let params = setPostMethod(data);
    let urlOnly = hal.getUrlWithoutId(url);
    return fetch(urlOnly, params).then(
        response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(`Request to post ${url} failed with status ${response.status}:${response.statusText}.`);
        }
    );
}

//noinspection JSUnusedLocalSymbols
function patch(url, patch) {
    let id = hal.getIdFromUrl(url);
    let params = setPatchMethod(patch, id);
    return fetch(url, params).then(
        response => {
            if (response.ok) {
                // don't try to deserialize if no content
                if (response.status !== 204) {
                    return response.json();
                }
                return null;
            }
            throw new HttpError(`Request to patch ${url} failed with status ${response.status}:${response.statusText}.`, response.status);
        }
    );
}

function remove(url){
    let params = setDeleteMethod();
    return fetch(url,params).then(
        response => {
            if (response.ok) {
                if (response.status !== 204) {
                    return response.json();
                } else {
                    return response;
                }
            } else {
                if (response.status === 400) {
                    return response.json();
                } else {
                    return response;
                }
            }
        }).then(function(response) {
            if (!Array.isArray(response)) {
                if (response.ok) {
                    return;
                } else {
                    if (response.statusCode !== 400) {
                        throw new Error(`Request to remove failed with status ${response.status}:${response.statusText}.  Url: ${url} `);
                    }
                }
            }

            let errorString = '';
            const errors = JSON.parse(response.message);
            errors.forEach(function(error) {
                errorString += error + ' ';
            });

            throw new Error(errorString);
        });
}

function setDeleteMethod(){
    let params = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    return params;
}

function setGetMethod() {
    let params = {
        method: 'get'
    };
    return params;
}

function setPostMethod(data) {
    let params = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    return params;
}

function setPatchMethod(data) {
    let params = {
        method: 'PATCH',
        body: JSON.stringify(data) || '[]',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    return params;
}

