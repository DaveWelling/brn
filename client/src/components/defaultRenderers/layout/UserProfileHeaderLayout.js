import React from 'react';import PropTypes from 'prop-types';
import './UserProfileHeaderLayout.css';
const UserProfileHeaderLayout = (props)=> {
    let name = props.children.filter(child => child.props.hNode.hNodeType === 'ShortTextView');
    let buttons = props.children.filter(child=>child.props.hNode.hNodeType==='Button');
    let otherChildren = props.children.filter(child=> child.props.hNode.hNodeType!=='ShortTextView' && child.props.hNode.hNodeType!=='Button');
    return (
        <div name={props.hNode.title} className="profileBoxInSideNav">
            <div className="profileBoxName">
                {name}
            </div>
            <div className="profileBoxButtons">
                {buttons}
            </div>
            <div className="profileBorderBox">
            </div>
            {otherChildren}
        </div>
    );
};

UserProfileHeaderLayout.propTypes = {
    children: PropTypes.array,
    hNode: PropTypes.object
};
export default UserProfileHeaderLayout;