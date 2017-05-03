import React from 'react';import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import HNode from '../../HNode';
import eventSink from '../../../middleware/eventSink';

import getStore from '../../../store';

const InnerDialog = (props)=>{
    let style = {
        display: 'block',
        top: '2em',
        zIndex: '1000000',
        maxWidth: '980px'
    };

    return (
        <Provider store={getStore()}>
            <div style={style}>
                <h4 className="mdl-dialog__title">{props.dialogTitle}</h4>
                <div className="mdl-dialog__content">
                    <HNode hNode={props.child} />
                </div>
            </div>
        </Provider>
    );
};
InnerDialog.propTypes = {
    child: PropTypes.object,
    dialogTitle: PropTypes.string
};

class SimpleDialog extends React.Component {
    constructor (props) {
        super(props);

        this.closeDialog = this.closeDialog.bind(this);
        this.openDialog = this.openDialog.bind(this);
        this.dialog = document.querySelector('dialog');

        this.listenerUnsubscribe = [];
        this.listenerUnsubscribe.push(eventSink.subscribe(this.props.hNode.openActionType, () => {
            this.openDialog(this.props.hNode);
        }));
        this.listenerUnsubscribe.push(eventSink.subscribe(this.props.hNode.closeActionType, () => {
            this.closeDialog();
        }));
    }

    componentWillUnmount(){
        this.closeDialog();
        this.listenerUnsubscribe.forEach(unsubscribe=>unsubscribe());
    }

    closeDialog(){
        if (this.dialogOpen) {
            this.dialog.close();
            this.setState({
                dialogOpen: false
            });
        }
    }

    openDialog(hNode){
        if (!this.dialogOpen) {
            ReactDOM.render(<InnerDialog dialogTitle={hNode.title} child={hNode.children[0]}/>, this.dialog);
            this.dialog.showModal();
            this.setState({
                dialogOpen: true,
            });
        }
    }

    render () {return <div></div>;} // placeholder
}

SimpleDialog.propTypes = {
    hNode: PropTypes.object,
    displayAction: PropTypes.string
};

export default SimpleDialog;
