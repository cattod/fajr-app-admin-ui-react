import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { BaseComponent } from '../../../_base/BaseComponent';
import { TInternationalization } from '../../../../config/setup';
import { Input } from '../../../form/input/Input';
import { History } from "history";
import { IRating } from '../../../../model/model.rating';
import { RatingService } from '../../../../service/service.rating';
import { Localization } from '../../../../config/localization/localization';
import { BtnLoader } from '../../../form/btn-loader/BtnLoader';

interface IState {
    formData: IRating | undefined;
}
interface IProps {
    internationalization: TInternationalization;
    history: History;
}

class RatingSaveComponent extends BaseComponent<IProps, IState> {
    state: IState = {
        formData: undefined,
    };

    private _ratingService = new RatingService();

    componentDidMount() {
        this.fetchFormData();
    }

    async fetchFormData() {
        // debugger;
        const res = await this._ratingService.getById('sss').catch(err => {
            this.handleError({ error: err.response, toastOptions: { toastId: 'fetchFormData_error' } });
        });

        if (res) {
            this.setState({ formData: res.data });
        }
    }

    private goto_movie(): void {
        this.props.history.push(`/movie/manage`);
    }

    render() {
        return (
            <>
                <div className="row">
                    <div className="col-12">
                        <div className="widget">
                            <div className="widget-header bordered-bottom bordered-system bg-white">
                                <span className="widget-caption text-dark">Rating Save</span>
                                <div className="widget-buttons buttons-bordered--">
                                    <div className="btn btn-system btn-xs btn-circle" onClick={() => this.goto_movie()}>
                                        <i className="fa fa-save"></i>
                                    </div>
                                </div>
                                <div className="widget-buttons buttons-bordered--">
                                    <div className="btn btn-danger btn-xs btn-circle" onClick={() => this.goto_movie()}>
                                        <i className="fa fa-trash"></i>
                                    </div>
                                </div>
                                <div className="widget-buttons buttons-bordered ml-3--">
                                    <div className="btn btn-primary btn-xs btn-circle" onClick={() => this.goto_movie()}>
                                        <i className="fa fa-reply-app"></i>
                                    </div>
                                </div>
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

                                <div className="row mt-3">
                                    <div className="col-12">
                                        <BtnLoader
                                            btnClassName="btn btn-system mr-1"
                                            loading={false}
                                            onClick={() => { }}
                                        // disabled={!this.state.isFormValid}
                                        >
                                            {Localization.save}&nbsp;<i className="fa fa-save"></i>
                                        </BtnLoader>
                                        <BtnLoader
                                            btnClassName="btn btn-danger"
                                            loading={false}
                                            onClick={() => { }}
                                        // disabled={!this.state.isFormValid}
                                        >
                                            {Localization.remove}&nbsp;<i className="fa fa-trash"></i>
                                        </BtnLoader>

                                        <div className="btn btn-primary pull-right" onClick={() => this.goto_movie()}>
                                            {Localization.go_back}&nbsp;<i className="fa fa-reply-app"></i>
                                        </div>
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
