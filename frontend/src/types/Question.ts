import { QuestionType, AnswerType } from '../enums';

export type QuestionAnswer = {
  type: AnswerType;
  description?: string;
  image?: string;
  video?: string;
};

export type SubQuestion = {
  type?: string;
  description?: string;
  header?: string;
  image?: string;
  video?: string;
  answer?: QuestionAnswer;
};

export type Question = {
  id: string;
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
  subQuestions?: SubQuestion[];
};
