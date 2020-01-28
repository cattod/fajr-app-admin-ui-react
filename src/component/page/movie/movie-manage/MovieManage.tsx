import React, { Fragment } from 'react';
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

interface IState {
    gridData: IMovie[];
    gridLoader: boolean;
    widget_search_collapse: boolean;
    search: {
        movieTitle: string;
        ratedByUser: boolean | 'all';
    };
}
interface IProps {
    internationalization: TInternationalization;
    history: History;
}

class MovieManageComponent extends BaseComponent<IProps, IState> {
    state: IState = {
        gridData: [],
        gridLoader: true,
        widget_search_collapse: false,
        search: {
            movieTitle: '',
            ratedByUser: 'all',
        }
    };

    private _movieService = new MovieService();

    componentDidMount() {
        CmpUtility.gotoTop();
        this.fetchGridData();
    }

    async fetchGridData() {
        const res = await this._movieService.search(1000, 0, {}).catch(err => {
            this.handleError({ error: err.response, toastOptions: { toastId: 'fetchGridData_error' } });
        });

        if (res) {
            this.setState({ gridData: res.data.result, gridLoader: false });
        } else {
            this.setState({ gridLoader: false });
        }
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
            <div className="widget position-relative">
                <div className="widget-header bordered-bottom bordered-system bg-white">
                    <i className="widget-icon fa fa-search text-dark"></i>
                    <span className="widget-caption text-dark">{'کدام فیلم را ارزیابی می کنید؟'}</span>
                    <div className="widget-buttons">
                        <a className="cursor-pointer"
                            data-toggle="collapse"
                            onClick={() => this.toggleCollapse_widget_search()}
                        >
                            <i className={"fa text-orange " + (this.state.widget_search_collapse ? 'fa-plus' : 'fa-minus')}></i>
                        </a>
                    </div>
                </div>
                <div className={"widget-body " + (this.state.widget_search_collapse ? 'd-none' : '')}>
                    <div className="row">
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

                    <ContentLoader gutterClassName="gutter-0" show={this.state.gridLoader}></ContentLoader>
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
                    this.state.gridData.map((item) => {
                        const movie_img = (item.images && item.images.length !== 0) ? item.images[0] : '';
                        const visible = this.checkMovieVisibility(item);
                        if (!visible) return <Fragment key={item.id}></Fragment>;
                        return (
                            <div className="col mb-3 px-2" key={item.id}>
                                <div className={
                                    "card h-100 bg-light shadow-hover shadow-default cursor-pointer overflow-hidden "
                                    // + (item.rated_by_user ? 'bg-primary text-white' : 'bg-light')
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
