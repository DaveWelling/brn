export function getParentScrollElement(parentNode) {
    if (!parentNode) {
        return undefined;
    }

    if (parentNode.className && parentNode.className.includes('mdl-grid-scroll')) {
        return parentNode;
    }
    else {
        return getParentScrollElement(parentNode.parentNode);
    }
}