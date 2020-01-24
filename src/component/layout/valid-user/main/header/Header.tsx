import React from 'react';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../../../redux/app_state';
import { History } from "history";
import { NETWORK_STATUS } from '../../../../../enum/NetworkStatus';
import { IUser } from '../../../../../model/model.user';
import { CmpUtility } from '../../../../_base/CmpUtility';
import { NavLink } from "react-router-dom";
import { Localization } from '../../../../../config/localization/localization';
import { Dropdown } from 'react-bootstrap';
import { TInternationalization } from '../../../../../config/setup';
import { action_change_app_flag } from '../../../../../redux/action/internationalization';
import { BaseComponent } from '../../../../_base/BaseComponent';
import { ITheme_schema } from '../../../../../redux/action/theme/themeAction';
import { action_update_theme } from '../../../../../redux/action/theme';

interface IProps {
    history: History;
    match: any;
    network_status: NETWORK_STATUS;
    logged_in_user: IUser | null;
    internationalization: TInternationalization;
    change_app_flag?: (internationalization: TInternationalization) => void;
    theme: ITheme_schema;
    update_theme?: (theme: ITheme_schema) => any;
}
interface IState {
}

class LayoutMainHeaderComponent extends BaseComponent<IProps, IState> {
    state = {
    }

    private changeLang(lang: string) {
        // debugger;
        if (!this.props.change_app_flag) return;
        if (lang === 'fa') {
            document.body.classList.add('rtl');
            Localization.setLanguage('fa');
            document.title = Localization.more;
            this.props.change_app_flag({
                rtl: true,
                language: 'فارسی',
                flag: 'fa',
            });
        } else if (lang === 'en') {
            document.body.classList.remove('rtl');
            Localization.setLanguage('en');
            document.title = Localization.more;
            this.props.change_app_flag({
                rtl: false,
                language: 'english',
                flag: 'en',
            });
        } else if (lang === 'ar') {
            document.body.classList.add('rtl');
            Localization.setLanguage('ar');
            document.title = Localization.more;
            this.props.change_app_flag({
                rtl: true,
                language: 'العربیه',
                flag: 'ar',
            });
        }

    }

    private logout() {
        this.onApplogout(this.props.history);
    }

    private toggleCompactSidebar() {
        if (!this.props.update_theme) return;
        if (this.props.theme.sidebar === 'compact') {
            this.props.update_theme({ ...this.props.theme, sidebar: 'default', isSidebarHide: false });
        } else {
            this.props.update_theme({ ...this.props.theme, sidebar: 'compact', isSidebarHide: false });
        }
    }

