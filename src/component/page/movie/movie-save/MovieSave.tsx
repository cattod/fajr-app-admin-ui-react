import React, { Fragment } from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { BaseComponent } from '../../../_base/BaseComponent';
import { TInternationalization, Setup } from '../../../../config/setup';
import { Input } from '../../../form/input/Input';
import { History } from "history";
import { Localization } from '../../../../config/localization/localization';
import { BtnLoader } from '../../../form/btn-loader/BtnLoader';
import { IMovie } from '../../../../model/model.movie';
import { MovieService } from '../../../../service/service.movie';
import { ContentLoader } from '../../../form/content-loader/ContentLoader';
import { CmpUtility } from '../../../_base/CmpUtility';
import Select from 'react-select';
import { Utility } from '../../../../asset/script/utility';
import { Store2 } from '../../../../redux/store';
import { action_update_Movie } from '../../../../redux/action/movie';
import { FixNumber } from '../../../form/fix-number/FixNumber';
import { AppRegex } from '../../../../config/regex';
import { UploadService } from '../../../../service/service.upload';
import Dropzone from "react-dropzone";

interface IState {
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
            order_filed: { value: string | undefined; isValid: boolean; };
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

type TInputType = 'title' | 'director' | 'description' | 'producer' | 'pub_year' | 'writer' | 'order_filed';

class MovieSaveComponent extends BaseComponent<IProps, IState> {
    state: IState = {
        actionBtn: {
            remove: { visible: false, disable: true, loading: false },
            create: { visible: false, disable: true, loading: false },
            update: { visible: false, disable: true, loading: false },
        },
        data: {
            form: this.formDataObj(),
        },
        form_loader: false,
        tags_inputValue: '',
        isFormValid: false,
    };
    movieId: string | undefined;

    private _movieService = new MovieService();
    private _uploadService = new UploadService();

