import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { BaseComponent } from '../../../_base/BaseComponent';
import { TInternationalization } from '../../../../config/setup';
import { MovieService } from '../../../../service/service.movie';
import { IMovie } from '../../../../model/model.movie';
import { History } from "history";
import { CmpUtility } from '../../../_base/CmpUtility';
import { ContentLoader } from '../../../form/content-loader/ContentLoader';
import { Localization } from '../../../../config/localization/localization';
import { Input } from '../../../form/input/Input';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { IMovie_schema } from '../../../../redux/action/movie/movieAction';
import { action_update_Movie } from '../../../../redux/action/movie';
import { Store2 } from '../../../../redux/store';
import { Fab, Action } from 'react-tiny-fab';
import { ConfirmNotify } from '../../../form/confirm-notify/ConfirmNotify';
import { RatingService } from '../../../../service/service.rating';
import { AccessService } from '../../../../service/service.access';
import { PERMISSIONS } from '../../../../enum/Permission';

interface IState {
    // gridData: IMovie[];
    gridLoader: boolean;
    widget_search_collapse: boolean;
    search: {
        movieTitle: string;
        ratedByUser: boolean | 'all';
    };
    actionMode: boolean;
    confirmNotify_remove_show: boolean;
    confirmNotify_remove_loader: boolean;
}
interface IProps {
    internationalization: TInternationalization;
    history: History;
    movie: IMovie_schema;
}

class MovieManageComponent extends BaseComponent<IProps, IState> {
    state: IState = {
        // gridData: [],
        gridLoader: false,
        widget_search_collapse: false,
        search: {
            movieTitle: '',
            ratedByUser: 'all',
        },
        actionMode: false,
        confirmNotify_remove_show: false,
        confirmNotify_remove_loader: false,
    };

    private _movieService = new MovieService();
    private _ratingService = new RatingService();

    componentDidMount() {
        CmpUtility.gotoTop();
        this.fetchGridData();
    }

    async fetchGridData() {
        if (this.props.movie.list.length) {
            // this.setState({ gridData: this.props.movie.list }); // , gridLoader: false
        } else {
            this.setState({ gridLoader: true });
        }
        const res = await this._movieService.search(
            1000,
            0,
            {},
            ['order_filed+', 'creation_date-']
        ).catch(err => {
            this.handleError({ error: err.response, toastOptions: { toastId: 'fetchGridData_error' } });
        });

        if (res) {
            // this.setState({ gridData: res.data.result, gridLoader: false });
            Store2.dispatch(action_update_Movie({ ...this.props.movie, list: res.data.result }));
        }
        // else {
        //     this.setState({ gridLoader: false });
        // }

        this.setState({ gridLoader: false });
    }

    private goto_rating(movie_id: string): void {
        this.props.history.push(`/rating/save/${movie_id}`);
    }

    private toggleCollapse_widget_search() {
        this.setState({ widget_search_collapse: !this.state.widget_search_collapse });
    }

    private search_handleInputChange(value: string) {
        this.setState({ search: { ...this.state.search, movieTitle: value } });
    }

    private on_rateByUserType_changed(value: boolean | 'all') {
        this.setState({ search: { ...this.state.search, ratedByUser: value } });
    }

