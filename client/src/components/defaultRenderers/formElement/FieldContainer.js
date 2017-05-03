export function getTextfieldContainerClasses (props) {
    let classNames = ['mdl-textfield', 'mdl-js-textfield', 'mdl-textfield--floating-label'];
    if (props.elementErrors && props.elementErrors.length > 0) {
        classNames.push('is-invalid');
    }
    if (props.active) { // TODO:  Can this be deleted?
        classNames.push('is-focused');
    }
    if (props.value) {
        classNames.push('is-dirty');
    }
    return classNames.join(' ');
}