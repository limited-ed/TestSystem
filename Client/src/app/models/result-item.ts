import { Question } from "models";

export interface ResultItem {
    id: number;
    questionId: number;
    testId: number;
    answers: number[];
    right: boolean;
}