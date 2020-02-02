import { BaseModel } from "./model.base";
import { IPerson } from "./model.person";
import { PERMISSIONS } from "../enum/Permission";

export interface IUser extends BaseModel {
    name: string;
    avatar?: string;
    username: string;
    password?: string;
    // person_id: string;
    person: IPerson;
    permissions: Array<PERMISSIONS>;
    permission_groups: Array<string>; // Array of group_id
}
