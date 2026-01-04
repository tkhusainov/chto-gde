import {questions as questions_0} from './const/0';
import {questions as questions_1} from './const/1';
import {questions as questions_2} from './const/2';

export const questionService = {
    getQuestions(game: number) {
        if (game === 0) {
            return questions_0;
        }

        if (game === 1) {
            return questions_1;
        }

        if (game === 2) {
            return questions_2;
        }

        return [];
    }
}