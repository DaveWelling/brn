import React from 'react';import PropTypes from 'prop-types';

class Label extends React.Component {
    render() {
        return (
            <label className="mdl-textfield__label" htmlFor={this.props.for} aria-required={this.props.required}>
                {this.props.label || this.props.placeholder || this.props.title}{this.props.required && <span> *</span>}
            </label>
        );
    }
}

Label.propTypes = {
    for: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    title: PropTypes.string,
    required: PropTypes.bool
};

export default Label;
