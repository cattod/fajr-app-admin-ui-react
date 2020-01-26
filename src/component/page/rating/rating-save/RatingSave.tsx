import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { BaseComponent } from '../../../_base/BaseComponent';
import { TInternationalization } from '../../../../config/setup';
import { Input } from '../../../form/input/Input';
import { History } from "history";
// import { IRating } from '../../../../model/model.rating';
import { RatingService } from '../../../../service/service.rating';
import { Localization } from '../../../../config/localization/localization';
import { BtnLoader } from '../../../form/btn-loader/BtnLoader';
import { ConfirmNotify } from '../../../form/confirm-notify/ConfirmNotify';
import { Utility } from '../../../../asset/script/utility';
import { IMovie } from '../../../../model/model.movie';
import { MovieService } from '../../../../service/service.movie';
import { ContentLoader } from '../../../form/content-loader/ContentLoader';
import { CmpUtility } from '../../../_base/CmpUtility';
import Rating from 'react-rating';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
// import { IUser } from '../../../../model/model.user';
import { IRating } from '../../../../model/model.rating';

type formNumberType =
    'overall_rate' |

    'novel' | 'character' | 'reason' |

    'directing' | 'acting' | 'editing' |
    'visualization' | 'sound' | 'music' |

    'violence_range' |
    'insulting_range' |
    'sexual_content' |
    'unsuitable_wearing' |
    'addiction_promotion' |
    'horror_content' |
    'suicide_encouragement' |
    'breaking_law_encouragement' |
    'gambling_promotion' |
    'alcoholic_promotion' |

    'family_subject' |
    'individual_social_behavior' |
    'feminism_exposure' |
    'justice_seeking' |
    'theism' |
    'bright_future_exposure' |
    'hope' |
    'iranian_life_style' |
    'true_vision_of_enemy' |
    'true_historiography'
    ;

const formNumberTypeList: formNumberType[] = [
    'overall_rate',

    'novel', 'character', 'reason',

    'directing', 'acting', 'editing',
    'visualization', 'sound', 'music',

    'violence_range',
    'insulting_range',
    'sexual_content',
    'unsuitable_wearing',
    'addiction_promotion',
    'horror_content',
    'suicide_encouragement',
    'breaking_law_encouragement',
    'gambling_promotion',
    'alcoholic_promotion',

    'family_subject',
    'individual_social_behavior',
    'feminism_exposure',
    'justice_seeking',
    'theism',
    'bright_future_exposure',
    'hope',
    'iranian_life_style',
    'true_vision_of_enemy',
    'true_historiography'
];

interface IState {
    // formData: IRating | undefined;
    confirmNotify_remove_show: boolean;
    confirmNotify_remove_loader: boolean;
    widget_info_collapse: boolean;
    actionBtn: {
        [key in 'remove' | 'create' | 'update']: {
            visible: boolean;
            disable: boolean;
        };
    };
    data: {
        info: IMovie | undefined;
        form: {
            [key in formNumberType]: {
                value: number | undefined;
                isValid: boolean;
            };
        } & { comment: { value: string | undefined; isValid: boolean; } };
    };
    form_loader: boolean;
}
interface IProps {
    internationalization: TInternationalization;
    history: History;
    match: any;
    // logged_in_user: IUser | null;
}

class RatingSaveComponent extends BaseComponent<IProps, IState> {
    state: IState = {
        // formData: undefined,
        confirmNotify_remove_show: false,
        confirmNotify_remove_loader: false,
        widget_info_collapse: true,
        actionBtn: {
            remove: { visible: false, disable: true },
            create: { visible: false, disable: true },
            update: { visible: false, disable: true },
        },
        data: {
            info: undefined,
            form: this.getFormDefaultValue(),
        },
        form_loader: true,
    };
    movieId!: string;
    ratingId: string | undefined;

    private _ratingService = new RatingService();
    private _movieService = new MovieService();

