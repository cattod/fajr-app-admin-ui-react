import React from 'react';
import { Route } from 'react-router-dom';
// import { LayoutAccountHeader } from './header/Header';
// import { LayoutAccountFooter } from './footer/Footer';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../redux/app_state';
import { IUser } from '../../../model/model.user';
import { History } from "history";
import { LayoutAccountFooter } from './footer/Footer';

export const RouteLayoutAccount = ({ component: Component, ...rest }: { [key: string]: any }) => {
    return (
        <Route {...rest} render={matchProps => (
            <LayoutAccount {...matchProps}>
                <Component {...matchProps} />
            </LayoutAccount>
        )} />
    )
};

interface IProps {
    logged_in_user: IUser | null;
    history: History;
    // match: any;
}

class LayoutAccountComponent extends React.Component<IProps> {

    componentDidMount() {
        if (this.props.logged_in_user) {
            this.props.history.push("/dashboard");
        } else {
            document.body.classList.add('layout-account');
        }
    }

    // componentDidMount() {
    //     // console.log('add class');
    //     document.body.classList.add('layout-account');
    // }

    componentWillUnmount() {
        // console.log('remove class');
        document.body.classList.remove('layout-account');
    }

    shouldComponentUpdate() {
        if (this.props.logged_in_user) {
            this.props.history.push("/dashboard");
            return false;
        }
        return true;
    }

    render() {
        return (
            <>
                {/* <LayoutAccountHeader /> */}
                {this.props.children}
                <LayoutAccountFooter />
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

export const LayoutAccount = connect(state2props, dispatch2props)(LayoutAccountComponent);
