import { BaseService, IAPI_ResponseList, IAPI_Response } from './service.base';
import { IMovie } from '../model/model.movie';

export class MovieService extends BaseService {

    search(limit: number, skip: number, filter?: Object, sort?: Object): Promise<IAPI_ResponseList<IMovie>> {
        return this.axiosTokenInstance.post(`/movies/_search`, { limit, skip, filter, sort });
    }

    getById(movie_id: string): Promise<IAPI_Response<IMovie>> {
        return this.axiosTokenInstance.get(`/movies/${movie_id}`);
    }

}
