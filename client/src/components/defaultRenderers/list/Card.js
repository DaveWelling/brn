import React from 'react';import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

class Card extends React.Component {
    getColumnValue (record, column) {
        if (!column) {
            return undefined;
        }

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

        const validColumns = columns.filter(x=>x.propertyName !== 'dateCreated');

        let dataCells = validColumns.map((column) => {
            const columnName = column.label;
            const value = this.getColumnValue(record, column);
            const key = `${record._id}_${column.propertyName}`;

            return (
                <div className="mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-cell--12-col-phone" style={{margin:'0'}} key={key}>
                    <div style={{fontSize:'8pt', color:'#adaeb4'}}>{columnName}</div>
                    <div className="card-item-value">{value ? value : 'n/a'}</div>
                </div>
            );
        });

        const dateCreatedColumn = columns.filter(x=>x.propertyName === 'dateCreated')[0];
        const dateCreatedValue = this.getColumnValue(record, dateCreatedColumn);

        let classNames = 'card mdl-cell mdl-cell--6-col mdl-cell--6-col-tablet mdl-cell--12-col-phone';

        if (highlight) {
            classNames += ' new-table-record';
        }

        return (
            <div onClick={this.props.onClick} data-id={record._id} className={classNames}>
                <div className="mdl-grid"  style={{padding:'0'}}>
                    <div className="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-phone" style={{color:'#007dbd', fontSize:'8pt', marginTop:'0', marginBottom:'0'}}>{dateCreatedValue}</div>
                </div>
                <div style={{borderBottom:'1px solid #e0e2e4'}}/>
                <div className="mdl-grid">
                    {dataCells}
                </div>
             </div>
        );
    }
}

Card.propTypes = {
    columns: PropTypes.array,
    record: PropTypes.object,
    onClick: PropTypes.func,
    highlight: PropTypes.bool
};

export default Card;
