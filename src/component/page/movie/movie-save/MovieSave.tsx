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
import { Localization } from '../../../../config/localization/localization';
import { BtnLoader } from '../../../form/btn-loader/BtnLoader';
// import { Utility } from '../../../../asset/script/utility';
import { IMovie } from '../../../../model/model.movie';
import { MovieService } from '../../../../service/service.movie';
import { ContentLoader } from '../../../form/content-loader/ContentLoader';
import { CmpUtility } from '../../../_base/CmpUtility';
// import Rating from 'react-rating';
// import { IUser } from '../../../../model/model.user';
import Select from 'react-select';

import { Utility } from '../../../../asset/script/utility';
import { Store2 } from '../../../../redux/store';
import { action_update_Movie } from '../../../../redux/action/movie';

interface IState {
    // formData: IRating | undefined;
    // confirmNotify_remove_show: boolean;
    // confirmNotify_remove_loader: boolean;
    // widget_info_collapse: boolean;
    actionBtn: {
        [key in 'remove' | 'create' | 'update']: {
            visible: boolean;
            disable: boolean;
            loading: boolean;
        };
    };
    data: {
        form: {
            description: { value: string | undefined; isValid: boolean; };
            director: { value: string | undefined; isValid: boolean; };
            genre: { value: { label: string, value: string }[]; isValid: boolean; };
            images: { value: string[]; isValid: boolean; };
            producer: { value: string | undefined; isValid: boolean; };
            pub_year: { value: string | undefined; isValid: boolean; };
            title: { value: string | undefined; isValid: boolean; };
            writer: { value: string | undefined; isValid: boolean; };
            order_filed: { value: number | undefined; isValid: boolean; };
        };
    };
    form_loader: boolean;
    tags_inputValue: string;
    isFormValid: boolean;
}
interface IProps {
    internationalization: TInternationalization;
    history: History;
    match: any;
    // logged_in_user: IUser | null;
}

class MovieSaveComponent extends BaseComponent<IProps, IState> {
    state: IState = {
        // formData: undefined,
        // confirmNotify_remove_show: false,
        // confirmNotify_remove_loader: false,
        // widget_info_collapse: false,
        actionBtn: {
            remove: { visible: false, disable: true, loading: false },
            create: { visible: false, disable: true, loading: false },
            update: { visible: false, disable: true, loading: false },
        },
        data: {
            // info: undefined,
            form: this.formDataObj(),
        },
        form_loader: false,
        tags_inputValue: '',
        isFormValid: false,
    };
    movieId: string | undefined;
    // ratingId: string | undefined;

    // private _ratingService = new RatingService();
    private _movieService = new MovieService();

    componentDidMount() {
        this.movieId = this.props.match.params.movieId;
        // if (!this.movieId) this.gotoManage();

        CmpUtility.gotoTop();
        // if (!this.movieId) return;
        this.fetchFormData();
    }

    formDataObj(data?: IMovie) {
        let genreVal: any = [];
        if (data && data.genre) {
            genreVal = data.genre.map(t => { return { label: t, value: t } });
        }
        const obj: any = {
            description: { value: data ? data.description : undefined, isValid: true },
            director: { value: data ? data.director : undefined, isValid: true },
            genre: { value: genreVal, isValid: true },
            images: { value: data ? data.images || [] : [], isValid: true },
            producer: { value: data ? data.producer : undefined, isValid: true },
            pub_year: { value: data ? data.pub_year : undefined, isValid: true },
            title: { value: data ? data.title : undefined, isValid: true },
            writer: { value: data ? data.writer : undefined, isValid: true },
            order_filed: { value: data ? data.order_filed : undefined, isValid: true },
        };
        return obj;
    }

