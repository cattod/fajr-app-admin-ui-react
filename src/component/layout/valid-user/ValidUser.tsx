import React from 'react';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../redux/app_state';
import { IUser } from '../../../model/model.user';
import { History } from "history";
import { BrowserRouter as Router, Route, Switch, Redirect, HashRouter } from 'react-router-dom';
import { Dashboard } from '../../page/dashboard/Dashboard';
import { Profile } from '../../page/profile/Profile';
import { RouteLayoutMain } from './main/Main';
import { Blank } from '../../page/blank/Blank';
import { LayoutNoWrapNotFound } from './no-wrap/not-found/NotFound';
import { RouteLayoutNoWrap } from './no-wrap/NoWrap';

const appValidUserRoutes = (
    <HashRouter>
        <Switch>
            <Route exact path="/" component={() => <Redirect to="/dashboard" />} />
            <RouteLayoutMain exact path="/dashboard" component={Dashboard} />
            <RouteLayoutMain path="/profile" component={Profile} />
            <RouteLayoutMain path="/blank" component={Blank} />
            
            {/* keep "cmp LayoutNoWrapNotFound" last */}
            <RouteLayoutNoWrap component={LayoutNoWrapNotFound} />
        </Switch>
    </HashRouter>
);

export const RouteLayoutValidUser = ({ ...rest }: { [key: string]: any }) => {
    return (
        <Route {...rest} render={matchProps => (
            <LayoutValidUser {...matchProps} />
        )} />
    )
};

interface IProps {
    logged_in_user: IUser | null;
    history: History;
    match: any;
}

class LayoutValidUserComponent extends React.Component<IProps> {

    componentWillMount() {
        // debugger;
        if (!this.props.logged_in_user) {
            this.props.history.push("/login");

        } else {

        }
    }

    componentWillUnmount() {
    }

    shouldComponentUpdate() {
        // debugger;
        if (!this.props.logged_in_user) {
            this.props.history.push("/login");
            return false;
        }
        return true;
    }

    render() {
        if (!this.props.logged_in_user) {
            return (
                <div></div>
            );
        }
        return (
            <>
                <Router>{appValidUserRoutes}</Router>
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
        logged_in_user: state.logged_in_user,
    }
}

export const LayoutValidUser = connect(state2props, dispatch2props)(LayoutValidUserComponent);
