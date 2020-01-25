import { BaseService, IAPI_Response } from './service.base';
import { IRating } from '../model/model.rating';

export class RatingService extends BaseService {

    getById(movie_id: string): Promise<IAPI_Response<IRating>> {
        return this.axiosTokenInstance.get(`/rating/${movie_id}`);
    }

}
