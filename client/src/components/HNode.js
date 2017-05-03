import React from 'react';import PropTypes from 'prop-types';
import {connect} from 'react-redux';

class HNode extends React.Component{
	constructor(props){
		super(props);
		if (!props.hNode || !props.hNode.hNodeType){
            debugger;
        }
	}

	render(){
        let {hNodeType, hNodeTypeGroup} = this.props;
        const hNodeTypeComponent = require(`./defaultRenderers/${hNodeTypeGroup}/${hNodeType}`).default;
		const toRender = React.createElement(
			hNodeTypeComponent,
			{
                ...this.props
			},
			createChildren(this.props)
		);
        if (!hNodeTypeComponent || !toRender) {
            throw new Error(`A piece of the UI is not set up correctly. Attempting to render ${hNodeType} in the ${hNodeTypeGroup} group of UI components.`);
        }
        return toRender;
	}
}

HNode.propTypes = {
	dispatch: PropTypes.func,
	hNode: PropTypes.object,
	hNodeType: PropTypes.string,
    hNodeTypeGroup: PropTypes.string
};

function createChildren(props){
	let { hNode} = props;
	if (!hNode.children) return [];
	return hNode.children.map((child, i)=>
		React.createElement(connect(mapStateToProps)(HNode),
		{'hNode': child, key:child.hNodeType+i})
	);
}

function mapStateToProps(state, ownProps){
    if (!ownProps.hNode || !ownProps.hNode.hNodeType) {
        debugger; // This should never happen.
    }
    return {
        hNode: ownProps.hNode,
        hNodeType: ownProps.hNode.hNodeType,
        hNodeTypeGroup: ownProps.hNode.hNodeTypeGroup
    };
}

export default connect(mapStateToProps)(HNode);