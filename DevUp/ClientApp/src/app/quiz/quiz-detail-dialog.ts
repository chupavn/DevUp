import { DialogController } from 'aurelia-dialog';
import { autoinject } from 'aurelia-framework';
import { Quiz } from './quiz-model';

@autoinject
export class QuizDetailDialog {
    private quiz: Quiz;

    private hasMeasure = true;
    private hasStudy = false;

    constructor(
        private dialogController: DialogController,
    ){}

    activate(params, routeConfig, navigationInstruction) {
        this.quiz = params.quiz;
    }

    toggleMeasure(){
        this.hasMeasure = !this.hasMeasure;
    }

    toggleStudy(){
        this.hasStudy = !this.hasStudy;
    }
}
