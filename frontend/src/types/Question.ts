import { QuestionType, AnswerType } from '../enums';

export type QuestionAnswer = {
  type: AnswerType;
  description?: string;
  image?: string;
  video?: string;
};

export type Question = {
  id: string;
  number: string;
  type: QuestionType;
  image?: string;
  video?: string;
  header?: string;
  description?: string;
  answer?: QuestionAnswer;
  author?: {
    name: string;
    photo: string;
  };
  subQuestions?: Question[];
};
