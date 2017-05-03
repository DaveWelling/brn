
import React from 'react';import PropTypes from 'prop-types';

function UnstyledButton(props, performAction){
    return (
        <div >
            <button id={props.id} type="button"
                    onClick={function () {performAction(props);}}>
                {props.label}
            </button>
        </div>
    );
}

UnstyledButton.propTypes = {
    label: PropTypes.string,
    id: PropTypes.string
};
export default UnstyledButton;