    widget_search_render() {
        return (<>
            <div className="widget radius-bordered position-relative">
                <div className="widget-header bordered-bottom-- bordered-system bg-white">
                    <i className="widget-icon fa fa-search text-dark"></i>
                    <span className="widget-caption text-dark">{'کدام فیلم را ارزیابی می کنید؟'}</span>
                    <div className="widget-buttons d-none">
                        <a className="cursor-pointer"
                            data-toggle="collapse"
                            onClick={() => this.toggleCollapse_widget_search()}
                        >
                            <i className={"fa text-orange " + (this.state.widget_search_collapse ? 'fa-plus' : 'fa-minus')}></i>
                        </a>
                    </div>
                </div>
                <div className={"widget-body " + (this.state.widget_search_collapse ? 'd-none' : '')}>
                    <div className="row mb-n3">
                        <div className="col-md-6">
                            <Input
                                label={Localization.movie_obj.title}
                                defaultValue={this.state.search.movieTitle}
                                onChange={(val) => { this.search_handleInputChange(val) }}
                                placeholder={Localization.movie_obj.title}
                            />
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>ارزیابی شما</label>
                                <div>
                                    <ToggleButtonGroup
                                        className="btn-group-sm-- d-flex"
                                        type="radio"
                                        name={`movie-rateByUser-type`}
                                        defaultValue={this.state.search.ratedByUser}
                                        value={this.state.search.ratedByUser}
                                        onChange={(val: boolean | 'all') => this.on_rateByUserType_changed(val)}
                                    >
                                        <ToggleButton
                                            className={`min-w-70px btn-system `}
                                            value={'all'}
                                        >{Localization.all}</ToggleButton>

                                        <ToggleButton
                                            className={
                                                `min-w-70px btn-danger `
                                            }
                                            value={true}
                                        >{Localization.movie_obj.rated_by_user_}</ToggleButton>

                                        <ToggleButton
                                            className={
                                                `min-w-70px btn-info `
                                            }
                                            value={false}
                                        >{Localization.movie_obj.not_rated_by_user_}</ToggleButton>
                                    </ToggleButtonGroup>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <ContentLoader gutterClassName="gutter-0" show={this.state.gridLoader}></ContentLoader> */}
                </div>
            </div>
        </>)
    }

    checkMovieVisibility(movie: IMovie): boolean {
        const movieTitleSearch = this.state.search.movieTitle;
        const ratedByUserType = this.state.search.ratedByUser;
        if (movieTitleSearch) {
            if (!movie.title.includes(movieTitleSearch)) return false;
        }
        if (ratedByUserType !== 'all') {
            if (movie.rated_by_user !== ratedByUserType) return false;
        }
        return true;
    }

    movie_list_render() {
        return (<>
            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 px-1">
                {
                    // this.state.gridData.map((item) => {
                    this.props.movie.list.map((item) => {
                        const movie_img = (item.images && item.images.length !== 0) ? item.images[0] : '';
                        const visible = this.checkMovieVisibility(item);
                        // if (!visible) return <Fragment key={item.id}></Fragment>;

                        const ac_movieUpdate = AccessService.checkAccess(PERMISSIONS.EDIT_MOVIE_PREMIUM);
                        const ac_movieRemove = AccessService.checkAccess(PERMISSIONS.DELETE_MOVIE_PREMIUM);

                        return (
                            <div className={"col mb-3 px-2 movie-item " + (visible ? '' : 'd-none')} key={item.id}>
                                {
                                    (!ac_movieUpdate && !ac_movieRemove) ? '' :
                                        <div className={"item-actions-wrapper " + (this.state.actionMode ? '' : 'd-none')}>
                                            <div className="item-actions">
                                                {ac_movieUpdate ? <div className="item-action" onClick={() => this.gotoEdit(item.id)}>
                                                    <i className="fa fa-edit fa-2x text-primary"></i>
                                                </div> : ''}
                                                {ac_movieRemove ? <div className="item-action" onClick={() => this.open_confirmNotify_remove(item)}>
                                                    <i className="fa fa-trash fa-2x text-danger"></i>
                                                </div> : ''}
                                            </div>
                                        </div>
                                }

                                <div className={
                                    "card h-100 bg-light shadow-hover shadow-default cursor-pointer overflow-hidden "
                                }
                                    onClick={() => this.goto_rating(item.id)}
                                >
                                    <img
                                        src={CmpUtility.getImageUrl(movie_img)}
                                        className="card-img-top" alt=""
                                        loading="lazy"
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title font-weight-bold">{item.title}</h5>
                                        <p className="card-text overflow-hidden max-h-70px">
                                            {/* {item.description} */}
                                            <span>{Localization.movie_obj.director}: </span>
                                            <span className="text-muted">{item.director}</span>
                                        </p>
                                    </div>

                                    {
                                        item.rated_by_user ?
                                            <div className="progress-complete">
                                                <div className="progress-complete-label">{Localization.movie_obj.rated_by_user_}</div>
                                            </div> : ''
                                    }
                                </div>
                            </div>
                        )
                    })
                }

            </div>

            <ContentLoader gutterClassName="gutter-0" show={this.state.gridLoader}></ContentLoader>
        </>)
    }

    fab_render() {
        const ac_movieReports = AccessService.checkAccess(PERMISSIONS.GET_MOVIE_PREMIUM);
        const ac_movieCreate = AccessService.checkAccess(PERMISSIONS.ADD_MOVIE_PREMIUM);
        const ac_movieUpdate = AccessService.checkAccess(PERMISSIONS.EDIT_MOVIE_PREMIUM);
        const ac_movieRemove = AccessService.checkAccess(PERMISSIONS.DELETE_MOVIE_PREMIUM);

        if (!ac_movieReports && !ac_movieCreate && !ac_movieUpdate && !ac_movieRemove) return <></>;

        return (
            <Fab
                icon={<i className="fa fa-gears"></i>}
                mainButtonStyles={{ backgroundColor: '#e74c3c' }}
                event='click'
                position={{
                    bottom: 0,
                    [this.props.internationalization.rtl ? 'left' : 'right']: 0
                }}
            >
                {ac_movieReports ? <Action
                    text="‌گزارش ارزیابی‌ها"
                    style={{ backgroundColor: '#01aaa4' }}
                    onClick={() => this.ratingsReport()}
                >
                    <i className="fa fa-bar-chart"></i>
                </Action> : <></>}
                {ac_movieCreate ? <Action
                    text="ایجاد فیلم جدید"
                    style={{ backgroundColor: '#40b292' }}
                    onClick={() => this.gotoCreate()}
                >
                    <i className="fa fa-plus"></i>
                </Action> : <></>}
                {(ac_movieUpdate || ac_movieRemove) ? <Action
                    text="اقدامات"
                    style={{ backgroundColor: this.state.actionMode ? '#232264' : '#2dc3e8' }}
                    onClick={() => this.toggleActionMode()}
                >
                    <i className="fa fa-film"></i>
                </Action> : <></>}
            </Fab>
        )
    }

    private async ratingsReport() {
        const res = await this._ratingService.movieReport().catch(err => {
            this.handleError({ error: err.response, toastOptions: { toastId: 'ratingsReport_error' } });
        });
        if (res) {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'report.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
    }

    private gotoCreate() {
        this.props.history.push(`/movie/create`);
    }

    private gotoEdit(id: string) {
        this.props.history.push(`/movie/update/${id}`);
    }

    private toggleActionMode() {
        this.setState({ actionMode: !this.state.actionMode });
    }

    private _selected_movie_toRemove: IMovie | undefined;
    private open_confirmNotify_remove(movie: IMovie) {
        this._selected_movie_toRemove = movie;
        this.setState({ confirmNotify_remove_show: true });
    }
    private close_confirmNotify_remove() {
        this.setState({ confirmNotify_remove_show: false });
    }
    private async confirmNotify_onConfirm_remove() {
        if (this._selected_movie_toRemove === undefined) return;
        this.setState({ confirmNotify_remove_loader: true });
        const res = await this._movieService.remove(this._selected_movie_toRemove.id).catch(err => {
            this.handleError({ error: err.response, toastOptions: { toastId: 'onConfirm_remove_error' } });
        });
        if (res) {
            this.apiSuccessNotify();
            const oldList = [...this.props.movie.list];
            if (oldList.length) {
                const index = oldList.findIndex(m => m.id === this._selected_movie_toRemove!.id);
                if (index !== -1) {
                    const newList = oldList.splice(index, 1);
                    Store2.dispatch(action_update_Movie({ ...this.props.movie, list: newList }));
                }
            }
            this._selected_movie_toRemove = undefined;

            this.setState({ confirmNotify_remove_show: false, confirmNotify_remove_loader: false });
        } else {
            this.setState({ confirmNotify_remove_loader: false });
        }
    }

    confirmNotify_render() {
        const movie = this._selected_movie_toRemove;
        let msg = Localization.msg.ui.movie_x_will_be_removed_continue;
        if (movie) {
            msg = Localization.formatString(
                Localization.msg.ui.movie_x_will_be_removed_continue, `"${movie.title}"`
            ) as string;
        }
        return (
            <ConfirmNotify
                show={this.state.confirmNotify_remove_show}
                onHide={() => this.close_confirmNotify_remove()}
                onConfirm={() => this.confirmNotify_onConfirm_remove()}
                msg={msg}
                confirmBtn_className='text-danger'
                confirmBtn_text={Localization.remove}
                closeBtn_text={Localization.cancel}
                btnLoader={this.state.confirmNotify_remove_loader}
            />
        )
    }

    render() {
        return (
            <>
                <div className="movie-manage-wrapper position-relative--">
                    <div className="row px-1">
                        <div className="col-12 px-2 widget-search-wrapper">
                            {this.widget_search_render()}
                        </div>
                    </div>

                    <div className="movie-list-wrapper position-relative">
                        {this.movie_list_render()}
                    </div>
                </div>

                {this.fab_render()}

                {this.confirmNotify_render()}

                <ToastContainer {...this.getNotifyContainerConfig()} />
            </>
        )
    }
}

//#region redux
const state2props = (state: redux_state) => {
    return {
        internationalization: state.internationalization,
        movie: state.movie,
    }
}

const dispatch2props = (dispatch: Dispatch) => {
    return {
    }
}

export const MovieManage = connect(state2props, dispatch2props)(MovieManageComponent);
//#endregion
