import {cloneElement} from 'react';

export function getDisabledActions(formState) {
    if(formState.submitting) {
        return ['submit', 'cancel', 'new', 'edit', 'remove'];
    }
    if (!formState.isDirty) {
        return ['submit'];
    }
    return [];
}

export function getHiddenActions(state, props) {
    return [];
}

export function getErrorText(error){
    if (error.message) {
        return error.message;
    } else if (typeof error === 'string') {
        return error;
    } else {
        return JSON.stringify(error);
    }
}

export function getOnFormElementChange(props) {
    // Fires for React form element onChange event
    return function(event) {
        let newModel = {...props.newModel};  // Important to create this as a clone.  Passing original object will skip render.
        newModel[event.target.name] = event.target.value;
        props.dispatch({
            type: `CHANGE_${props.namespace}_${props.relation}`.toUpperCase(),
            change: {
                newModel,
                isDirty: true
            }
        });
    };
}

export function getFormElements(children, props) {
    const {newModel, submitting, errors} = props;
    const formElements = children.filter(child => child.props.hNode.hNodeTypeGroup !== 'formButton');
    return formElements.map(element => {
        const {hNode, hNode:{propertyName, id}} = element.props;
        let value;
        let elementErrors = [];

        // Layout element doesn't need anything fancy.
        if (hNode.hNodeTypeGroup === 'layout') {
            return cloneElement(element, {
                key: id
            });
        } else { // Get value, element errors, etc.
            if (hNode.foreignNamespace && hNode.foreignRelation) {
                let propertyPath = `${hNode.foreignNamespace}:${hNode.foreignRelation}`;
                value = newModel[propertyPath];
                elementErrors = errors.filter(error => error.path === propertyPath);
            } else {
                value = newModel[propertyName];
                elementErrors = errors.filter(error => error.path === propertyName);
            }
            value = value || getDefaultValueByHNodeType(hNode.hNodeType);

            return cloneElement(element, {
                value,
                elementErrors,
                submitting,
                key: id,
                onchange: getOnFormElementChange(props)
            });
        }
    });
}

export function getFormButtons(children, props) {
    const {disabledActions, hiddenActions} = props;
    const formButtons = children.filter(child => {
        return child.props.hNode.hNodeTypeGroup === 'formButton'  &&
            !hiddenActions.includes(child.props.hNode.formAction);
    });
    return formButtons.map(button => {
            let disabled =  disabledActions.includes(button.props.hNode.formAction.toLowerCase());
            return cloneElement(button, {
                onClick: getOnClickHandler(props, button.props),
                key: button.id,
                disabled
            });
        }
    );
}


function getOnClickHandler(formProps, buttonProps) {
    return () => {
        const {dispatch, namespace, relation} = formProps;
        const formAction = buttonProps.hNode.formAction;
        const formActionType= `${formAction}_${namespace}_${relation}`.toUpperCase();
        const toDispatch = {
            type: formActionType
        };
        toDispatch[formAction.toLowerCase()] = {
            namespace,
            relation
        };
        dispatch(toDispatch);
    };
}

export function hasAnyRequiredFields(children) {
    return Object.values(children).some(o => o.props.hNode.required);
}

export function getDefaultValueByHNodeType(hNodeType){
    switch (hNodeType) {
        case 'FormButton':
            break; // do nothing
        case 'ShortText':
        case 'LongText':
        case 'Integer':
        case 'Email':
        case 'Password':
        case 'PasswordWithConfirm':
            return '';
        case 'DropDown':
            return undefined;
        case 'DropDownWithFilter':
            return undefined;
        case 'DatePicker':
        case 'Date':
            return ''; //new Date().toISOString();
        case 'EditableList':
            return [];
        case 'Toggle':
            return false;
        default:
            throw new Error(`Unexpected field type: ${hNodeType}`);
    }
}