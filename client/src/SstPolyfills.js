if (!Array.prototype.find) {
    Array.prototype.find = function(predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        let list = Object(this);
        let length = list.length >>> 0;
        let thisArg = arguments[1];
        let value;

        for (let i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}

//mdDateTimePicker needs this polyfill for IE9-11: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
if (typeof window.CustomEvent !== 'function')
{
    let CustomEvent = function(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        let evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    };
    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
}

//mdDateTimePicker needs this (non-standard WebKit) polyfill for IE9-11: https://gist.github.com/hsablonniere/2581101#file-index-js
if (!window.Element.prototype.scrollIntoViewIfNeeded) {
    window.Element.prototype.scrollIntoViewIfNeeded = function (centerIfNeeded) {
        function withinBounds(value, min, max, extent) {
            if (false === centerIfNeeded || max <= value + extent && value <= min + extent) {
                return Math.min(max, Math.max(min, value));
            } else {
                return (min + max) / 2;
            }
        }

        function makeArea(left, top, width, height) {
            return  { 'left': left, 'top': top, 'width': width, 'height': height
                      , 'right': left + width, 'bottom': top + height
                      , 'translate':
                      function (x, y) {
                          return makeArea(x + left, y + top, width, height);
                      }
                      , 'relativeFromTo':
                      function (lhs, rhs) {
                          let newLeft = left, newTop = top;
                          lhs = lhs.offsetParent;
                          rhs = rhs.offsetParent;
                          if (lhs === rhs) {
                              return area;
                          }
                          for (; lhs; lhs = lhs.offsetParent) {
                              newLeft += lhs.offsetLeft + lhs.clientLeft;
                              newTop += lhs.offsetTop + lhs.clientTop;
                          }
                          for (; rhs; rhs = rhs.offsetParent) {
                              newLeft -= rhs.offsetLeft + rhs.clientLeft;
                              newTop -= rhs.offsetTop + rhs.clientTop;
                          }
                          return makeArea(newLeft, newTop, width, height);
                      }
                    };
        }

        let parent, elem = this, area = makeArea(
            this.offsetLeft, this.offsetTop,
            this.offsetWidth, this.offsetHeight);
        while ((parent = elem.parentNode) instanceof HTMLElement) {
            let clientLeft = parent.offsetLeft + parent.clientLeft;
            let clientTop = parent.offsetTop + parent.clientTop;

            // Make area relative to parent's client area.
            area = area.
                relativeFromTo(elem, parent).
                translate(-clientLeft, -clientTop);

            parent.scrollLeft = withinBounds(
                parent.scrollLeft,
                area.right - parent.clientWidth, area.left,
                parent.clientWidth);

            parent.scrollTop = withinBounds(
                parent.scrollTop,
                area.bottom - parent.clientHeight, area.top,
                parent.clientHeight);

            // Determine actual scroll amount by reading back scroll properties.
            area = area.translate(clientLeft - parent.scrollLeft,
                                  clientTop - parent.scrollTop);
            elem = parent;
        }
    };
}

if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function(predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.findIndex called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        let list = Object(this);
        let length = list.length >>> 0;
        let thisArg = arguments[1];
        let value;

        for (let i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return i;
            }
        }
        return -1;
    };
}
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(searchString, position) {
        let subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        let lastIndex = subjectString.lastIndexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}