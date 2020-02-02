import { BaseService } from './service.base';
import { Store2 } from '../redux/store';
import { PERMISSIONS } from '../enum/Permission';

export class AccessService extends BaseService {

    static checkAccess(ac: PERMISSIONS): boolean {
        const user = Store2.getState().logged_in_user;
        if (!user) return false;
        return (user.permissions || []).includes(ac);
    };

    static checkListAccess(list: PERMISSIONS[]): { [key in PERMISSIONS]?: boolean } { // in keyof typeof PER...
        const user = Store2.getState().logged_in_user;
        if (list.length === 0 || !user) return {};

        const obj: { [key in PERMISSIONS]?: boolean } = {};
        const permissions = user.permissions || [];
        for (let i = 0; i < list.length; i++) {
            obj[list[i]] = permissions.includes(list[i]);
        }
        return obj;
    }

}
