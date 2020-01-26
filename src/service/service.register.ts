import { BaseService } from './service.base';

export class RegisterService extends BaseService {
    sendCode(data: { cell_no: string }): Promise<any> {//{ cell_no: string; message: string; }
        return this.axiosInstance.post('/register/send-code', data);
    }
    activateAcount(data: {
        "cell_no": string;
        "activation_code": string;
    }): Promise<any> {//IUser
        return this.axiosInstance.post('/register/activate-acount', data);
    }

    signUp(data: {
        "password": string;
        "username": string;
        "address"?: string;
        "email"?: string;
        "last_name"?: string;
        "name": string;
        "phone"?: string;
        "cell_no": string;
        "signup_token": string;
    }): any {
        return this.axiosInstance.post('/sign-up', data);
    }
}