    private async fetchFormData() {
        if (this.movieId === undefined) {
            this.setState({
                actionBtn: {
                    remove: { visible: false, disable: true, loading: false },
                    create: { visible: true, disable: true, loading: false },
                    update: { visible: false, disable: true, loading: false },
                },
            });
            return;
        }

        // const { /* persisted, */ rated } = this.fetchOfflineData();

        this.setState({ form_loader: true });

        const res = await this._movieService.getById(this.movieId)
            .catch(err => {
                this.handleError({ error: err.response, toastOptions: { toastId: 'fetchFormData_error' } });
            });

        if (res) {
            this.setState({
                data: { form: this.formDataObj(res.data) },
                actionBtn: {
                    remove: { visible: true, disable: false, loading: false },
                    create: { visible: false, disable: true, loading: false },
                    update: { visible: true, disable: false, loading: false },
                },
                form_loader: false
            });

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
                    data: { ...this.state.data },
                    form_loader: rated!
                });
            }
        }

        return { persisted, rated };
    }




    private getFormData(): IMovie {
        // const tags = (this.state.data.form.genre.value || []).map((item: { label: string; value: string }) => item.value);
        const data: any = {
            // movie_id: this.movieId,
            // comment: this.state.data.form.comment.value,
            // tags,

            // question_1: this.state.data.form.story.value,
            // question_2: this.state.data.form.form.value,
            // question_3: this.state.data.form.norm.value,
            // question_4: this.state.data.form.content.value,
        };
        return data;
    }

    private async create() {
        const data = this.getFormData();
        // if (!filledAny) {
        //     this.fillAnyNotify();
        //     return;
        // }
        this.setState({
            actionBtn: {
                ...this.state.actionBtn,
                create: { ...this.state.actionBtn.create, loading: true },
            }
        });
        const res = await this._movieService.create(data).catch(err => {
            this.handleError({ error: err.response, toastOptions: { toastId: 'create_error' } });
        });
        if (res) {
            // this.apiSuccessNotify();
            // this.ratingId = res.data.id;
            this.setState({
                actionBtn: {
                    remove: { visible: true, disable: false, loading: false },
                    create: { visible: false, disable: true, loading: false },
                    update: { visible: true, disable: false, loading: false },
                },
            });

            // this.offline_toggleMovieRate(true);

            setTimeout(() => {
                this.apiSuccessNotify();
            }, 300);
            this.gotoManage();
        }
    }

    private async update() {
        if (!this.movieId) return;
        const data = this.getFormData();
        // if (!filledAny) {
        //     this.fillAnyNotify();
        //     return;
        // }
        this.setState({
            actionBtn: {
                ...this.state.actionBtn,
                update: { ...this.state.actionBtn.update, loading: true },
            }
        });
        const res = await this._movieService.update(data, this.movieId).catch(err => {
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
            this.gotoManage();
        }
    }

    private gotoManage(): void {
        this.props.history.push(`/movie/manage`);
    }


    handleInputChange(value: any, isValid: boolean, inputType: 'title' | 'comment') {
        this.setState({
            data: {
                ...this.state.data,
                form: { ...this.state.data.form, [inputType]: { value, isValid } }
            },
            isFormValid: this.checkFormValidate(isValid, inputType)
        });
    }

    checkFormValidate(isValid: boolean, inputType: any): boolean {
        let valid = true;
        let formObj: any = { ...this.state.data.form };

        for (let i = 0; i < Object.keys(this.state.data.form).length; i++) {
            let IT = Object.keys(this.state.data.form)[i];
            if (IT !== inputType) {
                valid = valid && formObj[IT].isValid;
                if (!formObj[IT].isValid) {
                    break;
                }
            }
        }
        valid = valid && isValid;
        return valid;
    }

    private handleSelectInputChange(value: { label: string, value: string }[]) {
        this.setState({
            ...this.state,
            data: {
                ...this.state.data,
                form: {
                    ...this.state.data.form,
                    genre: {
                        isValid: true,
                        value: value || []
                    }
                }
            },
        })
    }
    private isDuplicateTag(tagVal: string): boolean {
        let isDup = false;
        for (let i = 0; i < this.state.data.form.genre.value.length; i++) {
            const c_tag = this.state.data.form.genre.value[i];
            if (c_tag.value === tagVal) {
                isDup = true;
                break;
            }
        }
        return isDup;
    }
    private handle_tagsKeyDown(event: any) {
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
                            genre: {
                                isValid: true,
                                value: [
                                    ...this.state.data.form.genre.value,
                                    { label: newVal, value: newVal }
                                ]
                            }
                        }
                    },
                    tags_inputValue: ''
                });
        }
    };
    private async handle_tagsBlur(event: any) {
        if (!this.state.tags_inputValue) return;
        const newVal = this.state.tags_inputValue;
        /* cmp react-select remove inputValue onBlur, so here we keep the inputValue & add it after 300 ms. */
        await Utility.waitOnMe(300);
        if (this.isDuplicateTag(newVal)) return;
        this.setState({
            ...this.state,
            data: {
                ...this.state.data,
                form: {
                    ...this.state.data.form,
                    genre: {
                        isValid: true,
                        value: [
                            ...this.state.data.form.genre.value,
                            { label: newVal, value: newVal }
                        ]
                    }
                }
            },
            tags_inputValue: ''
        });
    }


    widget_form_render() {
        return (<>
            <div className="widget radius-bordered position-relative">
                <div className="widget-header bordered-bottom-- bordered-system bg-white">
                    <span className="widget-caption text-dark">{
                        this.movieId ? Localization.movie_obj.crud.update
                            : Localization.movie_obj.crud.create
                    }</span>
                </div>
                <div className="widget-body">
                    <div className="row mb-4 mt-4">
                        <div className="col-12">
                            <Input
                                label={Localization.movie_obj.title}
                                defaultValue={this.state.data.form.title.value}
                                onChange={(val, isValid) => { this.handleInputChange(val, isValid, 'title') }}
                                placeholder={Localization.movie_obj.title}
                                // is_textarea
                                // textarea_rows={5}
                                required
                            />
                        </div>
                        <div className="col-12">
                            <div className="form-group">
                                <label>{Localization.movie_obj.genre}</label>
                                <Select
                                    isRtl={this.props.internationalization.rtl}
                                    isMulti
                                    onChange={(value: any) => this.handleSelectInputChange(value)}
                                    value={this.state.data.form.genre.value}
                                    placeholder={Localization.movie_obj.genre}
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
                    </div>

                    <div className="row mt-3">
                        <div className="col-12">
                            {
                                this.state.actionBtn.create.visible ?
                                    <BtnLoader
                                        btnClassName="btn btn-success btn-sm mr-1 btn-circle"
                                        loading={this.state.actionBtn.create.loading}
                                        onClick={() => this.create()}
                                        // disabled={this.state.actionBtn.create.disable}
                                        disabled={!this.state.isFormValid}
                                    >
                                        {/* {Localization.create}&nbsp; */}
                                        <i className="fa fa-save fa-2x"></i>
                                    </BtnLoader>
                                    : ''
                            }
                            {
                                this.state.actionBtn.update.visible ?
                                    <BtnLoader
                                        btnClassName="btn btn-primary btn-success-- btn-sm mr-1 btn-circle"
                                        loading={this.state.actionBtn.update.loading}
                                        onClick={() => this.update()}
                                        // disabled={this.state.actionBtn.update.disable}
                                        disabled={!this.state.isFormValid}
                                    >
                                        {/* {Localization.update}&nbsp; */}
                                        <i className="fa fa-edit fa-save-- fa-2x"></i>
                                    </BtnLoader>
                                    : ''
                            }
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
                <div className="movie-save-wrapper">
                    <div className="row">
                        <div className="col-12">
                            {this.widget_form_render()}
                        </div>
                    </div>

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

export const MovieSave = connect(state2props, dispatch2props)(MovieSaveComponent);
//#endregion
