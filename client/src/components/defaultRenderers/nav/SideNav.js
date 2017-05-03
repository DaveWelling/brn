import React from 'react';import PropTypes from 'prop-types';
import './SideNav.css';

const SideNav = ({children}) => (
    <nav className="mdl-navigation side-nav">        
            {children}
    </nav>
);

SideNav.propTypes = {
    children: PropTypes.array
};

export default SideNav;