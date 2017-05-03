import React from 'react';import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import DropDownItemList from './DropDownItemList';
import IconButton from './IconButton';
import Label from './Label';
import ValidationError from './ValidationError';
import {getTextfieldContainerClasses} from './FieldContainer';
import {getRecords} from '../../../actions/generalPurposePersistenceActions';

export class DropDown extends React.Component {
    constructor (props) {
        super(props);
        this.dropdownMenuId = `${this.props.hNode.id}_menu`;
        this.state = {hasFetchedOptions: false}; //local state only
        this.setMenuDomElement = this.setMenuDomElement.bind(this);
        this.setInputDomElement = this.setInputDomElement.bind(this);
        this.menuButtonClicked = this.menuButtonClicked.bind(this);
        this.selectDropdownItem = this.selectDropdownItem.bind(this);
        this.inputClicked = this.inputClicked.bind(this);
    }

    componentWillMount () {
        if (this.state.hasFetchedOptions)
            return;

        // this 'if' statement is a hack to get around a problem testing
        // Don't judge me.  It's 9pm on Saturday and I've been working
        // all day.
        if (this.props.dispatch) {
            this.props.dispatch(getRecords(this.props.foreignNamespace, this.props.foreignRelation));
        }
        // this.appMountTimeout = setTimeout(() => {
        //     if(window.componentHandler && this.inputDomElement) {
        //         ReactDOM.findDOMNode(this.inputDomElement);
        //         window.componentHandler.upgradeElement(ReactDOM.findDOMNode(this.inputDomElement));
        //     }
        // }, 0);
        
        this.setState({hasFetchedOptions: true});
    }

    // componentDidUpdate(){
    //     // Do not allow the default value parsing in redux-form to overwrite
    //     // the field value with the plain string from the text
    //     // input.  Only the drop down should be able to change
    //     // the value.
    //     let that = this;
    //     function parse(value){
    //         if (typeof value !== 'object'){
    //             return that.props.field.value;
    //         }
    //         return value;
    //     }
    //     this.props.options.parse = parse;
    // }

    setInputDomElement (element) {
        this.inputDomElement = element;
    }

    setMenuDomElement (element) {
        this.menuDomElement = element;
    }

    inputClicked () {
        if (this.menuDomElement.MaterialMenu) {
            this.menuDomElement.MaterialMenu.toggle();
        }
    }

    menuButtonClicked (event) {
        event.preventDefault();
        event.stopPropagation();
        this.inputDomElement.focus();
    }

    selectDropdownItem (event) {
        event.preventDefault();
        event.stopPropagation();
        const listItem = event.currentTarget;
        const selectedItem = {_id: listItem.getAttribute('data-id'), title: listItem.getAttribute('data-title')};
        this.value = selectedItem;
        const modelPropertyToChange = `${this.props.hNode.foreignNamespace}:${this.props.hNode.foreignRelation}`;
        const newEventObject = {target: {name: modelPropertyToChange, value: selectedItem}};
        this.props.onchange(newEventObject);
        if (this.menuDomElement.MaterialMenu) {
            this.menuDomElement.MaterialMenu.toggle();
        }
    }

    render () {
        let textfieldClassNames = getTextfieldContainerClasses(this.props);
        let {
            hNode: {
                id,
                title,
                readOnly=false,
                placeholder,
                required=false,
                propertyName,
            },
            elementErrors,
            value,
            submitting,
            onchange,
            onblur,
            selectOptions
        } = this.props;
        
        return (
            <div className="mdl-grid mdl-grid--no-spacing dropdown no-margin">
                <div className="mdl-cell mdl-cell--12-col mdl-cell--4-phone">
                    <div className={textfieldClassNames} onClick={this.inputClicked}>
                        <Label for={id} label={title} placeholder={placeholder} title={title} required={required} />
                        <input
                            aria-invalid={elementErrors.length>0}
                            className="mdl-textfield__input"
                            id={id}
                            name={propertyName}
                            onChange={onchange}
                            onBlur={onblur}
                            readOnly={Boolean(true)}
                            ref={this.setInputDomElement}
                            disabled={readOnly || submitting}
                            required={required}
                            type="text"
                            value={value ? (value.title || value[propertyName] || value) : ''}
                        />
                        <ValidationError errors={elementErrors} />
                        <div className="menu-wrapper">
                            <IconButton id={this.dropdownMenuId} onClick={this.menuButtonClicked} alt="down arrow" iconFontName="keyboard_arrow_down" required={required} />
                            <DropDownItemList
                                for={this.dropdownMenuId}
                                refCallback={this.setMenuDomElement}
                                listItems={selectOptions}
                                selectedItem={value}
                                itemClick={this.selectDropdownItem}
                                itemTextPropertyName={propertyName}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

DropDown.propTypes = {
    id: PropTypes.string,
    selectOptions: PropTypes.array, //items in dropdown
    foreignRelation: PropTypes.string.isRequired,
    foreignNamespace: PropTypes.string.isRequired,
    dispatch: PropTypes.func,
    value: PropTypes.object,
    elementErrors: PropTypes.array,
    submitting: PropTypes.bool,
    onchange: PropTypes.func,
    hNode: PropTypes.object
};


const mapStateToProps = (state, ownProps) => {
    let {foreignRelation, foreignNamespace, propertyName, id} = ownProps.hNode;

    let selectOptions = [];
    
    let statePath = `${foreignNamespace}_${foreignRelation}`;
    if (state[statePath]){
        selectOptions = state[statePath].items;
    }

    return {
        id,
        selectOptions,
        foreignRelation,
        foreignNamespace,
        propertyName
    };
};

export default connect(mapStateToProps)(DropDown);