    componentDidMount() {
        this.movieId = this.props.match.params.movieId;

        CmpUtility.gotoTop();
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

    private persistedMovie_update(movie: IMovie): void {
        const PM = Store2.getState().movie;
        const persisted_movie_list = [...PM.list];
        if (persisted_movie_list.length) {
            for (let i = 0; i < persisted_movie_list.length; i++) {
                const m = persisted_movie_list[i];
                if (m.id === movie.id) {
                    persisted_movie_list[i] = movie;
                    Store2.dispatch(action_update_Movie({ ...PM, list: persisted_movie_list }));
                    break;
                }
            }
        }
    }

    private persistedMovie_add(movie: IMovie): void {
        const PM = Store2.getState().movie;
        const persisted_movie_list = [...PM.list];
        if (persisted_movie_list.length) {
            persisted_movie_list.push(movie);
            Store2.dispatch(action_update_Movie({ ...PM, list: persisted_movie_list }));
        }
    }


    private getFormData(): IMovie {
        const genre = (this.state.data.form.genre.value || []).map(
            (item: { label: string; value: string }) => item.value
        );
        const order_filed = this.state.data.form.order_filed.value ?
            parseInt(this.state.data.form.order_filed.value) : undefined;
        const data: any = {
            description: this.state.data.form.description.value,
            genre,
            director: this.state.data.form.director.value,
            producer: this.state.data.form.producer.value,
            pub_year: this.state.data.form.pub_year.value,
            title: this.state.data.form.title.value,
            writer: this.state.data.form.writer.value,
            order_filed,
        };
        return data;
    }

    private async create() {
        // debugger;
        const formData = this.getFormData();
        this.setState({
            actionBtn: {
                ...this.state.actionBtn,
                create: { ...this.state.actionBtn.create, loading: true },
            }
        });

        let imgUrls = await this.uploadFileReq().catch(error => {
            this.handleError({ error: error.response, toastOptions: { toastId: 'create_upload_error' } });
        });
        if (!imgUrls || !imgUrls.length) {
            this.setState({
                actionBtn: {
                    ...this.state.actionBtn,
                    create: { ...this.state.actionBtn.create, loading: false },
                }
            });
            return
        }
        formData.images = imgUrls;

        const res = await this._movieService.create(formData).catch(err => {
            this.handleError({ error: err.response, toastOptions: { toastId: 'create_error' } });
        });

        if (res) {
            // this.apiSuccessNotify();

            this.setState({
                actionBtn: {
                    remove: { visible: true, disable: false, loading: false },
                    create: { visible: false, disable: true, loading: false },
                    update: { visible: true, disable: false, loading: false },
                },
            });

            this.persistedMovie_add(res.data);

            setTimeout(() => {
                this.apiSuccessNotify();
            }, 300);
            this.gotoManage();
        }
    }

    private async update() {
        // debugger;
        if (!this.movieId) return;
        const formData = this.getFormData();
        this.setState({
            actionBtn: {
                ...this.state.actionBtn,
                update: { ...this.state.actionBtn.update, loading: true },
            }
        });

        let imgUrls = await this.uploadFileReq().catch(error => {
            this.handleError({ error: error.response, toastOptions: { toastId: 'update_upload_error' } });
        });
        if (!imgUrls || !imgUrls.length) {
            this.setState({
                actionBtn: {
                    ...this.state.actionBtn,
                    update: { ...this.state.actionBtn.update, loading: false },
                }
            });
            return
        }
        formData.images = imgUrls;

        const res = await this._movieService.update(formData, this.movieId).catch(err => {
            this.handleError({ error: err.response, toastOptions: { toastId: 'update_error' } });
        });

        this.setState({
            actionBtn: {
                ...this.state.actionBtn,
                update: { ...this.state.actionBtn.update, loading: false },
            }
        });

        if (res) {
            this.persistedMovie_update(res.data);

            setTimeout(() => {
                this.apiSuccessNotify();
            }, 300);
            this.gotoManage();
        }
    }

    private gotoManage(): void {
        this.props.history.push(`/movie/manage`);
    }

    handleInputChange(value: any, isValid: boolean, inputType: TInputType) {
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

    private async uploadFileReq(): Promise<string[]> {
        let fileImg = (this.state.data.form.images.value || []).filter(img => typeof img !== "string");
        let strImg = (this.state.data.form.images.value || []).filter(img => typeof img === "string");
        if (fileImg && (fileImg || []).length) {
            return new Promise(async (res, rej) => {
                let urls = await this._uploadService.upload(fileImg).catch(e => {
                    rej(e);
                });
                if (urls) {
                    res([...strImg, ...urls.data.result]);
                }
            });
        } else {
            return new Promise((res, rej) => {
                res(strImg || []);
            });
        }
    }
    //#region dropzone
    private onDropRejected(files: any[], event: any) {
        this.onDropRejectedNotify(files);
    }

    private onDropRejectedNotify(files: any[]) {
        const msg = Localization.formatString(Localization.msg.ui.profile_img_not_uploaded_max_size_n, '500KB');
        this.toastNotify(msg as string, { autoClose: Setup.notify.timeout.warning, toastId: 'file_could_not_be_uploaded' }, 'warn');
    }

    private removePreviousImgNotify() {
        const msg = Localization.msg.ui.one_img_upload_allowed_remove_existing_one;
        this.toastNotify(msg, { autoClose: Setup.notify.timeout.warning, toastId: 'one_img_upload_allowed_remove_existing_one' }, 'warn');
    }

    private onDrop(files: any[]) {
        if (!files || !files.length) return;
        if (this.state.data.form.images.value && this.state.data.form.images.value!.length) {
            this.removePreviousImgNotify();
            return;
        }
        this.setState({
            data: {
                ...this.state.data,
                form: { ...this.state.data.form, images: { value: files, isValid: true } }
            },
            isFormValid: this.checkFormValidate(true, 'images')
        });
    }

    private tmpUrl_list: string[] = [];

    private getTmpUrl(file: any): string {
        const tmUrl = URL.createObjectURL(file);
        this.tmpUrl_list.push(tmUrl);
        return tmUrl;
    }

    private removeItemFromDZ(index: number/* , url: string */) {
        let newFiles = (this.state.data.form.images.value || []);
        if (newFiles && newFiles.length) {
            newFiles.splice(index, 1);
        }
        const isValid = (newFiles && newFiles.length) ? true : false;
        this.setState({
            data: {
                ...this.state.data,
                form: { ...this.state.data.form, images: { value: [...newFiles], isValid: isValid } }
            },
            isFormValid: this.checkFormValidate(isValid, 'images')
        });
    }
    //#endregion

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
                    <div className="row mb-4 mt-1">
                        <div className="col-lg-4 col-md-6">
                            <Input
                                label={Localization.movie_obj.title}
                                defaultValue={this.state.data.form.title.value}
                                onChange={(val, isValid) => { this.handleInputChange(val, isValid, 'title') }}
                                placeholder={Localization.movie_obj.title}
                                required
                            />
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <Input
                                label={Localization.movie_obj.director}
                                defaultValue={this.state.data.form.director.value}
                                onChange={(val, isValid) => { this.handleInputChange(val, isValid, 'director') }}
                                placeholder={Localization.movie_obj.director}
                                required
                            />
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <Input
                                label={Localization.movie_obj.producer}
                                defaultValue={this.state.data.form.producer.value}
                                onChange={(val, isValid) => { this.handleInputChange(val, isValid, 'producer') }}
                                placeholder={Localization.movie_obj.producer}
                            />
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <Input
                                label={Localization.movie_obj.pub_year}
                                defaultValue={this.state.data.form.pub_year.value}
                                onChange={(val, isValid) => { this.handleInputChange(val, isValid, 'pub_year') }}
                                placeholder={Localization.movie_obj.pub_year}
                            />
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <Input
                                label={Localization.movie_obj.writer}
                                defaultValue={this.state.data.form.writer.value}
                                onChange={(val, isValid) => { this.handleInputChange(val, isValid, 'writer') }}
                                placeholder={Localization.movie_obj.writer}
                            />
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <FixNumber
                                label={Localization.movie_obj.order_filed}
                                defaultValue={this.state.data.form.order_filed.value}
                                onChange={(val, isValid) => { this.handleInputChange(val, isValid, 'order_filed') }}
                                placeholder={Localization.movie_obj.order_filed}
                                pattern={AppRegex.integer}
                                patternError={Localization.validation.integerFormat}
                            />
                        </div>
                        <div className="col-12">
                            <Input
                                label={Localization.movie_obj.description}
                                defaultValue={this.state.data.form.description.value}
                                onChange={(val, isValid) => { this.handleInputChange(val, isValid, 'description') }}
                                placeholder={Localization.movie_obj.description}
                                is_textarea
                                textarea_rows={5}
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

                        <div className="col-lg-4 col-md-6">
                            <div className="app-dropzone">
                                <label>
                                    {Localization.movie_obj.images}
                                    <span className="text-danger">*</span>
                                </label>
                                <div className="dropzone-container rounded py-3">
                                    <Dropzone
                                        multiple={false}
                                        onDrop={(files) => this.onDrop(files)}
                                        // maxSize={1000000}
                                        maxSize={524288}
                                        accept="image/*"
                                        onDropRejected={(files, event) => this.onDropRejected(files, event)}
                                    >
                                        {
                                            (({ getRootProps, getInputProps }) => (
                                                <section className="px-3">
                                                    <div {...getRootProps({ className: 'dropzone' })}
                                                        className={
                                                            (this.state.data.form.images.value && this.state.data.form.images.value.length
                                                                ? 'd-none' : '')
                                                        }
                                                    >
                                                        <input {...getInputProps()} />
                                                        <p
                                                            className="drag-drop-section text-center text-muted p-3 mt-3-- mb-0 cursor-pointer rounded"
                                                        >{Localization.choose_image}</p>
                                                    </div>
                                                    <aside className={
                                                        "mt-3-- " +
                                                        (this.state.data.form.images.value && this.state.data.form.images.value.length
                                                            ? '' : 'd-none')
                                                    }>
                                                        {/* <h5 className="m-2">{Localization.preview}:</h5> */}
                                                        <div className="file-wrapper px-2 pt-2 pb-0 rounded">{
                                                            (this.state.data.form.images.value || []).map((file: any, index) => {
                                                                let tmUrl = '';
                                                                let fileName = '';
                                                                let fileSize = '';
                                                                if (typeof file === "string") {
                                                                    // fileName = file;
                                                                    tmUrl = '/api/serve-files/' + file;
                                                                } else {
                                                                    fileName = file.name;
                                                                    fileSize = '- ' + parseFloat((file.size / 1024).toFixed(2)) + ' KB';
                                                                    tmUrl = this.getTmpUrl(file);
                                                                }
                                                                return <Fragment key={index}>
                                                                    <div className="file-item-row justify-content-center mb-2">
                                                                        <button title={Localization.remove}
                                                                            className="remove-file-btn-- btn btn-outline-danger btn-xs btn-circle mr-2"
                                                                            onClick={() => this.removeItemFromDZ(index/* , tmUrl */)}
                                                                        >&times;</button>
                                                                        <div className="file-preview circle--">
                                                                            <img className="w-100px-- w-200px h-100px--"
                                                                                src={tmUrl}
                                                                                alt=""
                                                                            // onError={e => this.personImageOnError(e)}
                                                                            />
                                                                        </div>
                                                                        <span className="ml-2 phone-text">{fileName} {fileSize}</span>
                                                                    </div>
                                                                </Fragment>
                                                            })
                                                        }</div>
                                                    </aside>
                                                </section>
                                            ))
                                        }
                                    </Dropzone>
                                </div>
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
                                        <i className="fa fa-save"></i>
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
                                        <i className="fa fa-edit fa-save--"></i>
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
                <div className="movie-save-wrapper animated fadeInDown">
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
