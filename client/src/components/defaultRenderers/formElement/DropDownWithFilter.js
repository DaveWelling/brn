import React from 'react';import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import DropDownItemList from './DropDownItemList';
import IconButton from './IconButton';
import Label from './Label';
import ValidationError from './ValidationError';
import {getTextfieldContainerClasses} from './FieldContainer';
import _ from 'lodash';
import {getRecords} from '../../../actions/generalPurposePersistenceActions';
import { getText } from '../../../helpers/keyEntryHelpers';

export class DropDownWithFilter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasFetchedOptions: false,
            searchText: '',
            shouldReopenOptions: false,
            optionsShouldBeVisible: false,
            window: props.window ? props.window : window
        };

        this.dropdownMenuId = `${this.props.hNode.id}_menu`;
        this.focusNextElement = this.focusNextElement.bind(this);
        this.inputClicked = this.inputClicked.bind(this);
        this.inputKeyDown = this.inputKeyDown.bind(this);
        this.menuButtonClicked = this.menuButtonClicked.bind(this);
        this.setMenuDomElement = this.setMenuDomElement.bind(this);
        this.setInputDomElement = this.setInputDomElement.bind(this);
        this.selectDropdownItem = this.selectDropdownItem.bind(this);
        this.updateSearchOptions = this.updateSearchOptions.bind(this);
        this.onBlur = this.onBlur.bind(this);

        //don't search for every keypress event. wait for a break.
        this.debouncedUpdateSearchOptions = _.debounce(this.updateSearchOptions, 250);
    }

    componentWillMount() {
        if (this.props.dispatch) {
            this.props.dispatch(getRecords(this.props.foreignNamespace, this.props.foreignRelation));
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.selectOptions) {
            return; //new props do not alter options, ignore
        }

        if (!this.state.optionsShouldBeVisible) {
            return; //options should be hidden, ignore
        }

        if (!this.props.selectOptions || nextProps.selectOptions) {
            //have received new options, force the dropdown to reopen and rerender
            this.setState({shouldReopenOptions: true});
        }
    }

    componentDidUpdate() {
        if (this.state.optionsShouldBeVisible && this.state.shouldReopenOptions) {
            if (this.menuDomElement.MaterialMenu) {
                this.menuDomElement.MaterialMenu.hide();
                this.menuDomElement.MaterialMenu.show();
            }
        }
    }

    setInputDomElement(element) {
        this.inputDomElement = element;
    }

    setMenuDomElement(element) {
        this.menuDomElement = element;
    }

    inputClicked() {
        if (this.menuDomElement.MaterialMenu) {
            this.menuDomElement.MaterialMenu.toggle();
        }

        this.setState({optionsShouldBeVisible: false, shouldReopenOptions: false});
    }

    menuButtonClicked(event) {
        event.preventDefault();
        event.stopPropagation();

        this.setState({optionsShouldBeVisible: false, shouldReopenOptions: false});
    }

    selectDropdownItem(event) {
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
        this.setState({searchText: selectedItem.title, optionsShouldBeVisible: false, shouldReopenOptions: false});
    }

    inputKeyDown(event) {
        event.preventDefault();
        event.stopPropagation();

        const searchText = this.state.searchText ? this.state.searchText : '';
        const selectedText = this.state.window.getSelection().toString();
        const caret = this.inputDomElement.selectionStart;

        let updatedSearchText = getText(event.key, searchText, selectedText, caret);

        if (updatedSearchText === undefined) {
            return;
        }
        const modelPropertyToChange = `${this.props.hNode.foreignNamespace}:${this.props.hNode.foreignRelation}`;
        if (this.props.value !== null) { //clear current value
            this.props.onchange({target:{name:modelPropertyToChange, value:null}});
        }

        this.setState({searchText: updatedSearchText, optionsShouldBeVisible: true});
        this.debouncedUpdateSearchOptions();
    }

    updateSearchOptions() {
        if (this.props.dispatch) {
            this.props.dispatch(getRecords(this.props.foreignNamespace, this.props.foreignRelation, false, this.state.searchText));
        }
        if (this.menuDomElement.MaterialMenu) {
            this.menuDomElement.MaterialMenu.show();
        }
    }

    getNextTabStop(currentDomElement, lookForwards = true) {
        const formEls = document.querySelectorAll(`input, button:not([id='${this.dropdownMenuId}']), select, textarea, a[href]`);
        const sortedEls = _.sortBy(formEls, ['tabIndex']);

        let index = sortedEls.indexOf(currentDomElement);
        if (lookForwards) {
            return sortedEls[index + 1] || sortedEls[0];
        }
        if (index > 0) { //look backwards
            return sortedEls[index - 1] || sortedEls[0];
        }
        return sortedEls[0];
    }

    getHintItem(optionsCount) {
        if (optionsCount === 0) {
            return {id: 'hint-empty', title: 'No results found.'};
        }
        return null;
    }

    focusNextElement(shiftKeyHeld) {
        const nextElement = this.getNextTabStop(this.inputDomElement, !shiftKeyHeld);
        nextElement.focus();
        this.setState({optionsShouldBeVisible: false, shouldReopenOptions: false});
    }

    getSearchText(searchText, value) {
        return searchText !== '' ? searchText : (value && value.title ? value.title : '');
    }

    getTextField(hNode, searchText){
        return {
            touched: hNode.touched,
            invalid: hNode.invalid,
            active: hNode.active,
            dirty: !!searchText
        };
    }

    onBlur(event){
        this.setState(this.state);
        if (this.props.onblur) {
            this.props.onblur(event);
        }
    }
    render() {
        let {
            hNode,
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
            selectOptions
        } = this.props;
        
        const searchText = this.getSearchText(this.state.searchText, value);
        //const textFieldClassNames = getTextfieldContainerClasses(this.getTextField(hNode, searchText));
        const textFieldClassNames = getTextfieldContainerClasses(this.props);
        const hintItem = this.getHintItem(selectOptions ? selectOptions.length : 0);
        return (
            <div id={'outer'+id} className="mdl-grid mdl-grid--no-spacing dropdown-with-filter no-margin">
                <div className="mdl-cell mdl-cell--12-col mdl-cell--4-phone">
                    <div className={textFieldClassNames} onClick={this.inputClicked}>
                        <Label for={id} label={title} placeholder={placeholder} title={title} required={required}/>
                        <input
                            aria-invalid={elementErrors.length>0}
                            className="mdl-textfield__input"
                            id={id}
                            name={propertyName}
                            onChange={onchange}
                            onBlur={this.onBlur}
                            onKeyDown={this.inputKeyDown}
                            ref={this.setInputDomElement}
                            required={required}
                            disabled={readOnly || submitting}
                            type="text"
                            value={searchText}
                        />
                        <ValidationError errors={elementErrors} />
                        <div className="menu-wrapper">
                            <IconButton id={this.dropdownMenuId} onClick={this.menuButtonClicked} alt="down arrow"
                                        iconFontName="keyboard_arrow_down" required={required}/>
                            <DropDownItemList
                                for={this.dropdownMenuId}
                                refCallback={this.setMenuDomElement}
                                listItems={selectOptions}
                                selectedItem={value}
                                itemClick={this.selectDropdownItem}
                                itemTextPropertyName={propertyName}
                                hintItem={hintItem}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

DropDownWithFilter.propTypes = {
    actions: PropTypes.object,
    id: PropTypes.string,
    hNode: PropTypes.object.isRequired,
    selectOptions: PropTypes.array, //items in dropdown
    foreignNamespace: PropTypes.string,
    foreignRelation: PropTypes.string,
    dispatch: PropTypes.func,
    elementErrors: PropTypes.array,
    submitting: PropTypes.bool,
    onchange: PropTypes.func,
    onblur: PropTypes.func,
    value:PropTypes.object,
    window: PropTypes.object
};


const mapStateToProps = (state, ownProps) => {
    let {foreignRelation, foreignNamespace, propertyName, id} = ownProps.hNode;
    let selectOptions = [];
    let statePath = `${foreignNamespace}_${foreignRelation}`;
    if (state[statePath]) {
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


export default connect(mapStateToProps)(DropDownWithFilter);
