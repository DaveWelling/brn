import React from 'react';import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import ValidationError from './ValidationError';

class Toggle extends React.Component {
    constructor (props) {
        super(props);
        this.setInputDomElement = this.setInputDomElement.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    componentDidMount(){
        //Have to go through this rigamarole to get MDL to play nice with react.
        this.appMountTimeout = setTimeout(() => {
            if(window.componentHandler && this.inputDomElement) {
                ReactDOM.findDOMNode(this.inputDomElement);
                window.componentHandler.upgradeElement(ReactDOM.findDOMNode(this.inputDomElement));
            }
        }, 0);
    }
    componentWillUnmount () {
        clearTimeout(this.appMountTimeout);
    }

    setInputDomElement (element) {
        this.inputDomElement = element;
    }
    // Override in order to send boolean instead of the string returned by regular event.target.value
    onChange(event){
        this.props.onchange({target:{name:this.props.hNode.propertyName, value: event.target.checked}});
    }

    render () {

        let {
            hNode: {
                id,
                readOnly=false,
                propertyName,
                toggleValues
            },
            elementErrors,
            value,
            submitting
        } = this.props;
        const positiveToggleTextClass = ((!value && 'toggle-text-selected') || '');
        const negativeToggleTextClass = ((value && 'toggle-text-selected') || '');

        return (
            <div className="form-toggle-wrapper">
                <span className={`toggle-span ${positiveToggleTextClass}`}>{toggleValues[0]}</span>
                <label className="mdl-switch mdl-js-switch mdl-js-ripple-effect" htmlFor={id} 
                       ref={this.setInputDomElement}>
                    <input
                        type="checkbox"
                        id={id}
                        className="mdl-switch__input"
                        onChange={this.onChange}
                        disabled={readOnly || submitting}
                        name={propertyName}
                        value={value}
                    />
                </label>
                <span className={`toggle-span ${negativeToggleTextClass}`}>{toggleValues[1]}</span>
                <ValidationError errors={elementErrors} />
            </div>
        );
    }
}

Toggle.propTypes = {
    hNode: PropTypes.object.isRequired,
    value: PropTypes.bool.isRequired,
    elementErrors: PropTypes.array,
    submitting: PropTypes.bool,
    onchange: PropTypes.func
};

export default Toggle;
