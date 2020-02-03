import React, { Fragment } from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { BaseComponent } from '../../../_base/BaseComponent';
import { TInternationalization, Setup } from '../../../../config/setup';
import { Input } from '../../../form/input/Input';
import { History } from "history";
// import { IRating } from '../../../../model/model.rating';
import { RatingService } from '../../../../service/service.rating';
import { Localization } from '../../../../config/localization/localization';
import { BtnLoader } from '../../../form/btn-loader/BtnLoader';
import { ConfirmNotify } from '../../../form/confirm-notify/ConfirmNotify';
// import { Utility } from '../../../../asset/script/utility';
import { IMovie } from '../../../../model/model.movie';
import { MovieService } from '../../../../service/service.movie';
import { ContentLoader } from '../../../form/content-loader/ContentLoader';
import { CmpUtility } from '../../../_base/CmpUtility';
// import Rating from 'react-rating';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
// import { IUser } from '../../../../model/model.user';
import { IRating } from '../../../../model/model.rating';
import Select from 'react-select';
import { ratingFormStructure, getRateList, getRateAdjValue, TFormNumberType, formNumberTypeList, TGroupTitle } from './ratingFormStructure';
import { Utility } from '../../../../asset/script/utility';
import { Store2 } from '../../../../redux/store';
import RcSlider, { Handle } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import { action_update_Movie } from '../../../../redux/action/movie';

