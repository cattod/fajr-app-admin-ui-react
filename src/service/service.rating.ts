import { BaseService, IAPI_Response, IAPI_ResponseList } from './service.base';
import { IRating } from '../model/model.rating';

export class RatingService extends BaseService {

    search(limit: number, skip: number, filter?: Object): Promise<IAPI_ResponseList<IRating>> {
        return this.axiosTokenInstance.post(`/ratings/_search`, { limit, skip, filter });
    }

    getById(ratingId: string): Promise<IAPI_Response<IRating | {}>> {
        return this.axiosTokenInstance.get(`/ratings/${ratingId}`);
    }

    getMovieRating(movieId: string): Promise<IAPI_Response<IRating | {}>> {
        return this.axiosTokenInstance.get(`/ratings/movie/${movieId}`);
    }

    remove(ratingId: string): Promise<any> {
        return this.axiosTokenInstance.delete(`/ratings/${ratingId}`);
    }

    create(data: IRating): Promise<IAPI_Response<IRating>> {
        return this.axiosTokenInstance.post(`/ratings`, data);
    }

    update(data: IRating, ratingId: string): Promise<IAPI_Response<IRating>> {
        return this.axiosTokenInstance.put(`/ratings/${ratingId}`, data);
    }

}
