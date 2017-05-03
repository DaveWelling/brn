//noinspection JSUnresolvedVariable
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Spinner from '../Spinner';
import {
    getFormElements,
    getFormButtons,
    getErrorText,
    getDisabledActions,
    getHiddenActions,
    hasAnyRequiredFields
} from './formCommonMethods';

class Form extends React.Component {    
    // To get the drop downs to display when rendering the wait spinner first
    componentDidUpdate() {
        this.appMountTimeout = setTimeout(() => {
            if (window.componentHandler) {
                window.componentHandler.upgradeDom();
            }
        }, 0);
        if (!this.props.hNodeSetToFormState) {
            this.props.dispatch({
                type: `CHANGE_${this.props.namespace}_${this.props.relation}`.toUpperCase(),
                change: {
                    hNode: this.props.hNode
                }
            });
        }
    }

    componentWillUnmount() {
        clearTimeout(this.appMountTimeout);
    }
    
    render() {
        const {children, warnings, errors, newModel, formId, hNode:{title}} = this.props;
        if (!newModel) {
            return <Spinner/>;
        }
        let formFooter = getFormFooter(children);
        let formButtons = getFormButtons(children, this.props);
        let formElements = getFormElements(children, this.props);
        // Do not show fields specific errors twice.  They already appear next to the field.
        let formErrors = errors.filter(error=> typeof error.path === 'undefined');
        return (
            <form id={formId} noValidate>
                <div className="panel-title">{title}</div>
                {warnings && warnings.map((warning, index) => (
                    <div key={index} className="align-middle">
                        <span className="form-submit-error">
                            {warning}
                        </span>
                    </div>)
                )}
                <div className="mdl-grid">
                    {formElements}                    
                    <div className="mdl-cell mdl-cell--12-col">
                    {formErrors && formErrors.map((error, index) => (
                        <span key={index} className="form-submit-error">
                            {getErrorText(error)}
                        </span>)
                    )}
                    </div>
                </div>
                <div className="button-bar">
                    {formButtons}
                </div>
                {formFooter}
            </form>
        );
    }
}
//noinspection JSUnusedLocalSymbols - second param is needed, so how to remove unused first?
function mapStateToProps(state, ownProps) {
    let newModel, isNew, hNodeSetToFormState;
    const {namespace, relation, id} = ownProps.hNode;
    const formId = id;
    
    // Form state
    const formStatePath = `FORM_${namespace}_${relation}`.toUpperCase();
    let warnings = [], errors = [], submitting = false;
    if (state[formStatePath]) {
        warnings = state[formStatePath].warnings;
        errors = state[formStatePath].errors;
        submitting = state[formStatePath].submitting;
        newModel = state[formStatePath].newModel; 
        isNew = state[formStatePath].isNew;
        hNodeSetToFormState = typeof state[formStatePath].hNode !== 'undefined'; 
    }

    const disabledActions = getDisabledActions(state[formStatePath]);
    const hiddenActions = getHiddenActions(state, ownProps);
    return {
        newModel,
        namespace,
        relation,
        isNew,
        warnings,
        errors,
        formId,
        submitting,
        disabledActions,
        hiddenActions,
        hNodeSetToFormState
    };
}

Form.propTypes = {
    newModel: PropTypes.object,
    dispatch: PropTypes.func,
    relation: PropTypes.string,
    namespace: PropTypes.string,
    isNew: PropTypes.bool,
    warnings: PropTypes.array,
    errors: PropTypes.array,
    children: PropTypes.array,
    hNode: PropTypes.object,
    formId: PropTypes.string,
    disabledActions: PropTypes.array,
    hiddenActions: PropTypes.array,
    hNodeSetToFormState: PropTypes.bool
};

function getFormFooter(children) {
    if (hasAnyRequiredFields(children)) {
        return (
            <span className="form-footer">* = Required</span>
        );
    }
    return '';
}

export default connect(mapStateToProps)(Form);