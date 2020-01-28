import React from 'react';
import { redux_state } from '../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization, Setup } from '../../../config/setup';
import { History } from 'history';
import { Localization } from '../../../config/localization/localization';
import { NavLink } from 'react-router-dom';
import { RegisterService } from '../../../service/service.register';
import { FixNumber } from '../../form/fix-number/FixNumber';
import { AppRegex } from '../../../config/regex';
import { BtnLoader } from '../../form/btn-loader/BtnLoader';
import { Input } from '../../form/input/Input';
import { LoginService } from '../../../service/service.login';
import { Utility } from '../../../asset/script/utility';
import { IUser } from '../../../model/model.user';
import { IToken } from '../../../model/model.token';
import { action_user_logged_in } from '../../../redux/action/user';
import { action_set_token } from '../../../redux/action/token';
import { action_set_authentication } from '../../../redux/action/authentication';

enum REGISTER_STEP {
    submit_mobile = 'submit_mobile',
    validate_mobile = 'validate_mobile',
    register = 'register'
}

interface IState {
    registerStep: REGISTER_STEP;
    mobile: {
        value: string | undefined;
        isValid: boolean;
    };
    code: {
        value: string | undefined;
        isValid: boolean;
    };
    name: {
        value: string | undefined;
        isValid: boolean;
    };
    username: {
        value: string | undefined;
        isValid: boolean;
    };
    password: {
        value: string | undefined;
        isValid: boolean;
    };
    confirmPassword: {
        value: string | undefined;
        isValid: boolean;
    };
    isFormValid: boolean;
    btnLoader: boolean;
    sendAgain_counter: number;
    btnSendAgain_loader: boolean;
}
type TInputType = 'username' | 'password' | 'name' | 'code' | 'mobile' | 'confirmPassword';
interface IProps {
    history: History;
    internationalization: TInternationalization;
    onUserLoggedIn: (user: IUser) => void;
    onSetToken: (token: IToken) => void;
    onSetAuthentication: (auth: string) => void;
}

class RegisterComponent extends BaseComponent<IProps, IState> {
    state: IState = {
        registerStep: REGISTER_STEP.submit_mobile, // register
        mobile: {
            value: undefined,
            isValid: false,
        },
        code: {
            value: undefined,
            isValid: false,
        },
        name: {
            value: undefined,
            isValid: true, // false,
        },
        username: {
            value: undefined,
            isValid: false,
        },
        password: {
            value: undefined,
            isValid: false,
        },
        confirmPassword: {
            value: undefined,
            isValid: true, // false
        },
        isFormValid: false,
        btnLoader: false,
        sendAgain_counter: 0,
        btnSendAgain_loader: false,
    };

    private _registerService = new RegisterService();
    private signup_token!: string;
    private sendAgain_interval: any;

    componentDidMount() {
        document.title = Localization.register;
    }

    componentWillUnmount() {
        document.title = Localization[Setup.documentTitle];
    }

    gotoLogin() {
        this.props.history.push('/login');
    }
    handleInputChange(val: any, isValid: boolean, inputType: TInputType) {
        const isFormValid = this.validateForm(val, isValid, inputType);
        this.setState({ ...this.state, [inputType]: { value: val, isValid }, isFormValid });
    }
    validateForm(val: any, currentInput_isValid: boolean, inputType: TInputType): boolean {
        if (this.state.registerStep === REGISTER_STEP.submit_mobile) {
            if (inputType !== 'mobile') {
                // check env.dev
                throw new Error('should not happen !!!');
            }
            return currentInput_isValid;
        } else if (this.state.registerStep === REGISTER_STEP.validate_mobile) {
            if (inputType !== 'code') {
                // check env.dev
                throw new Error('should not happen !!!');
            }
            return currentInput_isValid;
        } else if (this.state.registerStep === REGISTER_STEP.register) {
            const registerStep_inputList: TInputType[] = ['confirmPassword', 'name', 'password', 'username'];
            const registerStep_inputList_exceptThisInput = registerStep_inputList.filter(inp => inp !== inputType);

            let regFormValidate = currentInput_isValid;
            registerStep_inputList_exceptThisInput.forEach(inp => {
                let inpObj: /* { value: string | undefined, isValid: boolean } */any = this.state[inp];
                regFormValidate = inpObj.isValid && regFormValidate;
            });

            /* if (inputType === 'password') {
                regFormValidate = (this.state.confirmPassword.value === val) && regFormValidate;
            } else if (inputType === 'confirmPassword') {
                regFormValidate = (this.state.password.value === val) && regFormValidate;
            } */

            return regFormValidate;
        } else {
            // todo check env.dev
            throw new Error('should not happen !!!');
        }
    }

