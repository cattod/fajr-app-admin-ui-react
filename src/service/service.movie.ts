import { BaseService, IAPI_ResponseList } from './service.base';
import { IMovie } from '../model/model.movie';

export class MovieService extends BaseService {

    search(limit: number, skip: number, filter?: Object): Promise<IAPI_ResponseList<IMovie>> {
        return this.axiosTokenInstance.post(`/movies/_search`, { limit, skip, filter });
    }

}
