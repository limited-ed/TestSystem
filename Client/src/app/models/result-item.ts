import { Question } from "models";

export interface ResultItem {
    id: number;
    questionId: number;
    answers: number[];
    right: boolean;
}