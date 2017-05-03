import React from 'react';import PropTypes from 'prop-types';

class RightAlignLayout extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div name={this.props.hNode.title} id={this.props.hNode.id} className="mdl-cell--12-col mdl-cell--top">
                <div className="rightAlignLayoutChildren">{this.props.children}</div>
            </div>
        );
    }
}

RightAlignLayout.propTypes = {
    children: PropTypes.array,
    hNode: PropTypes.object
};

export default RightAlignLayout;