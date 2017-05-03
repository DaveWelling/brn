export default {
    getKey,
    setKey,
    deleteKey,
    getLocation,
    setLocation
};

function getKey(key) {
    return window.localStorage[key];
}

function setKey(key, value) {
    return window.localStorage[key] = value;
}

function deleteKey(key){
    window.localStorage.removeItem(key);
}

function getLocation(){
    return window.location;
}

function setLocation(path) {
    window.location = path;
}
