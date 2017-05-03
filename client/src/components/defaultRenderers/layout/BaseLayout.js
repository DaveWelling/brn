import React from 'react';import PropTypes from 'prop-types';

class BaseLayout extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div name={this.props.hNode.title} id={this.props.hNode.id} className="">
                {this.props.children}
            </div>
        );
    }
}

BaseLayout.propTypes = {
    children: PropTypes.array,
    hNode: PropTypes.object
};

export default BaseLayout;