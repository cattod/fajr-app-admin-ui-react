import React from 'react';
import { Route } from 'react-router-dom';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../redux/app_state';
import { IUser } from '../../../model/model.user';
import { History } from "history";
import { LayoutAccountFooter } from './footer/Footer';
import { LayoutAccountHeader } from './header/Header';

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

            this.handleScroll();
            window.addEventListener('scroll', this.handleScroll, { passive: true })
        }
    }

    componentWillUnmount() {
        document.body.classList.remove('layout-account');

        window.removeEventListener('scroll', this.handleScroll)
        document.body.classList.remove('expand-navbar');
    }

    private handleScroll() {
        const top = window.pageYOffset || window.pageYOffset;
        if (top < 32) {
            document.body.classList.add('expand-navbar');
        } else {
            document.body.classList.remove('expand-navbar');
        }
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
                <LayoutAccountHeader />
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
