import { EACTIONS } from "../../ActionEnum";
import { IMovie_schema, IMovieAction } from "../../action/movie/movieAction";

function get_reset_movie(): IMovie_schema {
    return {
        list: []
    }
}

export function reducer(state: IMovie_schema, action: IMovieAction): IMovie_schema {
    switch (action.type) {
        case EACTIONS.UPDATE_MOVIE:
            return action.payload as IMovie_schema;
        case EACTIONS.RESET_MOVIE:
            return get_reset_movie();
    }
    if (state) { return state; }
    return get_reset_movie();
}
