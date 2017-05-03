import React  from 'react';
import PropTypes from 'prop-types';

export default function Spinner(props){
    // false positives here on proptypes validation linting:
    // https://github.com/yannickcr/eslint-plugin-react/issues/803
    const { waitText }  = props; // eslint-disable-line
    let showWaitText = (!!waitText  && waitText !== '');
    return (
        <div>
            <div id="spinner" className="mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active"/>
            {showWaitText &&
            <div className="mdl-tooltip mdl-tooltip--large mdl-tooltip--top" htmlFor="spinner">{waitText}</div>
            }
        </div>
    );
}

Spinner.propTypes = {
    waitText: PropTypes.string
};


