import { autoinject } from "aurelia-framework";
import { AuthService } from "services/auth-service";
import * as toastr from 'toastr';

@autoinject
export class ForgotPassword {
    private email: string;

    private successMessage: string;

    constructor(
        private authService: AuthService,
    ) { }

    async submit() {
        try {
            await this.authService.post(`/forgot-password`, { email: this.email });
            this.successMessage = 'An email has been sent. Please check your inbox.';
        } catch (error) {
            console.log(error);
        }
    }
}
