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

interface IState {
    gridData: IMovie[];
}
interface IProps {
    internationalization: TInternationalization;
    history: History;
}

class MovieManageComponent extends BaseComponent<IProps, IState> {
    state: IState = {
        gridData: [],
    };

    private _movieService = new MovieService();

    componentDidMount() {
        this.fetchGridData();
    }

    async fetchGridData() {
        const res = await this._movieService.search(10, 0, {}).catch(err => {
            this.handleError({ error: err.response, toastOptions: { toastId: 'fetchGridData_error' } });
        });
        debugger;

        if (res) {
            this.setState({ gridData: res.data.result });
        }
    }

    private goto_rating(movie_id: string): void {
        this.props.history.push(`/rating/save/${movie_id}`);
    }

    render() {
        return (
            <>
                <div className="card-columns">
                    <div className="card">
                        <img src="/static/media/img/sample-movie/movie-1.jpg" className="card-img-top" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title">Card title that wraps to a new line</h5>
                            <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                        </div>
                    </div>
                    <div className="card p-3">
                        <blockquote className="blockquote mb-0 card-body">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                            <footer className="blockquote-footer">
                                <small className="text-muted">
                                    Someone famous in <cite title="Source Title">Source Title</cite>
                                </small>
                            </footer>
                        </blockquote>
                    </div>
                    <div className="card">
                        <img src="/static/media/img/sample-movie/movie-1.jpg" className="card-img-top" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title">Card title</h5>
                            <p className="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
                            <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                        </div>
                    </div>
                    <div className="card bg-primary text-white text-center p-3">
                        <blockquote className="blockquote mb-0">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat.</p>
                            <footer className="blockquote-footer text-white">
                                <small>
                                    Someone famous in <cite title="Source Title">Source Title</cite>
                                </small>
                            </footer>
                        </blockquote>
                    </div>
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title">Card title</h5>
                            <p className="card-text">This card has a regular title and short paragraphy of text below it.</p>
                            <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                        </div>
                    </div>
                    <div className="card">
                        <img src="/static/media/img/sample-movie/movie-1.jpg" className="card-img-top" alt="..." />
                    </div>
                    <div className="card p-3 text-right">
                        <blockquote className="blockquote mb-0">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                            <footer className="blockquote-footer">
                                <small className="text-muted">
                                    Someone famous in <cite title="Source Title">Source Title</cite>
                                </small>
                            </footer>
                        </blockquote>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Card title</h5>
                            <p className="card-text">This is another card with title and supporting text below. This card has some additional content to make it slightly taller overall.</p>
                            <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                        </div>
                    </div>
                </div>


                <br /><br /><br /><br /><br /><br /><br />


                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4">
                    <div className="col mb-4">
                        <div className="card h-100 bg-light shadow-hover shadow-default cursor-pointer"
                            onClick={() => this.goto_rating('555')}
                        >
                            <img src="/static/media/img/sample-movie/movie-1.jpg" className="card-img-top" alt="..." />
                            <div className="card-body">
                                <h5 className="card-title">{'عامه پسند'}</h5>
                                <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-4">
                        <div className="card h-100 bg-light shadow-hover shadow-default">
                            <img src="/static/media/img/sample-movie/movie-2.jpg" className="card-img-top" alt="..." />
                            <div className="card-body">
                                <h5 className="card-title">{'روز صفر'}</h5>
                                <p className="card-text">This is a short card.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-4">
                        <div className="card h-100 bg-light shadow-hover shadow-default">
                            <img src="/static/media/img/sample-movie/movie-3.jpg" className="card-img-top" alt="..." />
                            <div className="card-body">
                                <h5 className="card-title">{'خوب، بد، جلف 2 ارتش سری'}</h5>
                                <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-4">
                        <div className="card h-100 bg-light shadow-hover shadow-default">
                            <img src="/static/media/img/sample-movie/movie-4.jpg" className="card-img-top" alt="..." />
                            <div className="card-body">
                                <h5 className="card-title">{'ابر بارانش گرفته'}</h5>
                                <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
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

export const MovieManage = connect(state2props, dispatch2props)(MovieManageComponent);
//#endregion
