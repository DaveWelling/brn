import React from 'react';import PropTypes from 'prop-types';

class DropDownItem extends React.Component {
    render() {
        const {_id, title} = this.props.item || {};
        let itemClassNames = 'mdl-menu__item';

        let {itemTextPropertyName} = this.props;
        let itemText = title;
        if (!title && itemTextPropertyName && this.props.item) {
            itemText = this.props.item[itemTextPropertyName];
        }

        if (this.props.isSelected) {
            itemClassNames += ' selected-item';
        }
        return (
            <li
                className={itemClassNames}
                data-id={_id}
                data-title={itemText}
                onClick={this.props.itemClick}
                disabled={this.props.isDisabled} >
                {itemText}
            </li>
        );
    }
}


DropDownItem.propTypes = {
    isDisabled: PropTypes.bool,
    isSelected: PropTypes.bool,
    item: PropTypes.object,
    itemClick: PropTypes.func,
    itemTextPropertyName: PropTypes.string
};

export default DropDownItem;
