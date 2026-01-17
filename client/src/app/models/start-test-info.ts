import { Question, Test, TestResult } from "models"


export interface StartTestInfo {
    token: string,
    test: Test,
    testResult: TestResult,
    questions: Question[]
}