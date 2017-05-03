import React from 'react';import PropTypes from 'prop-types';

class IconLabel extends React.Component {
    render() {
        return (
            <label
                className="mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect"
                htmlFor={this.props.id}
                aria-required={this.props.required}
                onClick={this.props.onClick}>
              <i className="material-icons" alt={this.props.alt}>{this.props.iconFontName}</i>
            </label>
        );
    }
}

IconLabel.propTypes = {
    alt: PropTypes.string,
    iconFontName: PropTypes.string,
    id: PropTypes.string,
    onClick: PropTypes.func,
    required: PropTypes.bool
};

export default IconLabel;
