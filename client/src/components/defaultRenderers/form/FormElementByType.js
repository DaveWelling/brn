import _ from 'lodash';

export default function formElementByType (typeName) {
    const componentName = componentNameFromType(typeName);
    const formElementType = require('../formElement/'+ componentName).default;

    if (!formElementType) {
        throw new Error(`Unable to find form element with a component name of '${componentName}' based on type of '${typeName}'`);
    }

    return formElementType;
}

function componentNameFromType (typeName) {
    switch (typeName) {
        case 'date':
            return 'DatePicker';
        default: //react component names should begin with upper case
            return _.upperFirst(typeName);
    }
}