import React from 'react';import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getRecords } from '../../../actions/generalPurposePersistenceActions';
import TableHeader from './TableHeader';
import TableDataRow from './TableDataRow';
import { getDataByAction } from '../../../helpers/stateHelpers';
import { getParentScrollElement } from '../../../helpers/scrollingHelpers';
import * as listHelpers from '../../../helpers/listHelpers';

export const DEFAULT_PAGE_SIZE = 25;
export const MAX_RECORDS_TO_DISPLAY = 1000; //should be a multiple of page size
export const PERCENT_TO_FETCH_MORE_RECORDS = 80;

//A lot of this component's code is duplicated with CardList, I think we need a HoC to fix this.
export class SimpleList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            pageSize: DEFAULT_PAGE_SIZE,
            orderBy: this.props.initialOrderBy,
            direction: this.props.initialDirection
        };

        this.setTableDomElement = this.setTableDomElement.bind(this);
        this.rowClicked = this.rowClicked.bind(this);
        this.headerClicked = this.headerClicked.bind(this);
        this.loadRecords = this.loadRecords.bind(this);
        this.fetchMoreRecords = this.fetchMoreRecords.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.debouncedFetchMore = _.debounce(this.fetchMoreRecords, 250);
    }

    componentWillMount() {
        this.loadRecords(this.props);
    }

    componentDidMount() {
        let listElem = document.getElementById(this.props.listId);
        if(listElem && listElem.parentNode) {
            let scrollElement = getParentScrollElement(listElem.parentNode);
            if (scrollElement) {
                this.listParentElement = scrollElement;
                this.listParentElement.addEventListener('scroll', this.handleScroll);
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.searchTerm !== this.props.searchTerm && nextProps.searchTerm !== undefined) {
            this.loadRecords(nextProps);
        }
    }

    shouldComponentUpdate(nextProps) {
        let result = false;

        if (nextProps.records) {
            result = true;
        }

        return result;
    }

    componentWillUnmount() {
        if (this.listParentElement) {
            this.listParentElement.removeEventListener('scroll', this.handleScroll);
        }
    }


    handleScroll(e) {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        const percentScrolledDown = (scrollTop / (scrollHeight - clientHeight)) * 100;
        if (percentScrolledDown > PERCENT_TO_FETCH_MORE_RECORDS) {
            this.debouncedFetchMore();
        }
    }

    loadRecords(props) {
        const { namespace, relation, searchTerm } = props;
        const { pageSize, orderBy, direction } = this.state;
        const sort = listHelpers.getSort(orderBy, direction);

        this.props.dispatch(getRecords(namespace, relation, true, searchTerm, 1, pageSize, sort, false));
    }

    fetchMoreRecords() {
        const { namespace, relation, searchTerm, totalPages } = this.props;
        const { currentPage, pageSize, orderBy, direction } = this.state;
        const nextPage = currentPage + 1;
        const sort = listHelpers.getSort(orderBy, direction);
        if (nextPage <= totalPages && this.props.records.length < MAX_RECORDS_TO_DISPLAY) {
            this.props.dispatch(getRecords(namespace, relation, false, searchTerm, nextPage, pageSize, sort, true));
            this.setState({ currentPage: nextPage });
        }
    }

    setTableDomElement(element) {
        this.tableDomElement = element; //used to calculate scroll position
    }


    rowClicked(event) {
        let documentId = event.currentTarget.getAttribute('data-id');
        let action = { type:`${this.props.rowClickAction.toUpperCase()}_${this.props.namespace.toUpperCase()}_${this.props.relation.toUpperCase()}`};
        action[this.props.rowClickAction.toLowerCase()] = {id:documentId, namespace: this.props.namespace, relation: this.props.relation};
        this.props.dispatch(action);
    }

    headerClicked(event) {
        const { namespace, relation, searchTerm } = this.props;
        const { pageSize } = this.state;
        const newOrderBy = event.currentTarget.getAttribute('data-columnName');
        const newDirection = listHelpers.toggleDirection(newOrderBy, this.state.orderBy, this.state.direction);
        const sort = listHelpers.getSort(newOrderBy, newDirection);

        this.props.dispatch(getRecords(namespace, relation, false, searchTerm, 1, pageSize, sort, false));
        this.setState({
            orderBy: newOrderBy,
            direction: newDirection,
            currentPage: 1
        });
    }


    getLongListWarningFooter (numColumns) {
        return (
            <tfoot className="long-list-warning mdl-color-text--deep-orange-A700">
                <tr>
                    <td colSpan={numColumns}>
                        <i className="material-icons mdl-color-text--deep-orange-A700" alt="Too many records warning message">warning</i>
                        <span>Viewing very large data sets may cause application performance to degrade.
                            Consider using a search to narrow your results, or, download a report.</span>
                    </td>
                </tr>
            </tfoot>
        );
    }

    getEndOfResultsFooter (numColumns) {
        return (
            <tfoot className="list-end">
                <tr>
                    <td colSpan={numColumns}>
                        <span>No more items.</span>
                    </td>
                </tr>
            </tfoot>
        );
    }

    render() {
        const { columns, newRecords, records, totalPages, listId} = this.props;
        const { orderBy, direction, currentPage, pageSize } = this.state;

        let dataRowsNew = [];
        let dataRows = [];
        let footer;

        if (columns && columns.length > 0) {
            if (newRecords && newRecords.length > 0) {
                dataRowsNew = newRecords.map((rec, i) => {
                    return (
                        <TableDataRow key={rec._id} columns={columns} record={rec} onRowClicked={this.rowClicked} highlight={i === 0}/>
                    );
                });
            }

            if (records && records.length > 0) {
                dataRows = records.map((rec) => {
                    return (
                        <TableDataRow key={rec._id} columns={columns} record={rec} onRowClicked={this.rowClicked}/>
                    );
                });
            }
        }

        if (columns && records && records.length >= MAX_RECORDS_TO_DISPLAY) {
            footer = this.getLongListWarningFooter(columns.length);
        }

        if (columns && records && records.length > pageSize && currentPage >= totalPages) {
            footer = this.getEndOfResultsFooter(columns.length);
        }

        dataRows = dataRowsNew.concat(dataRows);

        return (
            <table id={listId} className="mdl-data-table mdl-js-data-table simple-list" ref={this.setTableDomElement}>
                <TableHeader columns={columns} changeColumnSort={this.headerClicked} direction={direction} orderBy={orderBy} />
                <tbody>{dataRows}</tbody>
                {footer}
            </table>
        );
    }
}

