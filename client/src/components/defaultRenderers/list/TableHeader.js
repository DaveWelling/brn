import React from 'react';import PropTypes from 'prop-types';
import {columnContainsText} from '../../../helpers/listHelpers';

class TableHeader extends React.Component {
    columnIsSorted (column) {
        return (this.props.orderBy === column.propertyName);
    }

    columnIsClickable (column) {
        return column.sortable;
    }

    render() {
        const {columns, direction} = this.props;
        if (!columns || columns.length === 0) {
            return null;
        }

        const headerColumns = columns.map(column => {
            const key = `${column.propertyName}_header`;
            let classNames = 'mdl-color-text--indigo';
            let onclick = false;
            if (columnContainsText(column)) {
                classNames += ' mdl-data-table__cell--non-numeric';
            }
            if (this.columnIsSorted(column)) {
                classNames += ' mdl-data-table__header--sorted-' + direction;
            }
            if (this.columnIsClickable(column)) {
                onclick = this.props.changeColumnSort;
                classNames += ' clickable';
            }
            return (
                <th key={key}
                    className={classNames.trim()}
                    data-columnName={column.propertyName}
                    onClick={onclick}
                    scope="col">
                    {column.label}
                </th>
            );
        });

        return (
            <thead>
                <tr>
                {headerColumns}
                </tr>
            </thead>
        );
    }
}

TableHeader.propTypes = {
    columns: PropTypes.array,
    changeColumnSort: PropTypes.func,
    direction: PropTypes.string,
    orderBy: PropTypes.string
};

export default TableHeader;
