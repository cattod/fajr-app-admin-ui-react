import React, { Fragment } from "react";
import { MapDispatchToProps, connect } from "react-redux";
import { Dispatch } from "redux";
import { redux_state } from "../../../redux/app_state";
import { IUser } from "../../../model/model.user";
import { TInternationalization, Setup } from "../../../config/setup";
import { BaseComponent } from "../../_base/BaseComponent";
import { History } from "history";
import { ToastContainer } from "react-toastify";
import { NETWORK_STATUS } from "../../../enum/NetworkStatus";
import { action_user_logged_in } from "../../../redux/action/user";
import { Localization } from "../../../config/localization/localization";
import { ChangePassword } from "./change-password/ChangePassword";
import { UploadService } from "../../../service/service.upload";
import { PersonService } from "../../../service/service.person";
import { IPerson } from "../../../model/model.person";
import { Input } from "../../form/input/Input";
import { FixNumber } from "../../form/fix-number/FixNumber";
import { AppRegex } from "../../../config/regex";
import Dropzone from "react-dropzone";
import { CmpUtility } from "../../_base/CmpUtility";
import { BtnLoader } from "../../form/btn-loader/BtnLoader";

interface IProps {
  logged_in_user: IUser | null;
  internationalization: TInternationalization;
  history: History;
  network_status: NETWORK_STATUS;
  onUserLoggedIn: (user: IUser) => void;
}

interface IState {
  person: {
    name: {
      value: string | undefined;
      isValid: boolean;
    };
    last_name: {
      value: string | undefined;
      isValid: boolean;
    };
    address: {
      value: string | undefined,
      isValid: boolean
    };
    phone: {
      value: string | undefined,
      isValid: boolean
    };
    email: {
      value: string | undefined,
      isValid: boolean
    };
    cell_no: {
      value: string | undefined,
      isValid: boolean
    };
    image: {
      value: string[],
      isValid: boolean
    };
  };
  isFormValid: boolean;
  saveLoader: boolean;
  saveBtnVisibility: boolean;
  fetchPerson_loader: boolean;
  modal_change_password_show: boolean;
}

class ProfileComponent extends BaseComponent<IProps, IState> {
  state = {
    person: {
      name: {
        value: undefined,
        isValid: false,
      },
      last_name: {
        value: undefined,
        isValid: false,
      },
      address: {
        value: undefined,
        isValid: true,
      },
      phone: {
        value: undefined,
        isValid: true,
      },
      email: {
        value: undefined,
        isValid: true,
      },
      cell_no: {
        value: undefined,
        isValid: true,
      },
      image: {
        value: [],
        isValid: true,
      },
    },
    isFormValid: false,
    saveLoader: false,
    saveBtnVisibility: false,
    fetchPerson_loader: false,
    modal_change_password_show: false,
  };

  private _personService = new PersonService();
  private _uploadService = new UploadService();

  componentDidMount() {
    this.fetchPerson();
    // this.setOnReg();
  }

  // unregisterLeaveHook: any;
  // setOnReg() {
  //   const pp: any = this.props;
  //   console.log(pp, pp.router, pp.route);
  //   if (pp.router && pp.route)
  //     this.unregisterLeaveHook = pp.router.setRouteLeaveHook(
  //       pp.route, this.routerWillLeave.bind(this)
  //     );
  // }
  // routerWillLeave(nextLocation: any) {
  //   return false;
  // }
  // componentWillUnmount() {
  //   this.unregisterLeaveHook && this.unregisterLeaveHook();
  // }



