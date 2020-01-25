import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { BaseComponent } from '../../../_base/BaseComponent';
import { TInternationalization } from '../../../../config/setup';

interface IState {
}
interface IProps {
    internationalization: TInternationalization;
}

class MovieManageComponent extends BaseComponent<IProps, IState> {
    state: IState = {
    };

    render() {
        return (
            <>
                <div>MovieManage</div>

                <ToastContainer {...this.getNotifyContainerConfig()} />
            </>
        )
    }
}

//#region redux
const state2props = (state: redux_state) => {
    return {
        internationalization: state.internationalization,
    }
}

const dispatch2props = (dispatch: Dispatch) => {
    return {
    }
}

export const MovieManage = connect(state2props, dispatch2props)(MovieManageComponent);
//#endregion
