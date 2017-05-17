import React from 'react';import PropTypes from 'prop-types';
import eventSink from '../../../middleware/eventSink';
import './DetailVSplitLayout.css';

class DetailVSplitLayout extends React.Component{
    constructor(props) {
        super(props);
        
        // Need to see edit and new actions so that we can show the corresponding 
        // detail pane.  Don't use regular redux lifecycle for this because
        // that will require storing state.
        // We can do this in the constructor because the children should be known 
        // at the time of construction because they are passed in.
        this.allDetailPanes = props.children.filter(child=>child.props.hNode.hNodeTypeGroup === 'detailPane');
        this.otherChildren = props.children.filter(child=>child.props.hNode.hNodeTypeGroup !== 'detailPane');
        this.state = {
            visiblePanes: []
        };
        this.currentListeners = {};
        this.allDetailPanes.forEach(pane=>{
            // Open the detail pane if the user tries to edit or create a new record (edit/new = showForAction in metadata).
            const listenForAction = pane.props.hNode.showForAction+'_SUCCESS'; 
            if (!this.currentListeners.hasOwnProperty(listenForAction)) {
                // store the unsubscribe function with the listenForAction
                this.currentListeners[listenForAction] = eventSink.subscribe(listenForAction, () => {
                    this.setState({
                        visiblePanes : this.allDetailPanes.filter(filterPane =>
                           filterPane.props.hNode.showForAction === pane.props.hNode.showForAction)
                    });
                });
            }
            
            // Close detail pane if the user cancels or successfully deletes/submits.
            let closeForActions = [
                `CANCEL_${pane.props.hNode.namespace}_${pane.props.hNode.relation}`.toUpperCase(),
                `REMOVE_${pane.props.hNode.namespace}_${pane.props.hNode.relation}_SUCCESS`.toUpperCase(),
                `SUBMIT_${pane.props.hNode.namespace}_${pane.props.hNode.relation}_SUCCESS`.toUpperCase()];
            closeForActions.forEach(action=> {
                if (!this.currentListeners.hasOwnProperty(action)) {
                    this.currentListeners[action] = eventSink.subscribe(action, () => {
                        this.setState({
                            visiblePanes : []
                        });
                    });
                }    
            });
        });
    }
    shouldComponentUpdate(nextProps, nextState){
        return (this.state.visiblePanes !== nextState.visiblePanes ||
            this.state.visiblePanes.length !== nextState.visiblePanes.length);
    }
    componentWillUnmount() {
        // unsubscribe all listeners;
        Object.keys(this.currentListeners).forEach(
            key=>this.currentListeners[key]()
        );
    }

    render(){
        return(
            <div name={this.props.hNode.title} id={this.props.hNode.id}  className="mdl-grid no-padding">
                <div className="mdl-cell mdl-cell--8-col">
                    <div className="mdl-grid mdl-grid-scroll left-split">
                        {this.otherChildren}
                    </div>
                </div>
                <div className="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet detail-pane">
                    {this.state.visiblePanes.length > 0 ? 
                        this.state.visiblePanes : 
                        <div style={{textAlign:'center'}}>
                            <div>
                                Select a row to view detail for it.
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

DetailVSplitLayout.propTypes = {
    children: PropTypes.array,
    hNode: PropTypes.object
};

export default DetailVSplitLayout;