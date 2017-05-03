'use strict';
/*!
 * https://github.com/Starcounter-Jack/JSON-Patch
 * json-patch-duplex.js version: 1.0.0
 * (c) 2013 Joachim Wester
 * MIT license
 */

module.exports = (function patch() {
    var returnObject = {
        observe: observe,
        unobserve: unobserve,
        generate: generate,
        apply: apply,
        compare: compare,
        validator: validator,
        validate: validate
    };
    let fastCheck;
    let _objectKeys = function(obj) {
        if (_isArray(obj)) {
            let keys = new Array(obj.length);

            for (let k = 0; k < keys.length; k++) {
                keys[k] = '' + k;
            }

            return keys;
        }

        if (Object.keys) {
            return Object.keys(obj);
        }

        let keys = [];
        for (let i in obj) {
            if (obj.hasOwnProperty(i)) {
                keys.push(i);
            }
        }
        return keys;
    };

    function _equals(a, b) {
        function checkObjectEquality() {
            if (a === null)
                return b === null;
            if (_isArray(a)) {
                if (!_isArray(b) || a.length !== b.length)
                    return false;

                for (let i = 0, l = a.length; i < l; i++)
                    if (!_equals(a[i], b[i])) return false;

                return true;
            }

            let bKeys = _objectKeys(b);
            let bLength = bKeys.length;
            if (_objectKeys(a).length !== bLength)
                return false;

            for (let i = 0; i < bLength; i++)
                if (!_equals(a[i], b[i])) return false;

            return true;
        }
        switch (typeof a) {
            case 'undefined': // backward compatibility, but really I think we should return false
            case 'boolean':
            case 'string':
            case 'number':
                return a === b;
            case 'object':
                return checkObjectEquality();
            default:
                return false;

        }
    }

    /* We use a Javascript hash to store each
     function. Each hash entry (property) uses
     the operation identifiers specified in rfc6902.
     In this way, we can map each patch operation
     to its dedicated function in efficient way.
     */

    /* The operations applicable to an object */
    let objOps = {
        add: function(obj, key) {
            obj[key] = this.value;
        },
        remove: function(obj, key) {
            let removed = obj[key];
            delete obj[key];
            return removed;
        },
        replace: function(obj, key) {
            let removed = obj[key];
            obj[key] = this.value;
            return removed;
        },
        move: function(obj, key, tree) {
            let getOriginalDestination = { op: '_get', path: this.path };
            apply(tree, [getOriginalDestination]);
            // In case value is moved up and overwrites its ancestor
            let original = getOriginalDestination.value === undefined
                ? undefined : JSON.parse(JSON.stringify(getOriginalDestination.value));

            let temp = { op: '_get', path: this.from };
            apply(tree, [temp]);

            apply(tree, [
                { op: 'remove', path: this.from }
            ]);
            apply(tree, [
                { op: 'add', path: this.path, value: temp.value }
            ]);
            return original;
        },
        copy: function(obj, key, tree) {
            let temp = { op: '_get', path: this.from };
            apply(tree, [temp]);
            apply(tree, [
                { op: 'add', path: this.path, value: temp.value }
            ]);
        },
        test: function(obj, key) {
            return _equals(obj[key], this.value);
        },
        _get: function(obj, key) {
            this.value = obj[key];
        }
    };

    /* The operations applicable to an array. Many are the same as for the object */
    let arrOps = {
        add: function(arr, i) {
            arr.splice(i, 0, this.value);
            // this may be needed when using '-' in an array
            return i;
        },
        remove: function(arr, i) {
            let removedList = arr.splice(i, 1);
            return removedList[0];
        },
        replace: function(arr, i) {
            let removed = arr[i];
            arr[i] = this.value;
            return removed;
        },
        move: objOps.move,
        copy: objOps.copy,
        test: objOps.test,
        _get: objOps._get
    };

    /* The operations applicable to object root. Many are the same as for the object */
    let rootOps = {
        add: function(obj) {
            rootOps.remove.call(this, obj);
            for (let key in this.value) {
                if (this.value.hasOwnProperty(key)) {
                    obj[key] = this.value[key];
                }
            }
        },
        remove: function(obj) {
            let removed = {};
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    removed[key] = obj[key];
                    objOps.remove.call(this, obj, key);
                }
            }
            return removed;
        },
        replace: function(obj) {
            let removed = apply(obj, [
                { op: 'remove', path: this.path }
            ]);
            apply(obj, [
                { op: 'add', path: this.path, value: this.value }
            ]);
            return removed[0];
        },
        move: objOps.move,
        copy: objOps.copy,
        test: function(obj) {
            return (JSON.stringify(obj) === JSON.stringify(this.value));
        },
        _get: function(obj) {
            this.value = obj;
        }
    };

    function escapePathComponent(str) {
        if (str.indexOf('/') === -1 && str.indexOf('~') === -1) return str;
        return str.replace(/~/g, '~0').replace(/\//g, '~1');
    }

    function _getPathRecursive(root, obj) {
        let found;
        for (let key in root) {
            if (root.hasOwnProperty(key)) {
                if (root[key] === obj) {
                    return escapePathComponent(key) + '/';
                }
                else if (typeof root[key] === 'object') {
                    found = _getPathRecursive(root[key], obj);
                    if (found != '') {
                        return escapePathComponent(key) + '/' + found;
                    }
                }
            }
        }
        return '';
    }

    function getPath(root, obj) {
        if (root === obj) {
            return '/';
        }
        let path = _getPathRecursive(root, obj);
        if (path === '') {
            throw new Error('Object not found in root');
        }
        return '/' + path;
    }

    let beforeDict = [];

    class Mirror {


        constructor(obj) {
            this.obj = obj;
            this.observers = [];
        }
    }

    class ObserverInfo {
        constructor(callback, observer) {
            this.callback = callback;
            this.observer = observer;
        }
    }

    function getMirror(obj) {
        for (let i = 0, ilen = beforeDict.length; i < ilen; i++) {
            if (beforeDict[i].obj === obj) {
                return beforeDict[i];
            }
        }
    }

    function getObserverFromMirror(mirror, callback) {
        for (let j = 0, jlen = mirror.observers.length; j < jlen; j++) {
            if (mirror.observers[j].callback === callback) {
                return mirror.observers[j].observer;
            }
        }
    }

    function removeObserverFromMirror(mirror, observer) {
        for (let j = 0, jlen = mirror.observers.length; j < jlen; j++) {
            if (mirror.observers[j].observer === observer) {
                mirror.observers.splice(j, 1);
                return;
            }
        }
    }

    function unobserve(root, observer) {
        observer.unobserve();
    }

    function deepClone(obj) {
        switch (typeof obj) {
            case 'object':
                return JSON.parse(JSON.stringify(obj)); //Faster than ES5 clone - http://jsperf.com/deep-cloning-of-objects/5

            case 'undefined':
                return null; // this is how JSON.stringify behaves for array items

            default:
                return obj; // no need to clone primitives
        }
    }

    function observe(obj, callback) {
        let patches = [];
        let root = obj;
        let observer;
        let mirror = getMirror(obj);

        if (!mirror) {
            mirror = new Mirror(obj);
            beforeDict.push(mirror);
        } else {
            observer = getObserverFromMirror(mirror, callback);
        }

        if (observer) {
            return observer;
        }

        observer = {};

        mirror.value = deepClone(obj);

        if (callback) {
            observer.callback = callback;
            observer.next = null;

            let dirtyCheck = () => {
                generate(observer);
            };
            fastCheck = () => {
                clearTimeout(observer.next);
                observer.next = setTimeout(dirtyCheck);
            };
            if (typeof window !== 'undefined') { //not Node
                if (window.addEventListener) { //standards
                    window.addEventListener('mouseup', fastCheck);
                    window.addEventListener('keyup', fastCheck);
                }
                else { //IE8
                    document.documentElement.attachEvent('onmouseup', fastCheck);
                    document.documentElement.attachEvent('onkeyup', fastCheck);
                }
            }
        }
        observer.patches = patches;
        observer.object = obj;

        observer.unobserve = () => {
            generate(observer);
            clearTimeout(observer.next);
            removeObserverFromMirror(mirror, observer);

            if (typeof window !== 'undefined') {
                if (window.removeEventListener) {
                    window.removeEventListener('mouseup', fastCheck);
                    window.removeEventListener('keyup', fastCheck);
                }
                else {
                    document.documentElement.detachEvent('onmouseup', fastCheck);
                    document.documentElement.detachEvent('onkeyup', fastCheck);
                }
            }
        };

        mirror.observers.push(new ObserverInfo(callback, observer));

        return observer;
    }

    function generate(observer) {
        let mirror;
        for (let i = 0, ilen = beforeDict.length; i < ilen; i++) {
            if (beforeDict[i].obj === observer.object) {
                mirror = beforeDict[i];
                break;
            }
        }
        _generate(mirror.value, observer.object, observer.patches, '', false);
        if (observer.patches.length) {
            apply(mirror.value, observer.patches);
        }
        let temp = observer.patches;
        if (temp.length > 0) {
            observer.patches = [];
            if (observer.callback) {
                observer.callback(temp);
            }
        }
        return temp;
    }

    // Dirty check if obj is different from mirror, generate patches and update mirror
    function _generate(mirror, obj, patches, path, createTests) {
        let newKeys = _objectKeys(obj);
        let oldKeys = _objectKeys(mirror);
        let changed = false;
        let deleted = false;

        //if ever "move" operation is implemented here, make sure this test runs OK: "should not generate the same patch twice (move)"

        for (let t = oldKeys.length - 1; t >= 0; t--) {
            let key = oldKeys[t];
            let oldVal = mirror[key];
            if (obj.hasOwnProperty(key) && !(obj[key] === undefined && _isArray(obj) === false)) {
                let newVal = obj[key];
                if (!(newVal instanceof Date) && typeof oldVal === 'object' && oldVal != null && typeof newVal === 'object' && newVal != null) {
                    _generate(oldVal, newVal, patches, path + '/' + escapePathComponent(key), createTests);
                } else {
                    if (oldVal != newVal) {
                        changed = true;
                        if (createTests) {
                            patches.push({
                                op: 'test',
                                path: path + '/' + escapePathComponent(key),
                                value: deepClone(oldVal)
                            });
                        }
                        patches.push({
                            op: 'replace',
                            path: path + '/' + escapePathComponent(key),
                            value: deepClone(newVal)
                        });
                    }
                }
            }
            else {
                if (createTests) {
                    patches.push({ op: 'test', path: path + '/' + escapePathComponent(key), value: deepClone(oldVal) });
                }
                patches.push({ op: 'remove', path: path + '/' + escapePathComponent(key) });
                deleted = true; // property has been deleted
            }
        }

        if (!deleted && newKeys.length == oldKeys.length) {
            return;
        }

        for (let t = 0; t < newKeys.length; t++) {
            let key = newKeys[t];
            if (!mirror.hasOwnProperty(key) && obj[key] !== undefined) {
                patches.push({ op: 'add', path: path + '/' + escapePathComponent(key), value: deepClone(obj[key]) });
            }
        }
    }

    let _isArray;
    if (Array.isArray) { //standards; http://jsperf.com/isarray-shim/4
        _isArray = Array.isArray;
    }
    else { //IE8 shim
        _isArray = function(obj) {
            return obj.push && typeof obj.length === 'number';
        };
    }

    //3x faster than cached /^\d+$/.test(str)
    function isInteger(str) {
        let i = 0;
        let len = str.length;
        let charCode;
        while (i < len) {
            charCode = str.charCodeAt(i);
            if (charCode >= 48 && charCode <= 57) {
                i++;
                continue;
            }
            return false;
        }
        return true;
    }

    /**
     * Apply a json-patch operation on an object tree
     * Returns an array of results of operations.
     * Each element can either be a boolean (if op == 'test') or
     * the removed object (operations that remove things)
     * or just be undefined
     */
    function apply(tree, patches, validate) {
        let results = []
            , p = 0
            , plen = patches.length
            , patch
            , key;
        while (p < plen) {
            patch = patches[p];
            p++;
            // Find the object
            let path = patch.path || '';
            let keys = path.split('/');
            let obj = tree;
            let t = 1; //skip empty element - http://jsperf.com/to-shift-or-not-to-shift
            let len = keys.length;
            let existingPathFragment = undefined;

            while (t < len) {
                key = keys[t];

                if (validate) {
                    if (existingPathFragment === undefined) {
                        if (obj[key] === undefined) {
                            existingPathFragment = keys.slice(0, t).join('/');
                        }
                        else if (t == len - 1) {
                            existingPathFragment = patch.path;
                        }
                        if (existingPathFragment !== undefined) {
                            this.validator(patch, p - 1, tree, existingPathFragment);
                        }
                    }
                }

                t++;
                if (key === undefined) { //is root
                    if (t >= len) {
                        results.push(rootOps[patch.op].call(patch, obj, key, tree)); // Apply patch
                        break;
                    }
                }
                if (_isArray(obj)) {
                    if (key === '-') {
                        key = obj.length;
                    }
                    else {
                        if (validate && !isInteger(key)) {
                            throw new JsonPatchError('Expected an unsigned base-10 integer value, making the new referenced value the array element with the zero-based index', 'OPERATION_PATH_ILLEGAL_ARRAY_INDEX', p - 1, patch.path, patch);
                        }
                        key = parseInt(key, 10);
                    }
                    if (t >= len) {
                        if (validate && patch.op === 'add' && key > obj.length) {
                            throw new JsonPatchError('The specified index MUST NOT be greater than the number of elements in the array', 'OPERATION_VALUE_OUT_OF_BOUNDS', p - 1, patch.path, patch);
                        }
                        results.push(arrOps[patch.op].call(patch, obj, key, tree)); // Apply patch
                        break;
                    }
                }
                else {
                    if (key && key.indexOf('~') != -1)
                        key = key.replace(/~1/g, '/').replace(/~0/g, '~'); // escape chars
                    if (t >= len) {
                        results.push(objOps[patch.op].call(patch, obj, key, tree)); // Apply patch
                        break;
                    }
                }
                obj = obj[key];
            }
        }
        return results;
    }

    function compare(tree1, tree2, createTests = false) {
        let patches = [];
        _generate(tree1, tree2, patches, '', createTests);
        return patches;
    }

    // extend Error using prototype because Error is an internal class and Babel cannot
    // extend the class normally yet.
    function JsonPatchError() {
        function copyOwnPropertiesFrom(target, source) {
            Object.getOwnPropertyNames(source)  // (1)
                .forEach(function(propKey) {  // (2)
                    let desc = Object.getOwnPropertyDescriptor(source, propKey); // (3)
                    Object.defineProperty(target, propKey, desc);  // (4)
                });
            return target;
        }
        // Use Error as a function
        let superInstance = Error.apply(null, arguments);
        copyOwnPropertiesFrom(this, superInstance);
    }
    JsonPatchError.prototype = Object.create(Error.prototype);
    JsonPatchError.prototype.constructor = JsonPatchError;

    /**
     * Recursively checks whether an object has any undefined values inside.
     */
    function hasUndefined(obj) {
        if (obj === undefined) {
            return true;
        }

        if (_isArray(obj) || typeof obj == 'object') {
            for (let i in obj) {
                if (hasUndefined(obj[i])) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Validates a single operation. Called from `jsonpatch.validate`.
     * Throws `JsonPatchError` in case of an error.
     * @param {object} operation - operation object (patch)
     * @param {number} index - index of operation in the sequence
     * @param {object} [tree] - object where the operation is supposed to be applied
     * @param {string} [existingPathFragment] - comes along with `tree`
     */
    function validator(operation, index, tree, existingPathFragment) {
        if (typeof operation !== 'object' || operation === null || _isArray(operation)) {
            throw new JsonPatchError('Operation is not an object', 'OPERATION_NOT_AN_OBJECT', index, operation, tree);
        }

        else if (!objOps[operation.op]) {
            throw new JsonPatchError('Operation `op` property is not one of operations defined in RFC-6902', 'OPERATION_OP_INVALID', index, operation, tree);
        }

        else if (typeof operation.path !== 'string') {
            throw new JsonPatchError('Operation `path` property is not a string', 'OPERATION_PATH_INVALID', index, operation, tree);
        }

        else if ((operation.op === 'move' || operation.op === 'copy') && typeof operation.from !== 'string') {
            throw new JsonPatchError('Operation `from` property is not present (applicable in `move` and `copy` operations)', 'OPERATION_FROM_REQUIRED', index, operation, tree);
        }

        else if ((operation.op === 'add' || operation.op === 'replace' || operation.op === 'test') && operation.value === undefined) {
            throw new JsonPatchError('Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)', 'OPERATION_VALUE_REQUIRED', index, operation, tree);
        }

        else if ((operation.op === 'add' || operation.op === 'replace' || operation.op === 'test') && hasUndefined(operation.value)) {
            throw new JsonPatchError('Operation `value` property is not present (applicable in `add`, `replace` and `test` operations)', 'OPERATION_VALUE_CANNOT_CONTAIN_UNDEFINED', index, operation, tree);
        }

        else if (tree) {
            if (operation.op == 'add') {
                let pathLen = operation.path.split('/').length;
                let existingPathLen = existingPathFragment.split('/').length;
                if (pathLen !== existingPathLen + 1 && pathLen !== existingPathLen) {
                    throw new JsonPatchError('Cannot perform an `add` operation at the desired path', 'OPERATION_PATH_CANNOT_ADD', index, operation, tree);
                }
            }
            else if (operation.op === 'replace' || operation.op === 'remove' || operation.op === '_get') {
                if (operation.path !== existingPathFragment) {
                    throw new JsonPatchError('Cannot perform the operation at a path that does not exist', 'OPERATION_PATH_UNRESOLVABLE', index, operation, tree);
                }
            }
            else if (operation.op === 'move' || operation.op === 'copy') {
                let existingValue = { op: '_get', path: operation.from, value: undefined };
                let error = validate([existingValue], tree);
                if (error && error.name === 'OPERATION_PATH_UNRESOLVABLE') {
                    throw new JsonPatchError('Cannot perform the operation from a path that does not exist', 'OPERATION_FROM_UNRESOLVABLE', index, operation, tree);
                }
            }
        }
    }

    /**
     * Validates a sequence of operations. If `tree` parameter is provided,
     * the sequence is additionally validated against the object tree.
     * If error is encountered, returns a JsonPatchError object
     * @param sequence
     * @param tree
     * @returns {JsonPatchError|undefined}
     */
    function validate(sequence, tree) {
        try {
            if (!_isArray(sequence)) {
                throw new JsonPatchError('Patch sequence must be an array', 'SEQUENCE_NOT_AN_ARRAY');
            }

            if (tree) {
                tree = JSON.parse(JSON.stringify(tree)); // clone tree so that we can safely try applying operations
                apply.call(this, tree, sequence, true);
            } else {
                for (let i = 0; i < sequence.length; i++) {
                    this.validator(sequence[i], i);
                }
            }
        } catch (e) {
            if (e instanceof JsonPatchError) {
                return e;
            } else {
                throw e;
            }
        }
    }

    return returnObject;
})();