SimpleList.propTypes = {
    columns: PropTypes.array,
    showNewViewer: PropTypes.bool,
    dispatch: PropTypes.func,
    initialDirection: PropTypes.string,
    initialOrderBy: PropTypes.string,
    isDirty: PropTypes.bool,
    namespace: PropTypes.string,
    relation: PropTypes.string,
    newRecords: PropTypes.array,
    records: PropTypes.array,
    searchTerm: PropTypes.string,
    totalItems: PropTypes.number,
    totalPages: PropTypes.number,
    listId: PropTypes.string,
    rowClickAction: PropTypes.string
};

function mapStateToProps(state, ownProps) {
    const { namespace, relation, columns } = ownProps.hNode;
    const {
        initialOrderBy,
        initialSort,
        filterByParent,
        filterAction,
    } = ownProps.hNode;


    let records = listHelpers.getValueFromState(state, namespace, relation, 'items', []);

    let searchTerm;
    if(filterByParent) {
        searchTerm = listHelpers.filterByParentRecord(filterByParent, state);
        //if we're filtering by parent, and there's no parent record, we shouldn't show
        //any records.
        records = searchTerm ? records : null;
    } else {
        searchTerm = getDataByAction(state, `${filterAction}_${namespace.toUpperCase()}_${relation.toUpperCase()}`);
    }

    let newRecords = listHelpers.getValueFromState(state, namespace, relation, 'newRecords', []);


    const initialDirection = initialSort || 'descending';
    const totalItems = listHelpers.getValueFromState(state, namespace, relation, 'total_items', 0);
    const totalPages = listHelpers.getValueFromState(state, namespace, relation, 'total_pages', 0);

    let isDirty = listHelpers.getIsDirty(state, namespace, relation);

    
    let listId = ownProps.hNode.id;
    let rowClickAction = ownProps.hNode.rowClickAction;
    return {
        columns,
        initialDirection,
        initialOrderBy,
        isDirty,
        namespace,
        newRecords,
        records,
        relation,
        searchTerm,
        totalItems,
        totalPages,
        listId,
        rowClickAction
    };
}

export default connect(mapStateToProps)(SimpleList);
