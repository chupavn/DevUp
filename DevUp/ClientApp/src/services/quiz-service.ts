import { autoinject } from 'aurelia-framework';
import { BaseApiService } from './base-api-service';


@autoinject
export class QuizService extends BaseApiService {

    constructor() {
        super('quizzes');
    }

}
