import { IPerson } from "../../model/model.person";
import { Store2 } from "../../redux/store";
import { action_change_app_flag } from "../../redux/action/internationalization";

export abstract class CmpUtility {
    static image_pre_url = '/api/serve-files';
    static defaultBookImagePath = "/static/media/img/icon/default-book.png";
    static brokenBookImagePath = "/static/media/img/icon/broken-book.png";
    static bookSizeImagePath = "/static/media/img/icon/book-size.png";
    static defaultAvatarImagePath = "/static/media/img/icon/avatar.png";
    static avatarSizeImagePath = "/static/media/img/icon/avatar.png";
    static brokenAvatarImagePath = "/static/media/img/icon/broken-avatar.png";

    static getImageUrl(imageId: string): string {
        return CmpUtility.image_pre_url + '/' + imageId;
    }

    static imageOnError(e: any, defaultImagePath: string) {
        if (e.target.src !== window.location.origin + defaultImagePath) {
            e.target.src = defaultImagePath;
        }
    }

    static bookImageOnError(e: any) {
        return CmpUtility.imageOnError(e, CmpUtility.brokenBookImagePath);
    }

    static personImageOnError(e: any) {
        return CmpUtility.imageOnError(e, CmpUtility.brokenAvatarImagePath);
    }

    static getPersonFullName(person: IPerson): string {
        let name = person.name || '';
        let last_name = person.last_name || '';
        name = name ? name + ' ' : '';
        return (name + last_name).trim();
    }

    static getPersonFullName_reverse_with_comma(person: IPerson, isPersian = false): string {
        let name = person.name || '';
        let last_name = person.last_name || '';
        if (last_name && name) {
            const comma = isPersian ? '،' : ',';
            last_name = last_name + comma + ' ';
        }
        return (last_name + name); // .trim();
    }

    

    static getPerson_avatar(person: IPerson): string {
        const img_path =
            (person.image && CmpUtility.getImageUrl(person.image))
            ||
            CmpUtility.defaultAvatarImagePath;
        return img_path;
    }

    

    

    static gotoTop() {
        window.scrollTo(0, 0);
    }

    

    static waitOnMe(timer: number = 500): Promise<boolean> {
        return new Promise((res, rej) => {
            setTimeout(function () {
                res(true);
            }, timer);
        });
    }

    /**
     * render all cmp with dispatch action_change_app_flag.
     */
    static refreshView() {
        const int = { ...Store2.getState().internationalization };
        Store2.dispatch(action_change_app_flag(int));
    }

    



}
