import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import './navHeading.css';


class NavHeading extends React.Component {

    render(){
        const props = this.props;
        let {navHeadingChildren} = props;
        return (
            <div>
                { navHeadingChildren.length === 0 && 
                    <div className="mdl-nav-option">
                        <div className="mdl-navigation__link" >{props.hNode.title}</div>
                    </div>
                }
                { navHeadingChildren.length > 0 && 
                    <div className="mdl-nav-option navigation__header">{props.hNode.title} 
                            {navHeadingChildren}
                    </div>}
            </div>
        );
    }    
}
NavHeading.propTypes = {
    dispatch: PropTypes.func,
    otherChildren: PropTypes.array
};

function mapStateToProps(state, ownProps) {
    const navHeadingChildren = ownProps.children.filter(child=>child.props.hNode.hNodeTypeGroup === 'navHeading');
    const otherChildren = ownProps.children.filter(child=>child.props.hNode.hNodeTypeGroup !== 'navHeading');

    return {
        navHeadingChildren,
        otherChildren
    };
}



NodeRoute.propTypes = {
    child: PropTypes.object
};
    
export default connect(mapStateToProps)(NavHeading);
