import { DialogService } from 'aurelia-dialog';
import { autoinject } from 'aurelia-framework';
import { AuthService } from 'services/auth-service';
import { QuizService } from 'services/quiz-service';
import { QuizDetailDialog } from './quiz-detail-dialog';
import { Quiz } from './quiz-model';

@autoinject
export class QuizList {
    private quizzes: Quiz[];

    constructor(
        private quizService: QuizService,
        private authService: AuthService,
        private dialogService: DialogService,
    ) { }

    async bind(bindingContext: Object, overrideContext: Object) {
        try {
            await this.authService.login({ email: 'admin@localhost', password: 12345678 });
            this.quizzes = await this.quizService.getAll('');
        } catch (error) {
            console.log(error);

        }
    }

    openQuizDetail(event: Event, quiz: Quiz) {
        this.dialogService.open({
            viewModel: QuizDetailDialog,
            model: {
                quiz
            },
            centerHorizontalOnly: true,
            lock: false,
        });

        event.stopPropagation();
    }

    openQuestions(quiz: Quiz) {
        
    }

}
