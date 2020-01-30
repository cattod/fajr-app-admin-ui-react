import { EACTIONS } from "../../ActionEnum";
import { IMovieAction, IMovie_schema } from "./movieAction";

export function action_update_Movie(Movie: IMovie_schema): IMovieAction {
    return {
        type: EACTIONS.UPDATE_MOVIE,
        payload: Movie
    }
}

export function action_reset_Movie(): IMovieAction {
    return {
        type: EACTIONS.RESET_MOVIE,
        payload: null
    }
}