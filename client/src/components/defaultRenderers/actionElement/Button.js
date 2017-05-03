import React from 'react';import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import UnstyledButton from './UnstyledButton';
import StyledButton from './StyledButton';

export class Button extends React.Component{
    constructor(props) {
        super(props);
        this.performAction = this.performAction.bind(this);
    }
    performAction(props){
        let {
            customAction,
            forAction,
            namespace,
            relation,
            dispatch,
        } = props;
        
        if (customAction){
            const toDispatch = {type: customAction};
            toDispatch[forAction] = {namespace, relation};
            dispatch(toDispatch);
        }
    }
    render() {
        return this.props.buttonStyle === 'unstyled' ?
               UnstyledButton(this.props, this.performAction) :
               StyledButton(this.props, this.performAction);
    }
}


Button.propTypes = {
    dispatch: PropTypes.func,
    buttonStyle: PropTypes.string,
    customAction: PropTypes.string,
    namespace: PropTypes.string,
    relation: PropTypes.string,
    hNode: PropTypes.object,
    forAction: PropTypes.string
};


function getIdForButton(props){
    return props.hNode ? props.hNode.id : '';
}

function getButtonStyle (ownProps) {
    if (!ownProps.hNode && !ownProps.hNode.style)
        return;
    return ownProps.hNode.style;
}
function mapStateToProps(state, ownProps){
    let label = ownProps.hNode ? ownProps.hNode.title : '';
    let id = getIdForButton(ownProps);
    let customAction;
    if (ownProps.hNode && ownProps.hNode.customAction){
        customAction = ownProps.hNode.customAction;
    }    
    const buttonStyle = getButtonStyle(ownProps);

    return {
        label,
        id,
        customAction,
        buttonStyle,
        namespace : ownProps.hNode.namespace,
        relation: ownProps.hNode.relation,
        forAction: ownProps.hNode.forAction
    };
}

export default connect(mapStateToProps)(Button);