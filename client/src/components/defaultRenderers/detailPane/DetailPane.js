import React from 'react';
import PropTypes from 'prop-types';
import HNode from '../../HNode';

const DetailPane = (props) => (
    <div id={props.hNode.id}>
        {props.hNode.children.map(child => <HNode key={child.id} hNode={child}/>)}
    </div>
);


DetailPane.propTypes = {
    hNode: PropTypes.object,
};

export default DetailPane;


