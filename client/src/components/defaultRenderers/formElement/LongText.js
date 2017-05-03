import React from 'react';import PropTypes from 'prop-types';
import Label from './Label';
import ValidationError from './ValidationError';
import {getTextfieldContainerClasses} from './FieldContainer';

class LongText extends React.Component {
    render () {
        let {
            hNode: {
                id,
                title,
                readOnly=false,
                placeholder,
                required=false,
                minLength=0,
                maxLength=9999,
                propertyName,
                pattern,
                rows
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
                    <textarea
                        aria-invalid={elementErrors.length>0}
                        className="mdl-textfield__input"
                        id={id}
                        maxLength={maxLength}
                        minLength={minLength}
                        name={propertyName}
                        pattern={pattern}
                        disabled={readOnly || submitting}
                        required={required}
                        type="text"
                        value={value}
                        onChange={onchange}
                        rows={rows}
                    />
                </div>
                <ValidationError errors={elementErrors} />
            </div>
        );
    }
}

LongText.propTypes = {
    hNode: PropTypes.object.isRequired,
    value: PropTypes.string.isRequired,
    elementErrors: PropTypes.array,
    submitting: PropTypes.bool,
    onchange: PropTypes.func
};

export default LongText;