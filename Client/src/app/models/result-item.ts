import { Question } from "models";

export interface ResultItem {
    id: number;
    questionId: number;
    question: Question;
    answers: number[];
    right: boolean;
}