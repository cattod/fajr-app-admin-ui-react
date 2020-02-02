import React from "react";
import { redux_state } from "../../../../../redux/app_state";
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { TInternationalization } from "../../../../../config/setup";
// import { IUser } from "../../../../../model/model.user";
import { BaseComponent } from "../../../../_base/BaseComponent";
// import { History } from "history";
import { Localization } from "../../../../../config/localization/localization";

export interface IProps {
    internationalization: TInternationalization;
    // logged_in_user?: IUser | null;
    // history: History;
}

class LayoutMainFooterComponent extends BaseComponent<IProps, any>{
    render() {
        return (
            <footer className="footer sticky-footer text-center text-muted">
                <div className="footer-logo-wrapper">
                    <div className="footer-logo">
                        <img src="/static/media/img/icon/ermia-logo.png" alt="" />
                    </div>
                    <div className="footer-logo">
                        <img src="/static/media/img/icon/saye-logo.png" alt="" />
                    </div>
                    <div className="footer-logo">
                        <img src="/static/media/img/icon/filmsanj-logo-inverse.png" alt="" />
                    </div>
                </div>
                
                <div className="py-1">
                    {/* <div className="d-inline-block mr-4">{Localization.catod_watermark}</div> */}
                    <div className="d-inline-block mr-4 footer-watermark">
                        <span>ساخته شده با </span>
                        <i className="fa fa-heart icon-heart"></i>
                        <span> و </span>
                        <i className="fa fa-coffee icon-coffee"></i>
                        <span> در کاتد.</span>
                    </div>
                    <div className="d-inline-block">
                        <span className="text-muted--">{Localization.version}: </span>
                        <span className="font-weight-bold--">{process.env.REACT_APP_VERSION}</span>
                    </div>
                </div>
            </footer>
        )
    }
}

const dispatch2props: MapDispatchToProps<{}, {}> = (dispatch: Dispatch) => {
    return {
    }
}

const state2props = (state: redux_state) => {
    return {
        internationalization: state.internationalization,
        // logged_in_user: state.logged_in_user,
    }
}

export const LayoutMainFooter = connect(state2props, dispatch2props)(LayoutMainFooterComponent);
