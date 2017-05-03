import React from 'react';import PropTypes from 'prop-types';



function StyledButton(props, performAction){
    return (
        <div className="button-baselayout">
            <button id={props.id} type="button" onClick={function () {performAction(props);}}
                    className={'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored ' + props.buttonStyle}>
                {props.label}
            </button>
        </div>
    );
}

StyledButton.propTypes = {
    label: PropTypes.string,
    id: PropTypes.string,
    buttonStyle: PropTypes.string
};

export default StyledButton;