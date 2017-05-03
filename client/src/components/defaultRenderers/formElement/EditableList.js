import React from 'react';import PropTypes from 'prop-types';
import EditableListRow from './EditableListRow';

export class EditableList extends React.Component {
    constructor(props) {
        super(props);
        this.removeRowClick = this.removeRowClick.bind(this);
        this.addRowClick = this.addRowClick.bind(this);
        this.onChildChanged = this.onChildChanged.bind(this);
    }

    removeRowClick(modelIndex) {
        let newArray = [...this.props.value];
        newArray.splice(modelIndex, 1);
        this.props.onchange({target: {
            name: this.props.hNode.propertyName,
            value: newArray
        }});
    }
    addRowClick(event) {
        event.preventDefault();
        this.props.onchange({target: {
            name: this.props.hNode.propertyName,
            value: [...this.props.value, {}]
        }});
    }
    onChildChanged(event) {
        let {name, value, modelIndex} = event.target;
        
        // this.props.value[modelIndex][name] = value;
        
        
        this.props.value[modelIndex] = value;
        
        // let newArray = [...this.props.value];
        // newArray[modelIndex] = {...newArray[modelIndex]};
        // newArray[modelIndex][name] = value;
        // this.props.onchange({ target: {
        //     name: this.props.hNode.propertyName,
        //     value: newArray
        // }});




        this.props.onchange({ target: {
            name: this.props.hNode.propertyName,
            value: this.props.value
        }});
    }

    render() {
        let {
            hNode: {
                id,
                title,
                readOnly=false
            },
            elementErrors,
            submitting,
            value,
            children
        } = this.props;

        // let fieldContainerClassName = 'mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-phone';
        // let elementLength = (numericProperties ? numericProperties.length : 0) + (dropdownProperties ? dropdownProperties.length : 0);
        // let fieldContainerWidth = 0;
        //
        // if (elementLength > 0) {
        //     let size = 12/elementLength-1;
        //     fieldContainerWidth = elementLength > 3 ? '25%' : 100/(elementLength+1) + '%';
        //     fieldContainerClassName = 'mdl-cell mdl-cell--' + size + '-col mdl-cell--' + size + '-col-tablet mdl-cell--' + size + '-col-phone';
        // }

            


        return (
            <div id={id} className="mdl-cell mdl-cell--12-col mdl-cell--4-phone editable-list-container">
                <div className="editable-list-header">
                    <h4 className="field-array-label editable-list-title">
                        {title}
                    </h4>
                    <button className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab Positive editable-list-add-button" 
                            onClick={this.addRowClick}
                            disabled={readOnly || submitting}>
                      <i className="material-icons">add</i>
                    </button>
                </div>
                {value.map((model, index)=>{
                    let rowId = id + '_' + index;
                    return (<EditableListRow key={rowId} 
                                             modelIndex={index}
                                             rowId={rowId}
                                            model={model} 
                                            children={children}
                                            removeRowClick={this.removeRowClick}
                                            onchange={this.onChildChanged}
                                            errors={elementErrors}
                                             disabled={readOnly || submitting}
                    />);
                })}
            </div>
        );
    }
}

EditableList.propTypes = {
    hNode: PropTypes.object.isRequired,
    value: PropTypes.array.isRequired,
    elementErrors: PropTypes.array,
    submitting: PropTypes.bool,
    onchange: PropTypes.func.isRequired,
    children: PropTypes.array.isRequired
};


export default EditableList;
