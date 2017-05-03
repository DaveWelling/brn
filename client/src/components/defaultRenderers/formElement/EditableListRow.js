import React, {cloneElement} from 'react';
import PropTypes from 'prop-types';
import {getDefaultValueByHNodeType} from '../form/Form';

class EditableListRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            model: props.model
        };
        
        this.localOnChange = this.localOnChange.bind(this);
        this.getRowElements = this.getRowElements.bind(this);
    }
    localOnChange(event) {
        // onchange: (event)=>onchange({
        //     target:{
        //         name:propertyPath,
        //         value: event.target.value,
        //         modelIndex
        //     }
        // })
        let {name, value} = event.target;
        this.setState({
            model: {...this.state.model, [name]: value}
        });
    }

    getRowElements() {
        const {children, submitting, onchange, errors, modelIndex} = this.props;
        const {model} = this.state;
        const formElements = children.filter(child => child.props.hNode.hNodeTypeGroup !== 'formButton');
        return formElements.map((element) => {
            const {hNode, hNode:{propertyName, id}} = element.props;
            let value;
            let propertyPath = propertyName;
            if (hNode.foreignNamespace && hNode.foreignRelation) {
                propertyPath = `${hNode.foreignNamespace}:${hNode.foreignRelation}`;
            }
            let elementErrors = errors.filter(error => error.path === propertyPath);
            value = model[propertyPath];
            value = value || getDefaultValueByHNodeType(hNode.hNodeType);
            let elementId = id + '_' + modelIndex;
            let overrideHNode = {...element.props.hNode, id:elementId};
            return cloneElement(element, {
                value,
                elementErrors,
                submitting,
                hNode: overrideHNode,
                key: elementId,
                onchange: this.localOnChange,
                onblur: (event)=>onchange({
                    target:{
                        name: propertyPath,
                        value: this.state.model,
                        modelIndex
                    }
                })
            });
        });
    }
    render() {
        const {removeRowClick, modelIndex, rowId} = this.props;
        let rowElements = this.getRowElements();
        return (
            <div id={rowId} className="mdl-grid" style={{margin:'0', padding:'0'}}>
                {rowElements}
                <div className="mdl-cell mdl-cell--1-col mdl-cell--1-col-tablet mdl-cell--1-col-phone">
                    <button className="mdl-button mdl-js-button mdl-button--icon editable-list-remove-button" 
                            onClick={function(event){
                                event.preventDefault();
                                removeRowClick(modelIndex);}
                            }>
                        <i className="material-icons">clear</i>
                    </button>
                </div>
            </div>
        );
    }
}

EditableListRow.propTypes = {
    children: PropTypes.array.isRequired,
    model: PropTypes.object.isRequired,
    removeRowClick: PropTypes.func.isRequired,
    onchange: PropTypes.func.isRequired,
    errors: PropTypes.array,
    modelIndex: PropTypes.number.isRequired,
    rowId: PropTypes.string.isRequired
};


export default EditableListRow;
