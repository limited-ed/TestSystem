import { Question } from "models";

export interface ResultItem {
    id: number;
    questionId: number;
    question?: Question;
    testId: number;
    answers: number[];
    right: boolean;
}