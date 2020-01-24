import { BaseModel } from "./model.base";

export interface IPerson extends BaseModel {
    name: string;
    last_name?: string;
    address?: string;
    phone: string;
    image?: string;
    email?: string;
    cell_no?: string;
    bio?: string;
}