    componentWillMount() {
        this.movieId = this.props.match.params.movieId;
        if (!this.movieId) this.goto_movie();
    }

    componentDidMount() {
        if (!this.movieId) return;
        this.fetchFormData();
    }

    getFormDefaultValue() {
        const obj: any = { comment: { value: undefined, isValid: true } };
        formNumberTypeList.forEach(item => {
            obj[item] = { value: undefined, isValid: true };
        });
        return obj;
    }

    async fetchFormData() {
        // if (!this.props.logged_in_user) return;

        // const personId = this.props.logged_in_user.person.id;
        // const res = await this._ratingService.search(1, 0, { movie_id: this.movieId, person_id: personId })
        const res = await this._ratingService.getMovieRating(this.movieId)
            .catch(err => {
                this.handleError({ error: err.response, toastOptions: { toastId: 'fetchFormData_error' } });
            });

        if (res) {
            // debugger;
            // if (res.data.result.length) {
            if (res.data.hasOwnProperty('id')) {
                const rating = res.data as IRating;
                this.ratingId = rating.id;

                const formData: any = { comment: { value: rating.comment, isValid: true } };
                // debugger;
                formNumberTypeList.forEach(item => {
                    // formData[item] = { value: res.data.result[0][item], isValid: true };
                    formData[item] = { value: rating[item], isValid: true };
                });
                this.setState({
                    // data: { form: formData, info: res.data.result[0].movie },
                    data: { form: formData, info: rating.movie },
                    actionBtn: {
                        remove: { visible: true, disable: false },
                        create: { visible: false, disable: true },
                        update: { visible: true, disable: false },
                    },
                    form_loader: false
                });
            } else {
                this.setState({
                    actionBtn: {
                        remove: { visible: false, disable: true },
                        create: { visible: true, disable: false }, // disable: true
                        update: { visible: false, disable: true },
                    },
                });

                const res_movie = await this._movieService.getById(this.movieId).catch(err => {
                    this.handleError({ error: err.response, toastOptions: { toastId: 'fetchFormData_error' } });
                });

                if (res_movie) {
                    this.setState({
                        data: { form: this.state.data.form, info: res_movie.data },
                        form_loader: false
                    });
                } else {
                    this.setState({ form_loader: false });
                }
            }

        } else {
            this.setState({ form_loader: false });
        }
    }

    private getFormData(): IRating {
        const data: any = {
            movie_id: this.movieId,
            comment: this.state.data.form.comment.value
        };
        formNumberTypeList.forEach(item => {
            data[item] = this.state.data.form[item].value;
        });
        return data;
    }

    private async create() {
        // debugger;
        const res = await this._ratingService.create(this.getFormData()).catch(err => {
            this.handleError({ error: err.response, toastOptions: { toastId: 'create_error' } });
        });
        debugger;
        if (res) {
            debugger;
            this.apiSuccessNotify();
            this.ratingId = res.data.id;
            this.setState({
                actionBtn: {
                    remove: { visible: true, disable: false },
                    create: { visible: false, disable: true },
                    update: { visible: true, disable: false },
                },
            });
        }
    }

    private async update() {
        debugger;
        if (!this.ratingId) return;
        const res = await this._ratingService.update(this.getFormData(), this.ratingId).catch(err => {
            this.handleError({ error: err.response, toastOptions: { toastId: 'update_error' } });
        });
        debugger;
        if (res) {
            debugger;
            this.apiSuccessNotify();
        }
    }

    private open_confirmNotify_remove() {
        this.setState({ confirmNotify_remove_show: true });
    }
    private close_confirmNotify_remove() {
        this.setState({ confirmNotify_remove_show: false });
    }
    private async confirmNotify_onConfirm_remove() {
        debugger;
        if (!this.ratingId) return;

        this.setState({ confirmNotify_remove_loader: true });

        const res = await this._ratingService.remove(this.ratingId).catch(err => {
            debugger;
            this.handleError({ error: err.response, toastOptions: { toastId: 'onConfirm_remove_error' } });
        });
        debugger;
        if (res) {
            debugger;
            setTimeout(() => {
                this.apiSuccessNotify();
            }, 300);
        }

        this.setState({ confirmNotify_remove_show: false, confirmNotify_remove_loader: false });
        this.goto_movie();
    }

