import { autoinject } from 'aurelia-framework';
import { BaseApiService } from './base-api-service';


@autoinject
export class UserService extends BaseApiService {

    constructor() {
        super('users');
    }

    public register(registerUserDto: any): Promise<any> {
        return this.post('', registerUserDto);
    }

    public getUserProfile(userId: string): Promise<any> {
        return this.get(`/${userId}/profile`);
    }

}
