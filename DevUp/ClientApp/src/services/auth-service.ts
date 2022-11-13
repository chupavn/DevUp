import { autoinject } from 'aurelia-framework';
import { BaseApiService } from './base-api-service';


@autoinject
export class AuthService extends BaseApiService {

    constructor() {
        super('auth');
    }

    public login(LoginDto: any): Promise<any> {
        return this.post('/login', LoginDto);
    }

    public signOut(): Promise<any> {
        return this.post('/logout', {});
    }

}