    private goto_movie(): void {
        this.props.history.push(`/movie/manage`);
    }

    private toggleCollapse_widget_info() {
        this.setState({ widget_info_collapse: !this.state.widget_info_collapse });
    }

    widget_info_render() {
        const movie = this.state.data.info;
        if (movie === undefined) {
            return <></>;
        }
        const movie_img = (movie.images && movie.images.length !== 0) ? movie.images[0] : '';
        return (<>
            <div className="widget position-relative">
                <div className="widget-header bordered-bottom bordered-info bg-white">
                    <i className="widget-icon fa fa-video-camera text-dark"></i>
                    <span className="widget-caption text-dark">{movie.title}</span>
                    <div className="widget-buttons">
                        <a className="cursor-pointer"
                            data-toggle="collapse"
                            onClick={() => this.toggleCollapse_widget_info()}
                        >
                            <i className={"fa text-orange " + (this.state.widget_info_collapse ? 'fa-plus' : 'fa-minus')}></i>
                        </a>
                    </div>
                </div>
                <div className={"widget-body " + (this.state.widget_info_collapse ? 'd-none' : '')}>
                    <div className="row">
                        <div className="col-sm-3 mb-3 mb-sm-0">
                            <img src={CmpUtility.getImageUrl(movie_img)} alt="..." className="img-thumbnail max-w-100" />
                        </div>
                        <div className="col-sm-9">
                            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3">
                                <div className="col mb-2">
                                    <span className="text-muted h6">{Localization.movie_obj.director}: </span>
                                    <span className="h6">{movie.director}</span>
                                </div>
                                <div className="col mb-2">
                                    <span className="text-muted h6">{Localization.movie_obj.producer}: </span>
                                    <span className="h6">{movie.producer}</span>
                                </div>
                                <div className="col mb-2">
                                    <span className="text-muted h6">{Localization.movie_obj.writer}: </span>
                                    <span className="h6">{movie.writer}</span>
                                </div>
                                <div className="col mb-2">
                                    <span className="text-muted h6">{Localization.movie_obj.genre}: </span>
                                    <span className="h6">{movie.genre}</span>
                                </div>
                                <div className="col mb-2">
                                    <span className="text-muted h6">{Localization.movie_obj.pub_year}: </span>
                                    <span className="h6">{movie.pub_year}</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <span className="text-muted h6">{Localization.movie_obj.description}: </span>
                                    <span className="h6">{movie.description}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ContentLoader gutterClassName="gutter-0" show={this.state.form_loader}></ContentLoader>
                </div>
            </div>
        </>)
    }

    on_overall_rate_Change(newRate: number) {
        this.setState({
            data: {
                ...this.state.data,
                form: { ...this.state.data.form, overall_rate: { value: newRate, isValid: true } }
            }
        });
    }

    private getRateList(mode: 1 | 2 | 3): { title: string, value: number }[] {
        switch (mode) {
            case 1:
                return [
                    { title: 'perfect', value: 5 },
                    { title: 'good', value: 4 },
                    { title: 'average', value: 3 },
                    { title: 'bad', value: 2 },
                    { title: 'poor', value: 1 }
                ];
            case 2:
                return [
                    { title: 'very_much', value: 5 },
                    { title: 'much', value: 4 },
                    { title: 'normal', value: 3 },
                    { title: 'low', value: 2 },
                    { title: 'not_at_all', value: 1 }
                ];
            case 3:
                return [
                    { title: 'promoter', value: 3 },
                    { title: 'neutral', value: 2 },
                    { title: 'destructive', value: 1 },
                ];
        }
    }
    on_general_el_changed(name: formNumberType, value: number) {
        this.setState({
            data: {
                ...this.state.data,
                form: { ...this.state.data.form, [name]: { value, isValid: true } }
            }
        });
    }

