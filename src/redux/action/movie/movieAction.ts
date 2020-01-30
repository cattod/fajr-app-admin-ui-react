import { Action } from "redux";
import { EACTIONS } from "../../ActionEnum";
import { IMovie } from "../../../model/model.movie";

export interface IMovie_schema {
    list: Array<IMovie>
}

export interface IMovieAction extends Action<EACTIONS> {
    payload: IMovie_schema | null;
}