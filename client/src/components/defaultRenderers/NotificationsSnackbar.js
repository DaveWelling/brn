import React from 'react';import PropTypes from 'prop-types';
import { injectAsyncReducer } from '../../store/index';
import * as types from '../../actions/actionTypes';

class NotificationsSnackbar extends React.Component{

    static popNotification(notify){

        if (!notify || !notify.message) {
            throw new Error('A notify action must have a message.');
        }
        let notificationElement = document.querySelector('.mdl-js-snackbar');

        let data;
        if (notify.actionHandler && notify.actionText){
            data= {
                message: notify.message,
                actionHandler: notify.actionHandler,
                actionText: notify.actionText,
                timeout: notify.timeout || 5000
            };
        } else {
            data = {
                message: notify.message,
                timeout: notify.timeout || 5000
            };
        }
        notificationElement.MaterialSnackbar.showSnackbar(data);
    }

	constructor(props) {
		super(props);
	}
    componentWillMount(){
        this.setupReducer();
    }
    setupReducer(){
        // Hook into notification pipeline
        injectAsyncReducer('NotificationsSnackbar', (state = {}, action)=> {
            if (action.type === types.NOTIFY_APPLICATION_USER) {
                NotificationsSnackbar.popNotification(action.notify);
            }
            return state;
        });
    }
	render(){
		return (
            <div className="mdl-snackbar mdl-js-snackbar">
                <div className="mdl-snackbar__text"/>
                <button type="button" className="mdl-snackbar__action"/>
            </div>
		);
	}
}

NotificationsSnackbar.propTypes = {
	dispatch: PropTypes.func
};

export default NotificationsSnackbar;