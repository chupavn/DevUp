import { autoinject, computedFrom } from "aurelia-framework";
import {
  ValidationRules,
  ValidationControllerFactory,
  ValidationController,
} from "aurelia-validation";
import { connectTo } from "aurelia-store";
import * as toastr from "toastr";
import { State } from "../../store/state";
import { dispatchify, Store } from "aurelia-store";
import { UploadService } from "services/upload-service";
import { UserService } from "services/user-service";
import { HttpClient } from "aurelia-http-client";
import * as _ from "lodash";
import moment from "moment";

@connectTo()
@autoinject
export class Settings {
  private state: State;
  private user: any;
  private userClone: any;
  private files: FileList;
  private file: any;
  private uploading = false;
  private saving = false;
  private avatarFileEl: any;
  private controller: ValidationController;
  private rules: any;

  constructor(
    private userService: UserService,
    private uploadService: UploadService,
    private controllerFactory: ValidationControllerFactory
  ) {
    this.controller = this.controllerFactory.createForCurrentScope();
  }

  canActivate(params, routeConfig, navigationInstruction) {
    return this.state?.auth?.loggedIn;
  }

  async attached() {
    try {
      this.user = await this.userService.get(`/${this.state?.user?.id}`);
      this.user.phone = "123456789";

      this.user.dateStart = moment().utc().format();
      this.user.dateEnd = moment().utc().add(7, "day").format();
      this.userClone = JSON.parse(JSON.stringify(this.user));

      this.rules = ValidationRules.ensure("name").required().minLength(2).rules;
      //.on(this.user);
    } catch (error) {
      console.log(error);
    }
  }

  async save() {
    this.saving = true;
    try {
      this.controller.reset();
      this.controller
        .validate({ rules: this.rules, object: this.user })
        .then(async (result) => {
          if (result.valid) {
            if (this.files && this.files.length === 1) {
              const uploadResult = await this.uploadService.UploadAvatar(
                this.files[0]
              );
              this.user.avatarUrl = uploadResult.content.url;
              this.files = null;
            }
            this.user = await this.userService.put(
              `/${this.user.id}`,
              this.user
            );
            this.userClone = JSON.parse(JSON.stringify(this.user));
            this.saving = false;
            toastr.success("Saved");
          } else {
            // validation failed
          }
        });
    } catch (error) {
      console.log(error);
      this.saving = false;
    }
  }

  showUploadAvatarForm() {
    this.avatarFileEl.click();
  }

  filesChanged() {
    if (this.files && this.files.length === 1) this.file = this.files[0];
    else this.file = null;
  }

  async upload() {
    this.uploading = true;
    try {
      if (this.files && this.files.length === 1) {
        const uploadResult = await this.uploadService.UploadAvatar(
          this.files[0]
        );
        this.user.avatarUrl = uploadResult.content.url;
        this.files = null;
        this.uploading = false;
      }
      this.uploading = false;
    } catch (error) {
      console.log(error);
      this.uploading = false;
    }
  }

  cancel() {
    this.user = JSON.parse(JSON.stringify(this.userClone));
    this.files = null;
    this.file = null;
  }
}
