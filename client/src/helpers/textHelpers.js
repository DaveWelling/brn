export default {
    toLabel
};
export function toLabel(textToChange) {
    // If using curie, remove curie prefix
    let colonIndex = textToChange.indexOf(':');
    if (colonIndex >= 0) {
        textToChange = textToChange.substr(colonIndex + 1);
    }

    // If using path, remove forward slash
    let slashIndex = textToChange.indexOf('/');
    if (slashIndex  >= 0) {
        textToChange = textToChange.substr(slashIndex  + 1);
    }
    // insert a space between lower & upper
    return textToChange.replace(/([a-z,0-9])([A-Z,0-9])/g, '$1 $2')
    // space before last upper in a sequence followed by lower
        .replace(/\b([A-Z,0-9]+)([A-Z])([a-z])/, '$1 $2$3')
        // uppercase the first character
        .replace(/^./, function (str) {
            return str.toUpperCase();
        });
}