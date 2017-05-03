import React from 'react';
import PropTypes from 'prop-types';
import {getFormElements} from './formCommonMethods';
import {connect} from 'react-redux';
import './SubForm.css';

class SubForm extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        clearTimeout(this.appMountTimeout);
    }
    render() {
        this.appMountTimeout = setTimeout(() => {
            if (window.componentHandler) {
                window.componentHandler.upgradeDom();
            }
        }, 0);
        const {children, id} = this.props;
        let formElements = getFormElements(children, this.props);
        return (
            <fieldset className="subform-content" id={id}>
                {formElements}
            </fieldset>
        );
    }
}

//noinspection JSUnusedLocalSymbols - second param is needed, so how to remove unused first?
function mapStateToProps(state, ownProps) {
    let newModel, isNew;
    const {namespace, relation, id} = ownProps.hNode;

    // Form state
    const formStatePath = `FORM_${namespace}_${relation}`.toUpperCase();
    let warnings = [], errors = [], submitting = false;
    if (state[formStatePath]) {
        warnings = state[formStatePath].warnings;
        errors = state[formStatePath].errors;
        submitting = state[formStatePath].submitting;
        newModel = state[formStatePath].newModel;
        isNew = state[formStatePath].isNew;
    }

    return {
        newModel,
        namespace,
        relation,
        isNew,
        warnings,
        errors,
        id,
        submitting
    };
}

SubForm.propTypes = {
    children: PropTypes.array,
    title: PropTypes.string,
    id: PropTypes.string
};



export default connect(mapStateToProps)(SubForm);