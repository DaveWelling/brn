import React from 'react';import PropTypes from 'prop-types';

class ValidationError extends React.Component {
    render() {
        if (this.props.errors) {
            let errorMessages = this.props.errors.map(error=>error.message);
            return (
                <span className="mdl-textfield__error" role="alert">
                    {this.props.errors.map((error, i)=><span key={i}>{error.message}. &nbsp;</span>)}
                </span>
            );
        }
        return false;
    }
}

ValidationError.propTypes = {
    errors: PropTypes.array
};

export default ValidationError;
