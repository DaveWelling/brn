// This component handles the App template used on every page.
import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import HNode from './HNode';
import {compare} from '../../../isomorphic/jsonPatch';



class App extends React.Component {
    componentDidMount() {
        if (this.props.loadingUseCase && !this.props.loadingError) {
            this.props.dispatch({type: 'STARTUP_BACKBONE_USECASE', startup: {appName: this.props.appName}});
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        const diff = compare(this.props, nextProps);
        return (diff.length > 0 || nextState !== null);
    }
    render() {
        window.document.title = this.props.appName;
        const that = this;
        const StartNode = () => {
            if (that.props.loadingUseCase) {
                return <h2> {this.props.loadingError ? 'There was an error loading the app.  Contact support.' : 'Loading configuration...'} </h2>;
            }
            return <HNode hNode={that.props.hNode} />;
        };
        return (<StartNode />);
    }
}

App.propTypes = {
    hNodes: PropTypes.object,
    dispatch: PropTypes.func,
    loadingUseCase: PropTypes.bool,
    loadingError: PropTypes.object,
    appName: PropTypes.string
};

function mapStateToProps(state) {
    let hNode = {};
    if (state.backbone_useCase.loadingUseCase) {
        if (state.backbone_useCase.loadError) {
            console.error(state.backbone_useCase.loadError);
            return { loadingUseCase: true, loadingError: state.backbone_useCase.loadError};
        }
        return { loadingUseCase: true };
    } 
    if (state.backbone_useCase.activeRecord){
        hNode = state.backbone_useCase.activeRecord.hNodes;
    }
    
    
    return {
        hNode,
        loadingUseCase: false
    };
}

export default connect(mapStateToProps)(App);


