import React from 'react';import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NotificationsSnackbar from '../NotificationsSnackbar';
import logo from '../../../images/BRN_logo.png';


class LeftSideNavAppLayout extends React.Component {
    componentDidUpdate(){

        this.appMountTimeout = setTimeout(() => {
            if (window.componentHandler) {
                window.componentHandler.upgradeDom();
            }
        }, 0);
    }

    componentWillUnmount() {
        clearTimeout(this.appMountTimeout);
    }
    render() {
        return (

            <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
                <header className="mdl-layout__header">
                    <div className="mdl-layout__header-row  mdl-color--indigo">
                        <div className="mdl-layout-spacer" />
                        <span className="mdl-layout-title currentPageName">
                            Home
                        </span>
                    </div>
                </header>
                <main className="mdl-layout__content no-y-scroll">
                    {this.props.children}
                </main>

                <footer className="mdl-mini-footer">
                    {this.props.loading && <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate loading-bar-full-width" />}
                    <NotificationsSnackbar/>
                </footer>

                <footer className="mdl-mega-footer">
                    <div className="mdl-mega-footer__bottom-section">
                        <div className="mdl-logo loginFooterImage"><img alt="Logo" src={logo}/></div>
                    </div>
                </footer>
            </div>
    );
    }
}

LeftSideNavAppLayout.propTypes = {
    children: PropTypes.array,
    loading: PropTypes.bool
};

function mapStateToProps(state, ownprops) {
    return {
        loading: state.ajaxStatus.ajaxCallsInProgress > 0,
    };
}

export default connect(mapStateToProps)(LeftSideNavAppLayout);