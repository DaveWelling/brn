import React from 'react';import PropTypes from 'prop-types';
import Label from './Label';
import ValidationError from './ValidationError';
import {getTextfieldContainerClasses} from './FieldContainer';

class Integer extends React.Component {
    render () {
        let {
            hNode: {
                id,
                title,
                readOnly=false,
                placeholder,
                required=false,
                min=Number.MIN_SAFE_INTEGER,
                max=Number.MAX_SAFE_INTEGER,
                propertyName,
                pattern
            },
            elementErrors,
            value,
            submitting,
            onchange
        } = this.props;
        let classNames = getTextfieldContainerClasses(this.props);

        return (
            <div className={classNames}>
                <Label for={id} label={title} placeholder={placeholder} title={title} required={required} />
                <div>
                    <input
                        aria-invalid={elementErrors.length>0}
                        className="mdl-textfield__input"
                        id={id}
                        max={max}
                        min={min}
                        name={propertyName}
                        pattern={pattern}
                        disabled={readOnly || submitting}
                        required={required}
                        type="number"
                        value={value}
                        onChange={onchange}
                    />
                </div>
                <ValidationError errors={elementErrors} />
            </div>
        );
    }
}

Integer.propTypes = {
    hNode: PropTypes.object.isRequired,
    value: PropTypes.string.isRequired,
    elementErrors: PropTypes.array,
    submitting: PropTypes.bool,
    onchange: PropTypes.func
};

export default Integer;