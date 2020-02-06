import { BaseModel } from "./model.base";

export interface IMovie extends BaseModel {
    description: string;
    director: string;
    genre: string[];
    images: string[];
    producer: string;
    pub_year: string;
    title: string;
    writer: string;
    rated_by_user: boolean;
    overall_rate?: number;
    order_filed: number;
}