    handleInputChange(value: any, isValid: boolean) {
        this.setState({
            data: {
                ...this.state.data,
                form: { ...this.state.data.form, comment: { value, isValid } }
            }
        });
    }

    formStructure = {
        groups: [
            {
                title: 'story',
                items: ['novel', 'character', 'reason'],
                mode: 1
            },
            {
                title: 'form',
                items: ['directing', 'acting', 'editing', 'visualization', 'sound', 'music'],
                mode: 1
            },
            {
                title: 'norm',
                items: ['violence_range', 'insulting_range', 'sexual_content', 'unsuitable_wearing', 'addiction_promotion', 'horror_content', 'suicide_encouragement', 'breaking_law_encouragement', 'gambling_promotion', 'alcoholic_promotion'],
                mode: 2
            },
            {
                title: 'content',
                items: ['family_subject', 'individual_social_behavior', 'feminism_exposure', 'justice_seeking', 'theism', 'bright_future_exposure', 'hope', 'iranian_life_style', 'true_vision_of_enemy', 'true_historiography'],
                mode: 3
            }
        ]
    };

    widget_form_render() {
        return (<>
            <div className="widget position-relative">
                <div className="widget-header bordered-bottom bordered-system bg-white">
                    <span className="widget-caption text-dark">{Localization.movie_rating_obj.save}</span>
                    {
                        this.state.actionBtn.create.visible ?
                            <div className="widget-buttons buttons-bordered--">
                                <button className="btn btn-success btn-xs btn-circle" onClick={() => this.create()}
                                    disabled={this.state.actionBtn.create.disable}
                                >
                                    <i className="fa fa-save"></i>
                                </button>
                            </div>
                            : ''
                    }
                    {
                        this.state.actionBtn.update.visible ?
                            <div className="widget-buttons buttons-bordered--">
                                <button className="btn btn-primary btn-xs btn-circle" onClick={() => this.update()}
                                    disabled={this.state.actionBtn.update.disable}
                                >
                                    <i className="fa fa-edit"></i>
                                </button>
                            </div>
                            : ''
                    }
                    {
                        this.state.actionBtn.remove.visible ?
                            <div className="widget-buttons buttons-bordered--">
                                <button className="btn btn-danger btn-xs btn-circle" onClick={() => this.open_confirmNotify_remove()}
                                    disabled={this.state.actionBtn.remove.disable}
                                >
                                    <i className="fa fa-trash"></i>
                                </button>
                            </div>
                            : ''
                    }
                    <div className="widget-buttons buttons-bordered ml-3">
                        <button className="btn btn-primary btn-xs btn-circle" onClick={() => this.goto_movie()}>
                            <i className="fa fa-reply-app"></i>
                        </button>
                    </div>
                </div>
                <div className="widget-body">
                    <div className="row mb-4 mt-2">
                        <div className="col-12">
                            <span className="h5 text-muted">{Localization.rating_obj.overall_rate}: </span>

                            <Rating
                                className="rating-star"
                                emptySymbol="fa fa-star fa-2x rating-empty"
                                fullSymbol="fa fa-star fa-2x rating-full"
                                // fractions={2}
                                direction={this.props.internationalization.rtl ? 'rtl' : 'ltr'}
                                initialRating={this.state.data.form.overall_rate.value}
                                onChange={(newRate) => this.on_overall_rate_Change(newRate)}
                                // onClick={(newRate) => this.on_overall_rate_Change(newRate)}
                                // start={1}
                                stop={10}
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-12 text-center">
                            <span className="h6 text-muted">{Localization.rating_wrapper_obj.detailed_scoring}</span>
                        </div>
                    </div>

                    {
                        this.formStructure.groups.map(item => {
                            return (<>
                                <div className="row mb-4">
                                    <div className="col-12 mb-2">
                                        <div className="h5 text-muted ml-4">{Localization.rating_wrapper_obj[item.title]}</div>
                                    </div>

                                    {
                                        item.items.map(name => {
                                            return (<>
                                                <div className="col-12 mb-2" key={name}>
                                                    <span className="h6 text-muted">{Localization.rating_obj[name]}: </span>

                                                    <ToggleButtonGroup
                                                        className="btn-group-sm"
                                                        type="radio"
                                                        name={`${item.title}-${name}`}
                                                        defaultValue={(this.state.data.form as any)[name].value}
                                                        value={(this.state.data.form as any)[name].value}
                                                        onChange={(rate: number) => this.on_general_el_changed(name as formNumberType, rate)}
                                                    >
                                                        {
                                                            this.getRateList(item.mode as 1 | 2 | 3).map(rate => (
                                                                <ToggleButton
                                                                    key={rate.value}
                                                                    className={"min-w-70px-- btn-light "}
                                                                    value={rate.value}
                                                                >
                                                                    {Localization.rating_value_obj[rate.title]}
                                                                </ToggleButton>
                                                            ))
                                                        }
                                                    </ToggleButtonGroup>
                                                </div>
                                            </>)
                                        })
                                    }
                                </div>
                            </>)
                        })
                    }

                    <div className="row">
                        <div className="col">
                            <Input
                                label={Localization.rating_obj.write_comment}
                                defaultValue={this.state.data.form.comment.value}
                                onChange={(val, isValid) => { this.handleInputChange(val, isValid) }}
                                placeholder={Localization.rating_obj.comment_about_movie}
                                is_textarea
                                textarea_rows={5}
                            />
                        </div>
                    </div>

                    <div className="row mt-3">
                        <div className="col-12">
                            {
                                this.state.actionBtn.create.visible ?
                                    <BtnLoader
                                        btnClassName="btn btn-success mr-1"
                                        loading={false}
                                        onClick={() => this.create()}
                                        disabled={this.state.actionBtn.create.disable}
                                    >
                                        {Localization.create}&nbsp;<i className="fa fa-save"></i>
                                    </BtnLoader>
                                    : ''
                            }
                            {
                                this.state.actionBtn.update.visible ?
                                    <BtnLoader
                                        btnClassName="btn btn-primary mr-1"
                                        loading={false}
                                        onClick={() => this.update()}
                                        disabled={this.state.actionBtn.update.disable}
                                    >
                                        {Localization.update}&nbsp;<i className="fa fa-edit"></i>
                                    </BtnLoader>
                                    : ''
                            }
                            {
                                this.state.actionBtn.remove.visible ?
                                    <BtnLoader
                                        btnClassName="btn btn-danger"
                                        loading={false}
                                        onClick={() => this.open_confirmNotify_remove()}
                                        disabled={this.state.actionBtn.remove.disable}
                                    >
                                        {Localization.remove}&nbsp;<i className="fa fa-trash"></i>
                                    </BtnLoader>
                                    : ''
                            }
                            <div className="btn btn-primary pull-right" onClick={() => this.goto_movie()}>
                                {Localization.go_back}&nbsp;<i className="fa fa-reply-app"></i>
                            </div>

                        </div>
                    </div>

                    <ContentLoader gutterClassName="gutter-0" show={this.state.form_loader}></ContentLoader>
                </div>
            </div>
        </>);
    }

    render() {
        return (
            <>
                <div className="row">
                    <div className="col-12">
                        {this.widget_info_render()}
                    </div>

                    <div className="col-12">
                        {this.widget_form_render()}
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
                    btnLoader={this.state.confirmNotify_remove_loader}
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
        // logged_in_user: state.logged_in_user,
    }
}

const dispatch2props = (dispatch: Dispatch) => {
    return {
    }
}

export const RatingSave = connect(state2props, dispatch2props)(RatingSaveComponent);
//#endregion