  private async fetchPerson() {
    let current_person = this.props.logged_in_user!.person;

    this.setState({
      ...this.state, fetchPerson_loader: true,
      person: {
        name: { value: current_person.name, isValid: !!current_person.name },
        last_name: { value: current_person.last_name, isValid: !!current_person.last_name },
        address: { value: current_person.address, isValid: true },
        phone: { value: current_person.phone, isValid: true },
        image: { value: current_person.image ? [current_person.image] : [], isValid: true },
        email: { value: current_person.email, isValid: true },
        cell_no: { value: current_person.cell_no, isValid: !!current_person.cell_no },
      }
    });

    if (this.props.network_status === NETWORK_STATUS.OFFLINE) return;

    let res = await this._personService.byId(this.props.logged_in_user!.person.id).catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'fetchPerson_error' } });
      this.setState({ ...this.state, fetchPerson_loader: false });
    });

    if (res) {
      this.setState({
        ...this.state,
        fetchPerson_loader: false,
        saveBtnVisibility: true,
        person: {
          // ...this.state.person,
          name: { value: res.data.name, isValid: !!res.data.name },
          last_name: { value: res.data.last_name, isValid: !!res.data.last_name },
          address: { value: res.data.address, isValid: true },
          phone: { value: res.data.phone, isValid: true },
          image: { value: res.data.image ? [res.data.image] : [], isValid: true },
          email: { value: res.data.email, isValid: true },
          cell_no: { value: res.data.cell_no, isValid: !!res.data.cell_no },
        },
      });

      this.updateStoreData_profile(res.data);
    }
  }

  handleInputChange(value: any, isValid: boolean, inputType: any) {
    this.setState({
      ...this.state,
      person: {
        ...this.state.person, [inputType]: { value, isValid }
      }
      , isFormValid: this.checkFormValidate(isValid, inputType)
    })
  }

  checkFormValidate(isValid: boolean, inputType: any): boolean {
    let valid = true;
    let personObj: any = { ...this.state.person };

    for (let i = 0; i < Object.keys(this.state.person).length; i++) {
      let IT = Object.keys(this.state.person)[i];
      if (IT !== inputType) {
        valid = valid && personObj[IT].isValid;
        if (!personObj[IT].isValid) {
          break;
        }
      }
    }
    valid = valid && isValid;
    return valid;
  }

  async uploadFileReq(): Promise<string[]> {
    let fileImg = (this.state.person.image.value || []).filter(img => typeof img !== "string");
    let strImg = (this.state.person.image.value || []).filter(img => typeof img === "string");
    if (fileImg && (fileImg || []).length) {
      return new Promise(async (res, rej) => {
        let urls = await this._uploadService.upload(fileImg).catch(e => {
          rej(e);
        });
        if (urls) {
          res([...strImg, ...urls.data.result]);
        }
      });
    } else {
      return new Promise((res, rej) => {
        res(strImg || []);
      });
    }
  }

  async update() {
    if (!this.state.isFormValid) return;
    this.setState({ ...this.state, saveLoader: true });

    let imgUrls = await this.uploadFileReq().catch(error => {
      this.handleError({ error: error.response, toastOptions: { toastId: 'update_upload_error' } });
    });
    if (!imgUrls) {
      return
    }
    const newPerson = {
      name: this.state.person.name.value,
      last_name: this.state.person.last_name.value,
      address: this.state.person.address.value || '',
      phone: this.state.person.phone.value || '',
      image: imgUrls[0] || null, // '',
      email: this.state.person.email.value,
      // cell_no: this.state.person.cell_no.value,
    }
    let res = await this._personService.update(newPerson, this.props.logged_in_user!.person.id).catch(e => {
      this.handleError({ error: e.response, toastOptions: { toastId: 'update_update_error' } });
    });

    this.setState({ ...this.state, saveLoader: false });

    if (res) {
      this.updateStoreData_profile(res.data);
      this.apiSuccessNotify();
    }

  }

  updateStoreData_profile(person: IPerson) {
    let logged_in_user = { ...this.props.logged_in_user! };
    if (!logged_in_user || !person) return;

    logged_in_user.person.name = person.name;
    logged_in_user.person.last_name = person.last_name;
    logged_in_user.person.address = person.address;
    logged_in_user.person.phone = person.phone;
    logged_in_user.person.image = person.image;
    logged_in_user.person.email = person.email;

    this.props.onUserLoggedIn(logged_in_user);
  }

  //#region dropzone
  onDropRejected(files: any[], event: any) {
    this.onDropRejectedNotify(files);
  }

  onDropRejectedNotify(files: any[]) {
    const msg = Localization.formatString(Localization.msg.ui.profile_img_not_uploaded_max_size_n, '500KB');
    this.toastNotify(msg as string, { autoClose: Setup.notify.timeout.warning, toastId: 'file_could_not_be_uploaded' }, 'warn');
  }

  removePreviousImgNotify() {
    const msg = Localization.msg.ui.one_img_upload_allowed_remove_existing_one;
    this.toastNotify(msg, { autoClose: Setup.notify.timeout.warning, toastId: 'one_img_upload_allowed_remove_existing_one' }, 'warn');
  }

  onDrop(files: any[]) {
    if (!files || !files.length) return;
    if (this.state.person.image.value && this.state.person.image.value!.length) {
      this.removePreviousImgNotify();
      return;
    }
    this.setState({
      ...this.state, person: {
        ...this.state.person,
        image: {
          isValid: true,
          value: files
        }
      }
    })
  }

  private tmpUrl_list: string[] = [];

  getTmpUrl(file: any): string {
    const tmUrl = URL.createObjectURL(file);
    this.tmpUrl_list.push(tmUrl);
    return tmUrl;
  }

  removeItemFromDZ(index: number/* , url: string */) {
    let newFiles = (this.state.person.image.value || []);
    if (newFiles) {
      newFiles.splice(index, 1);
    }
    this.setState({
      ...this.state, person: {
        ...this.state.person,
        image: {
          isValid: true,
          value: [...newFiles]
        }
      }
    })
  }
  //#endregion

  profileHeader_render() {
    const avatarUrl = this.state.person.image.value[0] || CmpUtility.defaultAvatarImagePath;
    const fullname = CmpUtility.getPersonFullName(this.props.logged_in_user!.person);
    // fullname = fullname || username;
    const username = this.props.logged_in_user!.username;
    const cell = this.props.logged_in_user!.person.cell_no;

    return (
      <div className="profile-header row">
        <div className="col-lg-2 col-md-4 col-sm-12 text-center">
          {/* <img src="/static/media/img/icon/avatar.png" alt="" className="header-avatar" /> */}
          {/* <img
            className="header-avatar"
            src={avatarUrl}
            alt="avatar"
            onError={e => CmpUtility.personImageOnError(e)}
            loading="lazy"
          /> */}


          <Dropzone
            multiple={false}
            onDrop={(files) => this.onDrop(files)}
            // maxSize={1000000}
            maxSize={524288}
            accept="image/*"
            onDropRejected={(files, event) => this.onDropRejected(files, event)}
          >
            {
              (({ getRootProps, getInputProps }) => (
                <>
                  <div {...getRootProps({ className: 'dropzone' })}
                    className={
                      (this.state.person.image.value && this.state.person.image.value.length
                        ? 'd-none' : 'header-avatar')
                    }
                  >
                    <div className="center-el-in-box">{Localization.choose_image}</div>
                    <input {...getInputProps()} />
                  </div>
                  <div className={
                    "mt-3-- " +
                    (this.state.person.image.value && this.state.person.image.value.length
                      ? '' : 'd-none')
                  }>
                    {
                      (this.state.person.image.value || []).map((file: any, index) => {
                        let tmUrl = '';
                        if (typeof file === "string") {
                          tmUrl = '/api/serve-files/' + file;
                        } else {
                          tmUrl = this.getTmpUrl(file);
                        }
                        return <Fragment key={index}>
                          <button title={Localization.remove}
                            className="btn btn-outline-danger btn-xs btn-circle mr-2-- center-el-in-box align-1rem"
                            onClick={() => this.removeItemFromDZ(index/* , tmUrl */)}
                          >&times;</button>
                          <img className="header-avatar"
                            src={tmUrl}
                            alt=""
                            onError={e => CmpUtility.personImageOnError(e)}
                            loading="lazy"
                          />
                        </Fragment>
                      })
                    }
                  </div>
                </>
              ))
            }
          </Dropzone>



        </div>
        <div className="col-lg-10 col-md-8 col-sm-12 profile-info">
          <div className="header-fullname">{fullname}</div>
          <div className="btn btn-link ml-4" onClick={() => this.openModal_changePassword()}>
            <i className="fa fa-key mr-2"></i>
            {Localization.change_password}
          </div>
          <div className="header-information">
            {cell}
          </div>
        </div>
      </div>
    );
  }

  profileBody_render() {
    return (
      <div className="profile-body">
        <div className="col-12">
          <div className="tab-content tabs-flat">
            <div className="form-title text-capitalize">{Localization.profile_obj.personal_information}</div>
            <div className="row">
              <div className="col-sm-6">
                <Input
                  onChange={(value, isValid) => this.handleInputChange(value, isValid, "name")}
                  label={Localization.name}
                  placeholder={Localization.name}
                  defaultValue={this.state.person.name.value}
                  required
                />
              </div>
              <div className="col-sm-6">
                <Input
                  onChange={(value, isValid) => this.handleInputChange(value, isValid, 'last_name')}
                  label={Localization.lastname}
                  placeholder={Localization.lastname}
                  defaultValue={this.state.person.last_name.value}
                  required
                />
              </div>
            </div>
            <hr className="wide" />
            <div className="row">
              <div className="col-sm-6">
                <FixNumber
                  onChange={(value, isValid) => this.handleInputChange(value, isValid, 'email')}
                  label={Localization.email}
                  placeholder={Localization.email}
                  defaultValue={this.state.person.email.value}
                  pattern={AppRegex.email}
                  patternError={Localization.validation.emailFormat}
                />
              </div>
              <div className="col-sm-6">
                <FixNumber
                  onChange={(value, isValid) => this.handleInputChange(value, isValid, "phone")}
                  label={Localization.phone}
                  placeholder={Localization.phone}
                  defaultValue={this.state.person.phone.value}
                  pattern={AppRegex.phone}
                  patternError={Localization.validation.phoneFormat}
                />
              </div>
            </div>
            <div className="form-title text-capitalize">{Localization.profile_obj.contact_information}</div>
            <div className="row">
              <div className="col-12">
                <Input
                  onChange={(value, isValid) => this.handleInputChange(value, isValid, "address")}
                  label={Localization.address}
                  placeholder={Localization.address}
                  is_textarea
                  defaultValue={this.state.person.address.value}
                  textarea_rows={2}
                />
              </div>
              
            </div>
            {
              this.state.saveBtnVisibility ?
                <div className="row mt-2">
                  <div className="col-12">
                    <BtnLoader
                      btnClassName="btn btn-primary text-capitalize"
                      loading={this.state.saveLoader}
                      onClick={() => this.update()}
                      disabled={!this.state.isFormValid || this.props.network_status === NETWORK_STATUS.OFFLINE}
                    >
                      {Localization.profile_obj.crud.save}
                      {
                        this.props.network_status === NETWORK_STATUS.OFFLINE
                          ? <i className="fa fa-wifi text-danger"></i> : ''
                      }
                    </BtnLoader>
                  </div>
                </div>
                : ''
            }
          </div>
        </div>
      </div>
    )
  }

  private openModal_changePassword() {
    this.setState({ modal_change_password_show: true });
  }
  private closeModal_changePassword() {
    this.setState({ modal_change_password_show: false });
  }

  render() {
    return (
      <>
        <div className="row">
          <div className="col-12">
            <div className="profile-container">
              {this.profileHeader_render()}
              {this.profileBody_render()}
            </div>
          </div>
        </div>

        <ToastContainer {...this.getNotifyContainerConfig()} />

        <ChangePassword
          show={this.state.modal_change_password_show}
          onHide={() => this.closeModal_changePassword()}
        />
      </>
    );
  }
}

const dispatch2props: MapDispatchToProps<{}, {}> = (dispatch: Dispatch) => {
  return {
    onUserLoggedIn: (user: IUser) => dispatch(action_user_logged_in(user)),
  };
};

const state2props = (state: redux_state) => {
  return {
    logged_in_user: state.logged_in_user,
    internationalization: state.internationalization,
    network_status: state.network_status,
  };
};

export const Profile = connect(state2props, dispatch2props)(ProfileComponent);
