import React from 'react';import PropTypes from 'prop-types';

class IconButton extends React.Component {
    render() {
        return (
            <button className="mdl-button mdl-js-button mdl-button--icon" id={this.props.id} onClick={this.props.onClick} aria-required={this.props.required} >
                <i className="material-icons" alt={this.props.alt}>{this.props.iconFontName}</i>
            </button>
        );
    }
}

IconButton.propTypes = {
    alt: PropTypes.string,
    iconFontName: PropTypes.string,
    id: PropTypes.string,
    onClick: PropTypes.func,
    required: PropTypes.bool
};

export default IconButton;