    submit_mobile_render() {
        if (this.state.registerStep === REGISTER_STEP.submit_mobile) {
            return (
                <>
                    <div className="registerbox-caption">{Localization.register_your_mobile_number}</div>
                    <div className="registerbox-textbox pb-0">
                        <FixNumber
                            defaultValue={this.state.mobile.value}
                            onChange={(val, isValid) => { this.handleInputChange(val, isValid, 'mobile') }}
                            pattern={AppRegex.mobile}
                            patternError={Localization.validation.mobileFormat}
                            required
                            placeholder={Localization.mobile}
                            onKeyUp={(e) => this.handle_keyUp_onSubmit_mobile(e)}
                        />
                    </div>
                    <div className="registerbox-submit">
                        <BtnLoader
                            btnClassName="btn btn-primary pull-right text-uppercase"
                            loading={this.state.btnLoader}
                            onClick={() => this.onSubmit_mobile()}
                            disabled={!this.state.isFormValid}
                        >
                            {Localization.submit}
                        </BtnLoader>
                    </div>
                </>
            )
        }
    }
    async onSubmit_mobile() {
        if (!this.state.isFormValid) { return; }
        this.setState({ ...this.state, btnLoader: true });
        let res = await this._registerService.sendCode({ cell_no: this.state.mobile.value! })
            .catch(error => {
                this.handleError({ error: error.response, toastOptions: { toastId: 'onSubmit_mobile_error' } });
            });

        if (!res) {
            this.setState({ ...this.state, btnLoader: false });
            return;
        }

        let time = res.data.time;

        this.setState(
            {
                ...this.state,
                btnLoader: false,
                registerStep: REGISTER_STEP.validate_mobile,
                isFormValid: false,
                sendAgain_counter: time
            },
            () => {
                this.start_sendAgain_counter();
            }
        );
    }
    handle_keyUp_onSubmit_mobile(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            if (!this.state.isFormValid || this.state.btnLoader) return;
            this.onSubmit_mobile();
        }
    }
    async sendAgain() {
        this.setState({ ...this.state, btnSendAgain_loader: true });
        let res = await this._registerService.sendCode({ cell_no: this.state.mobile.value! })
            .catch(error => {
                this.handleError({ error: error.response, toastOptions: { toastId: 'sendAgain_error' } });
            });

        if (!res) {
            this.setState({ ...this.state, btnSendAgain_loader: false });
            return;
        }

        let time = res.data.time;

        this.setState(
            {
                ...this.state,
                btnSendAgain_loader: false,
                sendAgain_counter: time
            },
            () => {
                this.start_sendAgain_counter();
            }
        );
    }

    start_sendAgain_counter() {
        this.sendAgain_interval = setInterval(() => {
            if (this.state.sendAgain_counter === 0) {
                clearInterval(this.sendAgain_interval);
                return;
            }
            this.setState({ ...this.state, sendAgain_counter: this.state.sendAgain_counter - 1 });
        }, 1000);
    }

    validate_mobile_render() {
        if (this.state.registerStep === REGISTER_STEP.validate_mobile) {
            return (
                <>
                    <div className="registerbox-caption">{Localization.verification_code_sended_via_sms_submit_here}</div>

                    <div className="registerbox-textbox text-muted">
                        {Localization.mobile}: {this.state.mobile.value}
                        <small
                            className="text-info"
                            onClick={() => this.from_validate_mobile_to_Submit_mobile()}
                        >
                            <i className="fa fa-edit"></i>
                        </small>
                    </div>

                    <div className="registerbox-textbox pb-0">
                        <FixNumber
                            key={'register_code'}
                            defaultValue={this.state.code.value}
                            onChange={(val, isValid) => { this.handleInputChange(val, isValid, 'code') }}
                            placeholder={Localization.verification_code}
                            pattern={AppRegex.smsCode}
                            patternError={Localization.validation.smsCodeFormat}
                            required
                            onKeyUp={(e) => this.handle_keyUp_onValidate_mobile(e)}
                        />
                    </div>

                    <div className="registerbox-submit">
                        <BtnLoader
                            btnClassName="btn btn-primary pull-right text-uppercase"
                            loading={this.state.btnLoader}
                            onClick={() => this.onValidate_mobile()}
                            disabled={!this.state.isFormValid}
                        >
                            {Localization.submit}
                        </BtnLoader>

                        <BtnLoader
                            btnClassName="btn btn-link btn-sm p-align-0"
                            loading={this.state.btnSendAgain_loader}
                            onClick={() => this.sendAgain()}
                            disabled={this.state.sendAgain_counter > 0}
                        >
                            {Localization.send_again_activationCode}
                        </BtnLoader>
                        {
                            this.state.sendAgain_counter > 0 &&
                            <small>
                                <span>{Localization.in}</span>&nbsp;
                            <span>{this.state.sendAgain_counter}</span>&nbsp;
                            <span>{Localization.second}</span>
                            </small>
                        }
                    </div>
                </>
            )
        }
    }
    async onValidate_mobile() {
        if (!this.state.isFormValid) { return; }
        this.setState({ ...this.state, btnLoader: true });
        let response = await this._registerService.activateAcount(
            { cell_no: this.state.mobile.value!, activation_code: this.state.code.value! }
        ).catch(error => {
            this.handleError({ error: error.response, toastOptions: { toastId: 'onValidate_mobile_error' } });
        });
        this.setState({ ...this.state, btnLoader: false });
        if (!response) return;

        this.signup_token = response.data.signup_token;
        this.setState({
            ...this.state,
            registerStep: REGISTER_STEP.register, isFormValid: false,
            username: { value: this.state.mobile.value, isValid: true }
        });
    }
    handle_keyUp_onValidate_mobile(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            if (!this.state.isFormValid || this.state.btnLoader) return;
            this.onValidate_mobile();
        }
    }
    from_validate_mobile_to_Submit_mobile() {
        this.setState(
            {
                ...this.state,
                registerStep: REGISTER_STEP.submit_mobile,
                isFormValid: true, // note: we go back to last step and isFormValid is true there.
                code: { value: undefined, isValid: false }
            },
            // () => this.focusOnInput('inputElMobile')
        );
    }

    confirmPassword_validation(val: any): boolean {
        if (val === this.state.password.value) {
            return true
        }
        return false;
    }

    register_render() {
        if (this.state.registerStep === REGISTER_STEP.register) {
            return (
                <>
                    <div className="registerbox-caption">{Localization.create_an_account}</div>
                    <div className="registerbox-textbox d-none">
                        <Input
                            defaultValue={this.state.name.value}
                            onChange={(val, isValid) => { this.handleInputChange(val, isValid, 'name') }}
                            placeholder={Localization.name}
                            required
                            onKeyUp={(e) => this.handle_keyUp_onRegister(e)}
                            className="mb-0"
                        />
                    </div>
                    <hr className="wide d-none"></hr>
                    <div className="registerbox-textbox d-none">
                        <Input
                            defaultValue={this.state.username.value}
                            onChange={(val, isValid) => { this.handleInputChange(val, isValid, 'username') }}
                            placeholder={Localization.username}
                            required
                            onKeyUp={(e) => this.handle_keyUp_onRegister(e)}
                            className="mb-0"
                        />
                    </div>
                    <div className="registerbox-textbox pb-0">
                        <Input
                            defaultValue={this.state.password.value}
                            onChange={(val, isValid) => { this.handleInputChange(val, isValid, 'password') }}
                            placeholder={Localization.password}
                            required
                            type="password"
                            onKeyUp={(e) => this.handle_keyUp_onRegister(e)}
                            className="mb-0--"
                        />
                    </div>
                    <div className="registerbox-textbox pb-0 d-none">
                        <Input
                            defaultValue={this.state.confirmPassword.value}
                            onChange={(val, isValid) => { this.handleInputChange(val, isValid, 'confirmPassword') }}
                            placeholder={Localization.confirm_password}
                            required
                            type="password"
                            validationFunc={(val) => this.confirmPassword_validation(val)}
                            patternError={Localization.validation.confirmPassword}
                            onKeyUp={(e) => this.handle_keyUp_onRegister(e)}
                            className="mb-0--"
                        />
                    </div>

                    <div className="registerbox-submit">
                        <BtnLoader
                            btnClassName="btn btn-primary pull-right text-uppercase"
                            loading={this.state.btnLoader}
                            onClick={() => this.onRegister()}
                            disabled={!this.state.isFormValid}
                        >
                            {Localization.register}
                        </BtnLoader>
                    </div>
                </>
            )
        }
    }
    private _registered = false;
    async onRegister() {
        if (!this.state.isFormValid || this._registered) return;
        // debugger;
        this.setState({ ...this.state, btnLoader: true });
        const username = this.state.username.value!;
        const password = this.state.password.value!;
        let res = await this._registerService.signUp({
            "password": this.state.password.value!,
            "username": this.state.username.value!,
            "name": this.state.name.value!,
            "cell_no": this.state.mobile.value!,
            "signup_token": this.signup_token,
        }).catch((error: any) => {
            this.handleError({ error: error.response, toastOptions: { toastId: 'onRegister_error' } });
        });
        this.setState({ ...this.state, btnLoader: false });

        if (!res) return;

        this._registered = true;
        this.signUpNotify();
        this.login(username, password);
    }
    handle_keyUp_onRegister(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            if (!this.state.isFormValid || this.state.btnLoader) return;
            this.onRegister();
        }
    }

    signUpNotify() {
        return toast.success(
            Localization.msg.ui.registered_successful,
            this.getNotifyConfig({
                autoClose: Setup.notify.timeout.success,
                // onClose: this.onSignUpNotifyClosed.bind(this)
            })
        );
    }
    private onSignUpNotifyClosed() {
        this.props.history.push('/login');
    }

    private _loginService = new LoginService();
    async login(username: string, password: string) {
        // if (!this.state.isFormValid) { return; }
        // this.setState({ ...this.state, btnLoader: true });
        debugger;
        let authObj = { username: username, password: password };
        let res_token = await this._loginService.login(authObj).catch((error) => {
            this.handleError({ error: error.response, toastOptions: { toastId: 'login_error' } });
            // this.setState({ ...this.state, btnLoader: false });
        });

        let res_user;

        if (res_token) {
            this.props.onSetAuthentication(Utility.get_encode_auth(authObj));
            this.props.onSetToken(res_token.data);
            // this._loginService.setToken(res_token.data);

            res_user = await this._loginService.profile().catch((error) => {
                this.handleError({ error: error.response, toastOptions: { toastId: 'login_error' } });
            });
        }

        // this.setState({ ...this.state, btnLoader: false });

        if (res_user) {
            this.props.onUserLoggedIn(res_user.data);
            this.props.history.push('/dashboard');
        }
    }

    render() {
        return (
            <>
                <div className="register-container animated fadeInDown">
                    <div className="registerbox bg-white pb-3">
                        <div className="registerbox-title">{Localization.register}</div>

                        {(() => {
                            switch (this.state.registerStep) {
                                case REGISTER_STEP.submit_mobile:
                                    return this.submit_mobile_render();
                                case REGISTER_STEP.validate_mobile:
                                    return this.validate_mobile_render();
                                case REGISTER_STEP.register:
                                    return this.register_render();
                                default:
                                    return undefined;
                            }
                        })()}

                        <div className="clearfix"></div>
                        <div className="registerbox-textbox text-center">
                            <NavLink exact to="/login" className="text-muted">
                                {Localization.back_to_login}
                            </NavLink>
                        </div>
                    </div>

                    <div className="logobox text-center">
                        <img
                            src="/static/media/img/icon/catod-logo.svg"
                            className="max-w-100 max-h-100"
                            alt={Localization.catod_logo}
                            title={Localization.catod}
                        />
                    </div>
                </div>

                <ToastContainer {...this.getNotifyContainerConfig()} />
            </>
        )
    }
}

//#region redux
const state2props = (state: redux_state) => {
    return {
        internationalization: state.internationalization,
    }
}

const dispatch2props = (dispatch: Dispatch) => {
    return {
        onUserLoggedIn: (user: IUser) => dispatch(action_user_logged_in(user)),
        onSetToken: (token: IToken) => dispatch(action_set_token(token)),
        onSetAuthentication: (auth: string) => dispatch(action_set_authentication(auth))
    }
}

export const Register = connect(state2props, dispatch2props)(RegisterComponent);
//#endregion