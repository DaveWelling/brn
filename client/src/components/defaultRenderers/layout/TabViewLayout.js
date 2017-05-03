import React from 'react';import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import './TabViewLayout.css';

export class TabbedViewLayout extends React.Component{
    constructor(props) {
        super(props);
    }

    getTabHeader(hNode) {
        const children = hNode.children;
        const tabLabels = children.map((child) => {
            return (
                <Tab key={child.title}>
                    {child.title}
                </Tab>
            );
        });

        return (
            <TabList>{tabLabels}</TabList>
        );
    }

    getTabContent() {
        return React.Children.map(
            this.props.children,
            (child) => { return <TabPanel>{child}</TabPanel>; }
        );
    }

    render() {
        const tabHeader = this.getTabHeader(this.props.hNode);
        const tabContent = this.getTabContent(this.props.children);
        return (
            <Tabs name={this.props.hNode.title} onSelect={this.handleSelect}>
                {tabHeader}
                {tabContent}
            </Tabs>
        );
    }
}

TabbedViewLayout.propTypes = {
    hNode: PropTypes.object,
    children: PropTypes.array,
    dispatch: PropTypes.func
};

function mapStateToProps (state, ownProps) {
    return ownProps;
}
export default connect(mapStateToProps)(TabbedViewLayout);