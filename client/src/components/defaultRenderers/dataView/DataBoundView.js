import _ from 'lodash';
import React from 'react';import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class DataBoundView extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        if (!this.props.value){ return null;}
        return (
        <div id={this.props.elementId}>
            {this.props.value}
        </div>);
    }
}

DataBoundView.propTypes = {
    value: PropTypes.string,
    elementId: PropTypes.string
};

function mapStateToProps(state, ownProps){
    let namespace = ownProps.hNode.namespace;
    let relation = ownProps.hNode.relation;
    let propertyName = ownProps.hNode.propertyName;
    let value;
    let elementId;
    let statePath = `${namespace}_${relation}`;
    if (state[statePath] && propertyName) {
        value = _.get(state[statePath], propertyName);
        elementId = ownProps.hNode.id;
    }
    return {
        value,
        elementId
    };
}


export default connect(mapStateToProps)(DataBoundView);