interface IState {
    // formData: IRating | undefined;
    confirmNotify_remove_show: boolean;
    confirmNotify_remove_loader: boolean;
    widget_info_collapse: boolean;
    actionBtn: {
        [key in 'remove' | 'create' | 'update']: {
            visible: boolean;
            disable: boolean;
            loading: boolean;
        };
    };
    data: {
        info: IMovie | undefined;
        form: {
            [key in TFormNumberType]: {
                value: number | undefined;
                isValid: boolean;
            };
        } & {
            comment: { value: string | undefined; isValid: boolean; };
            tags: { value: { label: string, value: string }[]; isValid: boolean; };

            story: { value: string | undefined; isValid: boolean; };
            form: { value: string | undefined; isValid: boolean; };
            norm: { value: string | undefined; isValid: boolean; };
            content: { value: string | undefined; isValid: boolean; };
        };
    };
    form_loader: boolean;
    tags_inputValue: string;
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
        widget_info_collapse: false,
        actionBtn: {
            remove: { visible: false, disable: true, loading: false },
            create: { visible: false, disable: true, loading: false },
            update: { visible: false, disable: true, loading: false },
        },
        data: {
            info: undefined,
            form: this.getFormDefaultValue(),
        },
        form_loader: true,
        tags_inputValue: ''
    };
    movieId!: string;
    ratingId: string | undefined;

    private _ratingService = new RatingService();
    private _movieService = new MovieService();

    componentDidMount() {
        this.movieId = this.props.match.params.movieId;
        if (!this.movieId) this.goto_movie();

        CmpUtility.gotoTop();
        if (!this.movieId) return;
        this.fetchFormData();
    }

    getFormDefaultValue() {
        const obj: any = {
            comment: { value: undefined, isValid: true },
            tags: { value: [], isValid: true },

            story: { value: undefined, isValid: true },
            form: { value: undefined, isValid: true },
            norm: { value: undefined, isValid: true },
            content: { value: undefined, isValid: true },
        };
        formNumberTypeList.forEach(item => {
            obj[item] = { value: undefined, isValid: true };
        });
        return obj;
    }

    private async fetchFormData() {
        const { /* persisted, */ rated } = this.fetchOfflineData();

        this.setState({ form_loader: rated });

        const res = await this._ratingService.getMovieRating(this.movieId)
            .catch(err => {
                this.handleError({ error: err.response, toastOptions: { toastId: 'fetchFormData_error' } });
            });

        if (res) {
            if (res.data.hasOwnProperty('id')) {
                const rating = res.data as IRating;
                this.ratingId = rating.id;

                let tagVal: any = [];
                if (rating.tags) {
                    tagVal = rating.tags.map(t => { return { label: t, value: t } });
                }

                const formData: any = {
                    comment: { value: rating.comment, isValid: true },
                    tags: { isValid: true, value: tagVal || [] },

                    story: { value: rating.question_1, isValid: true },
                    form: { value: rating.question_2, isValid: true },
                    norm: { value: rating.question_3, isValid: true },
                    content: { value: rating.question_4, isValid: true },
                };
                // debugger;
                formNumberTypeList.forEach(item => {
                    // formData[item] = { value: res.data.result[0][item], isValid: true };
                    formData[item] = { value: rating[item], isValid: true };
                });
                this.setState({
                    // data: { form: formData, info: res.data.result[0].movie },
                    data: { form: formData, info: rating.movie },
                    actionBtn: {
                        remove: { visible: true, disable: false, loading: false },
                        create: { visible: false, disable: true, loading: false },
                        update: { visible: true, disable: false, loading: false },
                    },
                    form_loader: false
                });
            } else {
                this.setState({
                    actionBtn: {
                        remove: { visible: false, disable: true, loading: false },
                        create: { visible: true, disable: false, loading: false }, // disable: true
                        update: { visible: false, disable: true, loading: false },
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

    private fetchOfflineData(): { persisted: boolean, rated: boolean } {
        const persisted_movie_list = Store2.getState().movie.list;
        let persisted = false;
        let rated = false;
        if (persisted_movie_list.length) {
            const thisMovie = persisted_movie_list.find(m => m.id === this.movieId);
            if (thisMovie) {
                persisted = true;
                rated = thisMovie.rated_by_user;
                this.setState({
                    data: { ...this.state.data, info: thisMovie },
                    form_loader: rated!
                });
            }
        }

        return { persisted, rated };
    }

    private offline_toggleMovieRate(rate: boolean): void {
        const PM = Store2.getState().movie;
        const persisted_movie_list = [...PM.list];
        if (persisted_movie_list.length) {
            const thisMovie = persisted_movie_list.find(m => m.id === this.movieId);
            if (thisMovie) {
                thisMovie.rated_by_user = rate;
                Store2.dispatch(action_update_Movie({ ...PM, list: persisted_movie_list }));
            }
        }
    }


    private getFormData(): { data: IRating, filledAny: boolean } {
        let filledAny = false;
        const tags = (this.state.data.form.tags.value || []).map((item: { label: string; value: string }) => item.value);
        const data: any = {
            movie_id: this.movieId,
            comment: this.state.data.form.comment.value,
            tags,

            question_1: this.state.data.form.story.value,
            question_2: this.state.data.form.form.value,
            question_3: this.state.data.form.norm.value,
            question_4: this.state.data.form.content.value,
        };
        if (
            data.comment
            || data.question_1 || data.question_2 || data.question_3 || data.question_4
            || data.tags.length
        ) {
            filledAny = true;
        }
        formNumberTypeList.forEach(item => {
            data[item] = this.state.data.form[item].value;
            if (data[item] !== undefined && data[item] !== null && data[item] !== '') {
                filledAny = true;
            }
        });
        return { data, filledAny };
    }

    private fillAnyNotify() {
        const msg = Localization.msg.ui.movie_filled_any;
        toast.warn(msg, this.getNotifyConfig({ autoClose: Setup.notify.timeout.warning }));
    }

    private async create() {
        const { data: fData, filledAny } = this.getFormData();
        if (!filledAny) {
            this.fillAnyNotify();
            return;
        }
        this.setState({
            actionBtn: {
                ...this.state.actionBtn,
                create: { ...this.state.actionBtn.create, loading: true },
            }
        });
        const res = await this._ratingService.create(fData).catch(err => {
            this.handleError({ error: err.response, toastOptions: { toastId: 'create_error' } });
        });
        if (res) {
            // this.apiSuccessNotify();
            this.ratingId = res.data.id;
            this.setState({
                actionBtn: {
                    remove: { visible: true, disable: false, loading: false },
                    create: { visible: false, disable: true, loading: false },
                    update: { visible: true, disable: false, loading: false },
                },
            });

            this.offline_toggleMovieRate(true);

            setTimeout(() => {
                this.apiSuccessNotify();
            }, 300);
            this.goto_movie();
        }
    }

    private async update() {
        if (!this.ratingId) return;
        const { data: fData, filledAny } = this.getFormData();
        if (!filledAny) {
            this.fillAnyNotify();
            return;
        }
        this.setState({
            actionBtn: {
                ...this.state.actionBtn,
                update: { ...this.state.actionBtn.update, loading: true },
            }
        });
        const res = await this._ratingService.update(fData, this.ratingId).catch(err => {
            this.handleError({ error: err.response, toastOptions: { toastId: 'update_error' } });
        });
        this.setState({
            actionBtn: {
                ...this.state.actionBtn,
                update: { ...this.state.actionBtn.update, loading: false },
            }
        });
        if (res) {
            // this.apiSuccessNotify();

            setTimeout(() => {
                this.apiSuccessNotify();
            }, 300);
            this.goto_movie();
        }
    }

    private open_confirmNotify_remove() {
        this.setState({ confirmNotify_remove_show: true });
    }
    private close_confirmNotify_remove() {
        this.setState({ confirmNotify_remove_show: false });
    }
    private async confirmNotify_onConfirm_remove() {
        if (!this.ratingId) return;
        this.setState({ confirmNotify_remove_loader: true });
        const res = await this._ratingService.remove(this.ratingId).catch(err => {
            this.handleError({ error: err.response, toastOptions: { toastId: 'onConfirm_remove_error' } });
        });
        if (res) {
            this.offline_toggleMovieRate(false);

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

    private handleSelectInputChange(value: { label: string, value: string }[]) {
        // debugger;
        // console.log('handleSelectInputChange', value);
        // return;
        this.setState({
            ...this.state,
            data: {
                ...this.state.data,
                form: {
                    ...this.state.data.form,
                    tags: {
                        isValid: true,
                        value: value || []
                    }
                }
            },
        })
    }
    private isDuplicateTag(tagVal: string): boolean {
        let isDup = false;
        for (let i = 0; i < this.state.data.form.tags.value.length; i++) {
            const c_tag = this.state.data.form.tags.value[i];
            if (c_tag.value === tagVal) {
                isDup = true;
                break;
            }
        }
        return isDup;
    }
    private handle_tagsKeyDown(event: any/* SyntheticKeyboardEvent<HTMLElement> */) {
        if (!this.state.tags_inputValue) return;
        switch (event.key) {
            case 'Enter':
            case 'Tab':
                const newVal = this.state.tags_inputValue;
                if (this.isDuplicateTag(newVal)) return;
                this.setState({
                    ...this.state,
                    data: {
                        ...this.state.data,
                        form: {
                            ...this.state.data.form,
                            tags: {
                                isValid: true,
                                value: [
                                    ...this.state.data.form.tags.value,
                                    { label: newVal, value: newVal }
                                ]
                            }
                        }
                    },
                    tags_inputValue: ''
                });
            // event.preventDefault();
            // event.persist();
        }
    };
    private async handle_tagsBlur(event: any) {
        if (!this.state.tags_inputValue) return;
        const newVal = this.state.tags_inputValue;
        /* cmp react-select remove inputValue onBlur, so here we keep the inputValue & add it after 300 ms. */
        await Utility.waitOnMe(300);
        if (this.isDuplicateTag(newVal)) return;
        // event.preventDefault();
        this.setState({
            ...this.state,
            data: {
                ...this.state.data,
                form: {
                    ...this.state.data.form,
                    tags: {
                        isValid: true,
                        value: [
                            ...this.state.data.form.tags.value,
                            { label: newVal, value: newVal }
                        ]
                    }
                }
            },
            tags_inputValue: ''
        });
        // event.preventDefault();
        // event.persist();
    }

    widget_info_render() {
        const movie = this.state.data.info;
        if (movie === undefined) {
            return <></>;
        }
        const movie_img = (movie.images && movie.images.length !== 0) ? movie.images[0] : '';
        return (<>
            <div className="widget radius-bordered-- position-relative">
                <div className="widget-header bordered-bottom-- bordered-info bg-white d-none">
                    <i className="widget-icon fa fa-video-camera text-dark"></i>
                    <span className="widget-caption text-dark">{movie.title}</span>
                    <div className="widget-buttons d-none">
                        <a className="cursor-pointer"
                            data-toggle="collapse"
                            onClick={() => this.toggleCollapse_widget_info()}
                        >
                            <i className={"fa text-orange " + (this.state.widget_info_collapse ? 'fa-plus' : 'fa-minus')}></i>
                        </a>
                    </div>
                </div>
                <div className={"widget-body rounded " + (this.state.widget_info_collapse ? 'd-none' : '')}>
                    <div className="row">
                        <div className="col-sm-3 mb-3 mb-sm-0 text-center">
                            <img src={CmpUtility.getImageUrl(movie_img)} alt=""
                                className="img-thumbnail max-w-100 max-h-300px--"
                                loading="lazy"
                            />
                        </div>
                        <div className="col-sm-9">
                            {/* <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3"> */}
                            <div className="row row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-2">
                                <div className="col mb-2">
                                    <span className="text-muted-- h5">{Localization.movie_obj.title}: </span>
                                    <span className="h5">{movie.title}</span>
                                </div>
                                <div className="col mb-2">
                                    <span className="text-muted-- h6">{Localization.movie_obj.director}: </span>
                                    <span className="h6">{movie.director}</span>
                                </div>
                                <div className="col mb-2">
                                    <span className="text-muted-- h6">{Localization.movie_obj.producer}: </span>
                                    <span className="h6">{movie.producer}</span>
                                </div>
                                <div className="col mb-2">
                                    <span className="text-muted-- h6">{Localization.movie_obj.writer}: </span>
                                    <span className="h6">{movie.writer}</span>
                                </div>
                                <div className="col mb-2">
                                    <span className="text-muted-- h6">{Localization.movie_obj.genre}: </span>
                                    <span className="h6">{
                                        (movie.genre && movie.genre.length) ?
                                            movie.genre.map((g, index) => (
                                                <div key={g} className="mr-2 d-inline-block">
                                                    {g}
                                                    <span className={(index === movie.genre.length - 1) ? 'd-none' : ''}> - </span>
                                                </div>
                                            ))
                                            : ''
                                    }</span>
                                </div>
                                <div className="col mb-2">
                                    <span className="text-muted-- h6">{Localization.movie_obj.pub_year}: </span>
                                    <span className="h6">{movie.pub_year}</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <span className="text-muted-- h6">{Localization.movie_obj.description}: </span>
                                    <span className="h6 overflow-wrap-break-word">{movie.description}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <ContentLoader gutterClassName="gutter-0" show={this.state.form_loader}></ContentLoader> */}
                </div>
            </div>
        </>)
    }

    on_overall_rate_Change(newRate: number) {
        // const newVal = newRate > 0 ? newRate : undefined;
        if (newRate === 0) return;
        this.setState({
            data: {
                ...this.state.data,
                form: { ...this.state.data.form, overall_rate: { value: newRate, isValid: true } }
            }
        });
    }


    on_general_el_changed(name: TFormNumberType, value: number) {
        this.setState({
            data: {
                ...this.state.data,
                form: { ...this.state.data.form, [name]: { value, isValid: true } }
            }
        });
    }

    handleInputChange(value: any, isValid: boolean, inputType: TGroupTitle | 'comment') {
        this.setState({
            data: {
                ...this.state.data,
                form: { ...this.state.data.form, [inputType]: { value, isValid } }
            }
        });
    }

    private sliderMarks() {
        const rtl = this.props.internationalization.rtl;
        const obj: any = { 0: '' };
        for (let i = 1; i < 11; i++) {
            obj[i] = rtl ? Utility.toPersianNumber(i.toLocaleString()) : i.toLocaleString();
        }
        return obj;
    }

    private sliderTrackStyle() {
        switch (this.state.data.form.overall_rate.value) {
            case 1: case 2:
                return { backgroundColor: '#bf3100' };
            case 3: case 4:
                return { backgroundColor: '#d76a03' };
            case 5: case 6:
                return { backgroundColor: '#ec9f05' };
            case 7: case 8:
                return { backgroundColor: '#f5bb00' };
            case 9: case 10:
                return { backgroundColor: '#8ea604' };
            default:
                return {};
        }
    }

    private sliderHandle(props: any) {
        const { value, dragging, index, ...restProps } = props;
        // console.log(props);
        return (
            <Tooltip
                prefixCls="rc-slider-tooltip"
                overlayClassName={`rating rating-${value}`}
                overlay={value}
                visible={dragging}
                placement="top"
                key={index}
            >
                <Handle value={value} {...restProps} />
            </Tooltip>
        );
    };

    /** @deprecated */
    private sliderTipFormatter(value: number): string {
        console.log('sliderTipFormatter: ', value);
        const rtl = this.props.internationalization.rtl;
        const val = rtl ? Utility.toPersianNumber(value.toLocaleString()) : value.toLocaleString();
        return val + 'aaaaaaa';
    }

    widget_form_render() {
        return (<>
            <div className="widget radius-bordered position-relative">
                <div className="widget-header bordered-bottom-- bordered-system bg-white">
                    <span className="widget-caption text-dark">{Localization.movie_rating_obj.rating}</span>
                    {
                        this.state.actionBtn.create.visible ?
                            <div className="widget-buttons buttons-bordered-- d-none">
                                <button className="btn btn-success btn-xs btn-circle" onClick={() => this.create()}
                                    disabled={this.state.actionBtn.create.disable || this.state.actionBtn.create.loading}
                                >
                                    <i className="fa fa-save"></i>
                                </button>
                            </div>
                            : ''
                    }
                    {
                        this.state.actionBtn.update.visible ?
                            <div className="widget-buttons buttons-bordered-- d-none">
                                <button className="btn btn-primary btn-xs btn-circle" onClick={() => this.update()}
                                    disabled={this.state.actionBtn.update.disable || this.state.actionBtn.update.loading}
                                >
                                    <i className="fa fa-edit"></i>
                                </button>
                            </div>
                            : ''
                    }
                    {
                        this.state.actionBtn.remove.visible ?
                            <div className="widget-buttons buttons-bordered-- d-none">
                                <button className="btn btn-danger btn-xs btn-circle" onClick={() => this.open_confirmNotify_remove()}
                                    disabled={this.state.actionBtn.remove.disable || this.state.actionBtn.remove.loading}
                                >
                                    <i className="fa fa-trash"></i>
                                </button>
                            </div>
                            : ''
                    }
                    <div className="widget-buttons buttons-bordered ml-3 d-none">
                        <button className="btn btn-primary btn-xs btn-circle" onClick={() => this.goto_movie()}>
                            <i className="fa fa-reply-app"></i>
                        </button>
                    </div>
                </div>
                <div className="widget-body">
                    <div className="row mb-4 mt-4">
                        <div className="col-12">

                            <div className="form-box rounded px-3 pt-4">
                                <div className="form-box-header h5 px-2">
                                    {Localization.rating_obj.overall_rate}
                                </div>
                                <div className="form-box-body">
                                    <div className="row">
                                        <div className="col-12 mb-4 text-center">
                                            {/* <Rating
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
                                            /> */}

                                            <RcSlider
                                                // className={
                                                //     "rc-slider-system-- "
                                                //     + (this.props.internationalization.rtl ? 'reverse--' : '')
                                                // }
                                                // reverse={this.props.internationalization.rtl}
                                                min={0}
                                                // step={null}
                                                max={10}
                                                defaultValue={this.state.data.form.overall_rate.value}
                                                onChange={(v) => this.on_overall_rate_Change(v)}
                                                value={this.state.data.form.overall_rate.value}
                                                dots
                                                marks={this.sliderMarks()}
                                                trackStyle={this.sliderTrackStyle()}
                                                handle={(p) => this.sliderHandle(p)}
                                            // tipFormatter={v => this.sliderTipFormatter(v)}
                                            // tipFormatter={value => `${value}%`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-12 text-center">
                            <span className="h6 text-muted">{Localization.rating_wrapper_obj.detailed_scoring}</span>
                        </div>
                    </div>

                    {
                        ratingFormStructure.groups.map((grp, grpIndex) => {
                            return (
                                <div className="row mb-5" key={grpIndex}>
                                    <div className="col-12">
                                        <div className="form-box rounded px-3 pt-4">
                                            <div className="form-box-header h5 px-2">
                                                {Localization.rating_wrapper_obj[grp.title]}
                                            </div>
                                            <div className="form-box-body">
                                                {
                                                    grp.items.map(g_prp => {
                                                        return (
                                                            <Fragment key={g_prp.title}>
                                                                <div className="row">
                                                                    <div className="col-12 mb-4">

                                                                        <div className="h6 text-muted">
                                                                            <i className="fa fa-circle mr-2"></i>
                                                                            <span>{Localization.rating_obj[g_prp.title]}</span>
                                                                        </div>

                                                                        <ToggleButtonGroup
                                                                            className="btn-group-sm"
                                                                            type="radio"
                                                                            name={`${grp.title}-${g_prp.title}`}
                                                                            defaultValue={(this.state.data.form as any)[g_prp.title].value}
                                                                            value={(this.state.data.form as any)[g_prp.title].value}
                                                                            onChange={(rate: number) => this.on_general_el_changed(g_prp.title as TFormNumberType, rate)}
                                                                        >
                                                                            {
                                                                                getRateList(grp.mode as 1 | 2 | 3).map(rate => (
                                                                                    <ToggleButton
                                                                                        key={rate.value}
                                                                                        className={
                                                                                            `btn-el-${getRateAdjValue(grp.mode, rate.value, g_prp.adj)} btn-mode-${grp.mode} `
                                                                                        }
                                                                                        value={rate.value}
                                                                                    >
                                                                                        {Localization.rating_value_obj[rate.title]}
                                                                                    </ToggleButton>
                                                                                ))
                                                                            }
                                                                        </ToggleButtonGroup>

                                                                    </div>
                                                                </div>
                                                            </Fragment>
                                                        )
                                                    })
                                                }

                                                <div className="row">
                                                    <div className="col-12 mb-2">
                                                        <Input
                                                            label={`${Localization.rating_obj.further_details} (${Localization.rating_wrapper_obj[grp.title]})`}
                                                            defaultValue={this.state.data.form[grp.title].value}
                                                            onChange={(val, isValid) => { this.handleInputChange(val, isValid, grp.title) }}
                                                            placeholder={`${Localization.rating_obj.further_details} (${Localization.rating_wrapper_obj[grp.title]})`}
                                                            is_textarea
                                                            textarea_rows={3}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )
                        })
                    }

                    <div className="row">
                        <div className="col-12">
                            <div className="form-group">
                                <label>{Localization.tags}</label>
                                <Select
                                    isRtl={this.props.internationalization.rtl}
                                    isMulti
                                    onChange={(value: any) => this.handleSelectInputChange(value)}
                                    value={this.state.data.form.tags.value}
                                    placeholder={Localization.tags}
                                    onKeyDown={(e) => this.handle_tagsKeyDown(e)}
                                    onBlur={(e) => this.handle_tagsBlur(e)}
                                    inputValue={this.state.tags_inputValue}
                                    menuIsOpen={false}
                                    components={{
                                        DropdownIndicator: null,
                                    }}
                                    isClearable
                                    onInputChange={(inputVal) => this.setState({ ...this.state, tags_inputValue: inputVal })}
                                />
                            </div>
                        </div>
                        <div className="col-12">
                            <Input
                                label={Localization.rating_obj.write_comment}
                                defaultValue={this.state.data.form.comment.value}
                                onChange={(val, isValid) => { this.handleInputChange(val, isValid, 'comment') }}
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
                                        btnClassName="btn btn-success btn-sm mr-1 btn-circle"
                                        loading={this.state.actionBtn.create.loading}
                                        onClick={() => this.create()}
                                        disabled={this.state.actionBtn.create.disable}
                                    >
                                        {/* {Localization.create}&nbsp; */}
                                        <i className="fa fa-save"></i>
                                    </BtnLoader>
                                    : ''
                            }
                            {
                                this.state.actionBtn.update.visible ?
                                    <BtnLoader
                                        btnClassName="btn btn-primary-- btn-success btn-sm mr-1 btn-circle"
                                        loading={this.state.actionBtn.update.loading}
                                        onClick={() => this.update()}
                                        disabled={this.state.actionBtn.update.disable}
                                    >
                                        {/* {Localization.update}&nbsp; */}
                                        <i className="fa fa-edit-- fa-save"></i>
                                    </BtnLoader>
                                    : ''
                            }
                            {
                                this.state.actionBtn.remove.visible ?
                                    <BtnLoader
                                        btnClassName="btn btn-danger btn-sm btn-circle"
                                        loading={this.state.actionBtn.remove.loading}
                                        onClick={() => this.open_confirmNotify_remove()}
                                        disabled={this.state.actionBtn.remove.disable}
                                    >
                                        {/* {Localization.remove}&nbsp; */}
                                        <i className="fa fa-trash"></i>
                                    </BtnLoader>
                                    : ''
                            }
                            <div className="btn btn-primary pull-right d-none" onClick={() => this.goto_movie()}>
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
                <div className="rating-save-wrapper">
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
                </div>
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
