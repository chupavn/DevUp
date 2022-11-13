import { autoinject } from "aurelia-framework";
import { RouterConfiguration, Router } from 'aurelia-router';
import { AuthService } from "services/auth-service";
import * as toastr from 'toastr';

@autoinject
export class ResetPassword {
    private email: string;
    private code: string;
    private password: string;
    private confirmPassword: string;

    constructor(
        private authService: AuthService,
        private router: Router,
    ) { }

    canActivate(params) {
        return params.email && params.code;
    }

    activate(params) {
        this.email = params.email;
        this.code = params.code;
    }

    async submit() {
        try {
            await this.authService.post(`/reset-password`, { email: this.email, code: this.code, password: this.password });
            toastr.success('Reset successfully.');
            this.router.navigateToRoute('enter');
        } catch (error) {
            console.log(error);
        }
    }
}
