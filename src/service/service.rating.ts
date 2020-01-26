import { BaseService, IAPI_Response, IAPI_ResponseList } from './service.base';
import { IRating } from '../model/model.rating';

export class RatingService extends BaseService {

    search(limit: number, skip: number, filter?: Object): Promise<IAPI_ResponseList<IRating>> {
        return this.axiosTokenInstance.post(`/ratings/_search`, { limit, skip, filter });
    }

    getById(movie_id: string): Promise<IAPI_Response<IRating | {}>> {
        return this.axiosTokenInstance.get(`/ratings/${movie_id}`);
    }

    remove(rating_id: string): Promise<any> {
        return this.axiosTokenInstance.delete(`/ratings/${rating_id}`);
    }

    create(data: IRating) {
        return this.axiosTokenInstance.post(`/ratings`, data);
    }

    update(data: IRating, rating_id: string) {
        return this.axiosTokenInstance.put(`/ratings/${rating_id}`, data);
    }

}