    render() {
        const logged_in_user = this.props.logged_in_user;
        const username = logged_in_user ? logged_in_user.username : '';
        const fullname = logged_in_user ? CmpUtility.getPersonFullName(logged_in_user.person) : '';
        const email = logged_in_user ? logged_in_user.person.email : '';

        return (
            <>
                <div className="navbar">
                    <div className="navbar-inner">
                        <div className="navbar-container">

                            {/* <div className="navbar-header pull-left">
                                <a href="#" className="navbar-brand">
                                    <small>
                                        <img src="assets/img/logo.png" alt="" />
                                    </small>
                                </a>
                            </div> */}

                            <div className={
                                "sidebar-collapse "
                                + (this.props.theme.sidebar === 'compact' ? 'active' : '')
                            }
                                onClick={() => this.toggleCompactSidebar()}
                            >
                                <i className="collapse-icon fa fa-bars"></i>
                            </div>

                            <div className="navbar-header pull-right">
                                <div className="navbar-account">
                                    <ul className="account-area">
                                        <Dropdown as="li">
                                            <Dropdown.Toggle
                                                as="a"
                                                id="dropdown-login-area"
                                                className="login-area"
                                            >
                                                <div className="avatar" title="View your public profile">
                                                    <img src="/static/media/img/icon/avatar.png" />
                                                </div>
                                                <section>
                                                    <h2><span className="profile"><span>{fullname}</span></span></h2>
                                                </section>
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu flip={false} as="ul"
                                                className="pull-right dropdown-arrow dropdown-login-area"
                                            >
                                                <li className="username"><a>{username}</a></li>
                                                <li className="email"><a>{email}</a></li>

                                                <li>
                                                    <div className="avatar-area">
                                                        <img src="/static/media/img/icon/avatar.png" className="avatar" />
                                                        {/* <span className="caption">Change Photo</span> */}
                                                    </div>
                                                </li>

                                                <li className="edit">
                                                    {/* <a href="/profile.html" className="pull-left">Profile</a> */}
                                                    {/* <a href="#" className="pull-right">Setting</a> */}
                                                    <NavLink to="/profile" className="pull-left text-capitalize" activeClassName="active">
                                                        {Localization.profile}
                                                    </NavLink>
                                                </li>

                                                <li className="theme-area d-none">
                                                    <ul className="colorpicker" id="skin-changer">
                                                        <li><a className="colorpick-btn" href="#" style={{ backgroundColor: "#5DB2FF" }} rel="assets/css/skins/blue.min.css"></a></li>
                                                        <li><a className="colorpick-btn" href="#" style={{ backgroundColor: "#2dc3e8" }} rel="assets/css/skins/azure.min.css"></a></li>
                                                        <li><a className="colorpick-btn" href="#" style={{ backgroundColor: "#03B3B2" }} rel="assets/css/skins/teal.min.css"></a></li>
                                                        <li><a className="colorpick-btn" href="#" style={{ backgroundColor: "#53a93f" }} rel="assets/css/skins/green.min.css"></a></li>
                                                        <li><a className="colorpick-btn" href="#" style={{ backgroundColor: "#FF8F32" }} rel="assets/css/skins/orange.min.css"></a></li>
                                                        <li><a className="colorpick-btn" href="#" style={{ backgroundColor: "#cc324b" }} rel="assets/css/skins/pink.min.css"></a></li>
                                                        <li><a className="colorpick-btn" href="#" style={{ backgroundColor: "#AC193D" }} rel="assets/css/skins/darkred.min.css"></a></li>
                                                        <li><a className="colorpick-btn" href="#" style={{ backgroundColor: "#8C0095" }} rel="assets/css/skins/purple.min.css"></a></li>
                                                        <li><a className="colorpick-btn" href="#" style={{ backgroundColor: "#0072C6" }} rel="assets/css/skins/darkblue.min.css"></a></li>
                                                        <li><a className="colorpick-btn" href="#" style={{ backgroundColor: "#585858" }} rel="assets/css/skins/gray.min.css"></a></li>
                                                        <li><a className="colorpick-btn" href="#" style={{ backgroundColor: "#474544" }} rel="assets/css/skins/black.min.css"></a></li>
                                                        <li><a className="colorpick-btn" href="#" style={{ backgroundColor: "#001940" }} rel="assets/css/skins/deepblue.min.css"></a></li>
                                                    </ul>
                                                </li>

                                                <li className="language-area">
                                                    <ul className="languagepicker">
                                                        <li>
                                                            <a className="cursor-pointer" onClick={() => this.changeLang('fa')} title="فارسی">
                                                                <img src="/static/media/img/flag/ir.png" />
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a className="cursor-pointer" onClick={() => this.changeLang('en')} title="English">
                                                                <img src="/static/media/img/flag/us.png" />
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </li>

                                                <li className="dropdown-footer">
                                                    <a className="cursor-pointer" onClick={() => this.logout()}>
                                                        {Localization.Sign_out}
                                                    </a>
                                                </li>
                                            </Dropdown.Menu>
                                        </Dropdown>

                                    </ul>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

const dispatch2props: MapDispatchToProps<{}, {}> = (dispatch: Dispatch) => {
    return {
        change_app_flag: (internationalization: TInternationalization) => dispatch(action_change_app_flag(internationalization)),
        update_theme: (theme: ITheme_schema) => dispatch(action_update_theme(theme)),
    }
}

const state2props = (state: redux_state) => {
    return {
        internationalization: state.internationalization,
        network_status: state.network_status,
        logged_in_user: state.logged_in_user,
        theme: state.theme,
    }
}

export const LayoutMainHeader = connect(state2props, dispatch2props)(LayoutMainHeaderComponent);
