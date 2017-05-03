import React from 'react';import PropTypes from 'prop-types';
import DropDownItem from './DropDownItem';

class DropDownItemList extends React.Component {
    render() {
        let listItems = this.props.listItems || [];
        let hintItem = null;
        let {itemTextPropertyName} = this.props;
        if (this.props.hintItem) {
            hintItem = <DropDownItem item={this.props.hintItem} key={this.props.hintItem._id} isDisabled={Boolean(true)} />;
        }
        return (
            <ul className="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" htmlFor={this.props.for} ref={this.props.refCallback}>
            {hintItem}
            {
                listItems.map((item) => {
                    let isSelected = false;
                    if (this.props.selectedItem && this.props.selectedItem._id && item._id === this.props.selectedItem._id) {
                        isSelected = true;
                    }
                    return (
                        <DropDownItem isSelected={isSelected} item={item} itemClick={this.props.itemClick} key={item._id} itemTextPropertyName={itemTextPropertyName}/>
                    );
                })
            }
            </ul>
        );
    }
}

DropDownItemList.propTypes = {
    for: PropTypes.string.isRequired,
    hintItem: PropTypes.object,
    itemClick: PropTypes.func,
    listItems: PropTypes.array,
    selectedItem: PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.string]),
    refCallback: PropTypes.func.isRequired,
    itemTextPropertyName: PropTypes.string
};

export default DropDownItemList;
