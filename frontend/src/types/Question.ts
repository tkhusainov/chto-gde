export enum QuestionType {
    Text = 'text',
    Image = 'image',
    Video = 'video',
    BlackBox = 'black-box',
    Blitz = 'blitz'
}

export type QuestionAnswer = {
    type: QuestionType;
    description?: string;
    srcPath?: string;
}

export type Question = {
    id: string;
    type: QuestionType;
    srcPath?: string;
    header?: string;
    description?: string;
    answer?: QuestionAnswer;
    author?: {
        name: string;
        photo: string;
    },
    subQuestions?: Question[];
}