import React from "react";
import { NavLink } from "react-router-dom";

class LayoutAccountHeaderComponent extends React.Component<any>{
    render() {
        return (
            <>
                <div className="navbar navbar-fixed-top sticky-top-- fixed-top">
                    <div className="navbar-inner">
                        <div className="navbar-container text-center">
                            <div className="navbar-header pull-left- d-inline-block">
                                <NavLink className="navbar-brand" to="/login">
                                    <small>
                                        <img
                                            src="/static/media/img/icon/filmsanj-logo-tr.png"
                                            alt="filmsanj logo"
                                            className="w-auto"
                                        />
                                    </small>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export const LayoutAccountHeader = LayoutAccountHeaderComponent;
