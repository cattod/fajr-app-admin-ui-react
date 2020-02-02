import { BaseService, IAPI_ResponseList, IAPI_Response } from './service.base';
import { IMovie } from '../model/model.movie';

export class MovieService extends BaseService {

    search(limit: number, skip: number, filter?: Object, sort?: Object): Promise<IAPI_ResponseList<IMovie>> {
        return this.axiosTokenInstance.post(`/movies/_search`, { limit, skip, filter, sort });
    }

    getById(movieId: string): Promise<IAPI_Response<IMovie>> {
        return this.axiosTokenInstance.get(`/movies/${movieId}`);
    }

    remove(movieId: string): Promise<any> {
        return this.axiosTokenInstance.delete(`/movies/${movieId}`);
    }

    create(data: IMovie): Promise<IAPI_Response<IMovie>> {
        return this.axiosTokenInstance.post(`/movies`, data);
    }

    update(data: IMovie, movieId: string): Promise<IAPI_Response<IMovie>> {
        return this.axiosTokenInstance.put(`/movies/${movieId}`, data);
    }

}
