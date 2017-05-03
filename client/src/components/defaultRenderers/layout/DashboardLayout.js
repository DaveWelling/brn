import React from 'react';import PropTypes from 'prop-types';

class DashboardLayout extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div name={this.props.hNode.title} id={this.props.hNode.id}  className="mdl-grid mdl-dashboard-scroll">
                {this.props.children}
            </div>
        );
    }
}

DashboardLayout.propTypes = {
    children: PropTypes.array,
    hNode: PropTypes.object
};

export default DashboardLayout;