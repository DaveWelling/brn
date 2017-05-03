import React from 'react';import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { getRecords } from '../../../actions/generalPurposePersistenceActions';
import Card from './Card';
import { getDataByAction } from '../../../helpers/stateHelpers';
import { getParentScrollElement } from '../../../helpers/scrollingHelpers';
import * as listHelpers from '../../../helpers/listHelpers';

export const DEFAULT_PAGE_SIZE = 25;
export const MAX_RECORDS_TO_DISPLAY = 1000; //should be a multiple of page size
export const PERCENT_TO_FETCH_MORE_RECORDS = 80;

//A lot of this component's code is duplicated with SimpleList, I think we need a HoC to fix this.
export class CardList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            pageSize: DEFAULT_PAGE_SIZE,
            orderBy: this.props.initialOrderBy,
            direction: this.props.initialDirection
        };

        this.setCardListDomElement = this.setCardListDomElement.bind(this);
        this.cardClicked = this.cardClicked.bind(this);
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

    setCardListDomElement(element) {
        this.cardListDomElement = element; //used to calculate scroll position
    }

    cardClicked(event) {
        let documentId = event.currentTarget.getAttribute('data-id');
        let action = { type:`${this.props.rowClickAction.toUpperCase()}_${this.props.namespace.toUpperCase()}_${this.props.relation.toUpperCase()}`};
        action[this.props.rowClickAction.toLowerCase()] = {id:documentId, namespace: this.props.namespace, relation: this.props.relation};
        this.props.dispatch(action);
    }

    getEndOfResultsFooter () {
        return (<div id="card-list-end" style={{margin:'8px'}}>No more items.</div>);
    }

    render() {
        const { columns, newRecords, records, totalPages, listId} = this.props;
        const { currentPage, pageSize } = this.state;

        let dataRowsNew = [];
        let dataRows = [];
        let footer;

        if (columns && columns.length > 0) {
            if (newRecords && newRecords.length > 0) {
                dataRowsNew = newRecords.map((rec, i) => {
                    return (<Card key={rec._id['$oid']} columns={columns} record={rec}
                                  onClick={this.cardClicked} highlight={i === 0}/>);
                });
            }

            if (records && records.length > 0) {
                dataRows = records.map((rec) => {
                    return (<Card key={rec._id['$oid']} columns={columns} record={rec}
                                  onClick={this.cardClicked}/>);
                });
            }
        }

        if (columns && records && records.length >= MAX_RECORDS_TO_DISPLAY) {
            footer = this.getLongListWarningFooter(columns.length);
        }

        if (columns && records && records.length > pageSize && currentPage >= totalPages) {
            footer = this.getEndOfResultsFooter();
        }

        dataRows = dataRowsNew.concat(dataRows);

        return (
            <div id={listId} className="mdl-js-data-table card-list" ref={this.setCardListDomElement}>
                <div className="mdl-grid" style={{margin:'0', padding:'0'}}>{dataRows}</div>
                {footer}
            </div>
        );
    }
}

CardList.propTypes = {
    columns: PropTypes.array,
    showNewViewer: PropTypes.bool,
    dispatch: PropTypes.func,
    rowClickAction: PropTypes.string,
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
    listId: PropTypes.string
};

function mapStateToProps(state, ownProps) {
    const { namespace, relation, columns } = ownProps.hNode;
    const {
        initialOrderBy,
        initialSort,
        filterByParent,
        filterAction
    } = ownProps.hNode;

    let records = listHelpers.getValueFromState(state, namespace, relation, 'items', []);

    let searchTerm;
    if(filterByParent) {
        searchTerm = listHelpers.filterByParentRecord(filterByParent, state);
        //if we're filtering by parent, and there's no parent record, we shouldn't show
        //any records.
        records = searchTerm ? records : null;
    } else {
        searchTerm = getDataByAction(state, filterAction);
    }

    let newRecords = listHelpers.getValueFromState(state, namespace, relation, 'newRecords', []);

    const initialDirection = initialSort || 'descending';
    const totalItems = listHelpers.getValueFromState(state, namespace, relation, 'total_items', 0);
    const totalPages = listHelpers.getValueFromState(state, namespace, relation, 'total_pages', 0);

    let isDirty = listHelpers.getIsDirty(state, namespace, relation);
    
    //Get the 'full' hNode representation of child nodes,
    //which, in the case of list-type components, are assumed to be viewers.
    let listId = ownProps.hNode.id['$oid'];
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

export default connect(mapStateToProps)(CardList);
