export function getText(keyPressed, currentText, selectedText, caret) {
    if (!isValidKey(keyPressed)) {
        return currentText; //return what you already have
    }

    if (isModifierKey(keyPressed)) {
        return currentText; //key does not change input (yet), return what you have
    }

    return parse(keyPressed, currentText, selectedText, caret);
}

function isValidKey(keyPressed) {
    if (keyPressed === undefined || keyPressed === null) {
        return false;
    }

    return true;
}

function isModifierKey(keyPressed) {
    return ['Shift', 'Control', 'Alt'].indexOf(keyPressed) >= 0;
}

function parse(keyPressed, currentText, selectedText, caret) {
    if (keyPressed.length === 1) {
        if (selectedText.length > 0) {
            return (currentText.replace(selectedText, keyPressed) || keyPressed);
        }
        if (caret === currentText.length) {
            return currentText.concat(keyPressed);
        }
        return currentText.slice(0, caret) + keyPressed + currentText.slice(caret);
    }

    if ((keyPressed === 'Backspace' || keyPressed === 'Delete') && currentText.length >= 1) {
        if (selectedText.length > 0) {
            return currentText.replace(selectedText, '');
        }
        if (keyPressed === 'Backspace' && caret !== 0) {
            return currentText.slice(0, caret - 1) + currentText.slice(caret);
        }
        if (keyPressed === 'Delete' && caret !== currentText.length - 1) {
            return currentText.slice(0, caret) + currentText.slice(caret + 1);
        }
    }

    return currentText;
}