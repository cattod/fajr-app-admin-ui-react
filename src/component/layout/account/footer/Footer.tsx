import React from "react";
import { Localization } from "../../../../config/localization/localization";
import { TInternationalization } from "../../../../config/setup";
import { redux_state } from "../../../../redux/app_state";
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';

export interface IProps {
    internationalization: TInternationalization;
}
class LayoutAccountFooterComponent extends React.Component<IProps>{
    render() {
        return (
            <>
                <footer className="footer sticky-footer text-center text-muted">
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
                </footer>
            </>
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
    }
}
export const LayoutAccountFooter = connect(state2props, dispatch2props)(LayoutAccountFooterComponent);
