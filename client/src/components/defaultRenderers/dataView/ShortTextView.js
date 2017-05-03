import _ from 'lodash';
import React from 'react';import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class ShortTextView extends React.Component{
    constructor(props){
        super(props);
    }
    render(){return (
        <span>
            {this.props.value}
        </span>
    );
    }
}

ShortTextView.propTypes = {
    value: PropTypes.string
};

function mapStateToProps(state, ownProps){
    let statePath = `${ownProps.hNode.namespace}_${ownProps.hNode.relation}`;
    let propertyName = ownProps.hNode.propertyName;
    let value;
    if (state[statePath] ) {
        value = _.get(state[statePath], 'activeRecord.' + propertyName);
    } else {
        value = '';
    }
    return {
        value
    };
}


export default connect(mapStateToProps)(ShortTextView);