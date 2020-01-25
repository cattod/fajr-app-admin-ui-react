import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { BaseComponent } from '../../../_base/BaseComponent';
import { TInternationalization } from '../../../../config/setup';
import { Input } from '../../../form/input/Input';

interface IState {
}
interface IProps {
    internationalization: TInternationalization;
}

class RatingSaveComponent extends BaseComponent<IProps, IState> {
    state: IState = {
    };

    render() {
        return (
            <>
                <div className="row">
                    <div className="col-12">
                        <div className="widget">
                            <div className="widget-header bordered-bottom bordered-blue">
                                <span className="widget-caption">Rating Save</span>
                            </div>
                            <div className="widget-body">
                                <div className="row">
                                    <div className="col-4">
                                        <Input
                                            // defaultValue={this.state.password.value}
                                            // onChange={(val, isValid) => { this.handleInputChange(val, isValid, 'password') }}
                                            // required
                                            // type={this.state.inputPasswordType}
                                            placeholder={'pub year'}
                                        // onKeyUp={(e) => this.handle_keyUp(e)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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

export const RatingSave = connect(state2props, dispatch2props)(RatingSaveComponent);
//#endregion
