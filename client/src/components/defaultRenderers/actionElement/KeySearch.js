import React from 'react';import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Label from '../formElement/Label';
import {getTextfieldContainerClasses} from '../formElement/FieldContainer';
import { getText } from '../../../helpers/keyEntryHelpers';

export class KeySearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            maxLength: 0,
            window: props.window ? props.window : window,
            showInput: false
        };

        this.setInputDomElement = this.setInputDomElement.bind(this);
        this.inputKeyDown = this.inputKeyDown.bind(this);
        this.inputChanged = this.inputChanged.bind(this);
        this.updateSearchOptions = this.updateSearchOptions.bind(this);
        this.onSearchClick = this.onSearchClick.bind(this);
        this.onCloseClick = this.onCloseClick.bind(this);
    }

    componentDidUpdate() {
        this.inputDomElement.focus();
    }

    componentWillUnmount() {
        this.updateSearchOptions('');
    }

    setInputDomElement(element) {
        this.inputDomElement = element;
        this.setState({
            maxLength: this.inputDomElement ? (this.inputDomElement.clientWidth / 10) : 0
        });
    }

    inputKeyDown(event) {
        event.preventDefault();

        const selectedText = this.state.window.getSelection().toString();
        const caret = this.inputDomElement.selectionStart;

        const updatedSearchText = getText(event.key, this.props.searchText, selectedText, caret);
        this.updateSearchOptions(updatedSearchText);
    }

    inputChanged(event) {
        const currentValue = event.target.value;
        const previousValue = this.props.searchText;
        if (previousValue !== currentValue) {
            this.updateSearchOptions(currentValue);
        }
    }

    updateSearchOptions(updatedSearchText) {
        const {action} = this.props;

        this.props.dispatch({
            type: action,
            search: {searchText: updatedSearchText}
        });
    }

    onSearchClick(event) {
        event.preventDefault();
        this.setState({
            showInput: !this.state.showInput
        });
    }

    onCloseClick(event) {
        event.preventDefault();
        this.setState({
            showInput: false
        });
        this.updateSearchOptions('');
    }

    render() {
        let field = {
            active: true,
            dirty: this.props.searchText ? true : false
        };

        let keySearchContainerClassNames = 'key-search-container mdl-grid mdl-cell mdl-cell--9-col mdl-cell--9-col-tablet mdl-cell--9-col-phone';
        let keySearchPushClass = this.state.showInput ? 'key-search-container-open' : 'key-search-container-close';
        let keySearchClassNames = getTextfieldContainerClasses(field);
        keySearchClassNames = keySearchClassNames + (this.state.showInput ? ' is-focused' : '');
        let closeSearchDisplay = this.state.showInput ? 'block' : 'none';

        return (
            <div className={keySearchContainerClassNames}>
                <div id="key-search-push" className={keySearchPushClass}/>
                <button id="search-icon-container" className="mdl-button mdl-js-button mdl-button--icon search-icon" onClick={this.onSearchClick}>
                    <i className="material-icons md-36">search</i>
                </button>
                <div id="key-search" className={keySearchClassNames} style={{display:closeSearchDisplay}}>
                    <Label placeholder={this.props.title}/>
                    <input
                        className="mdl-textfield__input"
                        onClick={this.inputClicked}
                        onKeyDown={this.inputKeyDown}
                        onChange={this.inputChanged}
                        ref={this.setInputDomElement}
                        value={this.props.searchText}
                        maxLength={this.state.maxLength}
                        type="text"
                    />
                </div>
                <button id="close-icon-container" onClick={this.onCloseClick} className="mdl-button mdl-js-button mdl-button--icon close-search-icon" style={{display:closeSearchDisplay}}>
                    <i className="material-icons md-48">close</i>
                </button>
            </div>
        );
    }
}

KeySearch.propTypes = {
    dispatch: PropTypes.func,
    action: PropTypes.string,
    title: PropTypes.string,
    searchText: PropTypes.string,
    window: PropTypes.object
};

function mapStateToProps(state, ownProps) {
    const action = ownProps.hNode.customAction;
    const title = ownProps.hNode.title;
    const searchText = getSearchText(state, action);
    return {
        action,
        title,
        searchText
    };
}

function getSearchText(state, actionType) {
    if (!state || !state.search || !state.search[actionType]) {
        return '';
    }
    return state.search[actionType].searchText;
}

export default connect(mapStateToProps)(KeySearch);