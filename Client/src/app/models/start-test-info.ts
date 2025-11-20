import { Question, Test } from "models"


export interface StartTestInfo {
    token: string,
    test: Test
    questions: Question[]
}