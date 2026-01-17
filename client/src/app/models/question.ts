import { Answer } from "./answer";

export interface Question {
    id: number;
    content: string;
    categoryId: number;
    imageId?: number;
    answers: Answer[];
}