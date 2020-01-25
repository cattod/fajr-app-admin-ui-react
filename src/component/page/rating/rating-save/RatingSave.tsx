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
import { ConfirmNotify } from '../../../form/confirm-notify/ConfirmNotify';

interface IState {
    formData: IRating | undefined;
    confirmNotify_remove_show: boolean;
}
interface IProps {
    internationalization: TInternationalization;
    history: History;
    match: any;
}

class RatingSaveComponent extends BaseComponent<IProps, IState> {
    state: IState = {
        formData: undefined,
        confirmNotify_remove_show: false,
    };
    movieId!: string;

    private _ratingService = new RatingService();

    componentWillMount() {
        this.movieId = this.props.match.params.movieId;
        if (!this.movieId) this.goto_movie();
    }

    componentDidMount() {
        if (!this.movieId) return;
        this.fetchFormData();
    }

    async fetchFormData() {
        // debugger;
        const res = await this._ratingService.getById(this.movieId).catch(err => {
            this.handleError({ error: err.response, toastOptions: { toastId: 'fetchFormData_error' } });
        });

        if (res) {
            this.setState({ formData: res.data });
        }
    }

    private saveFormData() {
        // save data with movie_id & user_id
        // do not change route
    }

    private open_confirmNotify_remove() {
        this.setState({ confirmNotify_remove_show: true });
    }
    private close_confirmNotify_remove() {
        this.setState({ confirmNotify_remove_show: false });
    }
    private confirmNotify_onConfirm_remove() {
        // debugger;

        this.setState({ confirmNotify_remove_show: false });
    }

    private removeFormData() {
        // open confirm modal

        // remove data 
        // goto_movie
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
                                <span className="widget-caption text-dark">{Localization.movie_rating_obj.save}</span>
                                <div className="widget-buttons buttons-bordered--">
                                    <div className="btn btn-system btn-xs btn-circle" onClick={() => this.saveFormData()}>
                                        <i className="fa fa-save"></i>
                                    </div>
                                </div>
                                <div className="widget-buttons buttons-bordered--">
                                    <div className="btn btn-danger btn-xs btn-circle" onClick={() => this.open_confirmNotify_remove()}>
                                        <i className="fa fa-trash"></i>
                                    </div>
                                </div>
                                <div className="widget-buttons buttons-bordered ml-3">
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
                                            onClick={() => this.saveFormData()}
                                        // disabled={!this.state.isFormValid}
                                        >
                                            {Localization.save}&nbsp;<i className="fa fa-save"></i>
                                        </BtnLoader>
                                        <BtnLoader
                                            btnClassName="btn btn-danger"
                                            loading={false}
                                            onClick={() => this.open_confirmNotify_remove()}
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

                <ConfirmNotify
                    show={this.state.confirmNotify_remove_show}
                    onHide={() => this.close_confirmNotify_remove()}
                    onConfirm={() => this.confirmNotify_onConfirm_remove()}
                    msg={Localization.msg.ui.item_will_be_removed_continue}
                    confirmBtn_className='text-danger'
                    confirmBtn_text={Localization.remove}
                    closeBtn_text={Localization.cancel}
                />

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
