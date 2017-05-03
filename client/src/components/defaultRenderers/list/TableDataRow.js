import React from 'react';import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import {columnContainsText} from '../../../helpers/listHelpers';

class TableDataRow extends React.Component {

    getColumnValue (record, column) {
        let value = _.get(record, column.propertyName);
        if (column.dataType && column.dataType === 'localShortDate' && value) {
            return moment(value).format('L');
        }
        if (column.dataType && column.dataType === 'localVerboseDateTime' && value) {
            return moment(value).format('lll');
        }
        return value;
    }

    render() {
        const {record, columns, highlight} = this.props;

        if (!record || !columns || columns.length === 0) {
            return null;
        }

        let dataCells = columns.map((column, i) => {
            const value = this.getColumnValue(record, column);
            const key = i + '_' + record._id + '_' + column.propertyName;
            let classNames = '';

            if (columnContainsText(column)) {
                classNames += 'mdl-data-table__cell--non-numeric';
            }
            return (
                <td key={key} className={classNames.trim()}>{value}</td>
            );
        });

        let newRecordClassNames = '';

        if (highlight) {
            newRecordClassNames = 'new-table-record';
        }

        return (
            <tr onClick={this.props.onRowClicked} data-id={record._id} className={newRecordClassNames}>{dataCells}</tr>
        );
    }
}

TableDataRow.propTypes = {
    columns: PropTypes.array,
    record: PropTypes.object,
    onRowClicked: PropTypes.func,
    highlight: PropTypes.bool
};

export default TableDataRow;
