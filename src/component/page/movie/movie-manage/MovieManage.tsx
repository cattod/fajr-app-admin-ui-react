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

interface IState {
    gridData: IMovie[];
    gridLoader: boolean;
}
interface IProps {
    internationalization: TInternationalization;
    history: History;
}

class MovieManageComponent extends BaseComponent<IProps, IState> {
    state: IState = {
        gridData: [],
        gridLoader: true,
    };

    private _movieService = new MovieService();

    componentDidMount() {
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

    render() {
        return (
            <>
                <div className="position-relative">
                    <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5">
                        {
                            this.state.gridData.map((item) => {
                                const movie_img = (item.images && item.images.length !== 0) ? item.images[0] : '';
                                return (
                                    <div className="col mb-4" key={item.id}>
                                        <div className={
                                            "card h-100 bg-light-- shadow-hover shadow-default cursor-pointer " +
                                            (item.rated_by_user ? 'bg-primary text-white' : 'bg-light')
                                        }
                                            onClick={() => this.goto_rating(item.id)}
                                        >
                                            <img src={CmpUtility.getImageUrl(movie_img)} className="card-img-top" alt="..." />
                                            <div className="card-body">
                                                <h5 className="card-title">{item.title}</h5>
                                                <p className="card-text overflow-hidden max-h-70px">{item.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }

                    </div>

                    <ContentLoader gutterClassName="gutter-0" show={this.state.gridLoader}></ContentLoader>
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
