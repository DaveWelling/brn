import React from 'react';
import PropTypes from 'prop-types';

const FormButton = (props) => {    
    const { buttonStyle, title, id} = props.hNode;
    const { disabled, onClick} = props;
    const classes = `mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored ${buttonStyle}`;
    
    
    return (
        <div key={id}>
            <button
                id={id}
                type="button"
                disabled={disabled}
                onClick={onClick}
                className={classes}>
                {title}
            </button>
        </div>
    );
};
FormButton.propTypes = {
    submitting: PropTypes.bool,
    dispatch: PropTypes.func,
    namespace: PropTypes.string,
    relation: PropTypes.string,
    hNode: PropTypes.object,
    onClick: PropTypes.func,
    disabled: PropTypes.bool
};

export default FormButton;