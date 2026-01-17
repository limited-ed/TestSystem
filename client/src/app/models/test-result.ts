import { ResultItem, Test } from "models";

export interface TestResult {
    id: number;
    userId: number;
    testId: number;
    test: Test|undefined;
    dateTime: string;
    total: number;
    answered: number;
    right: number;
    complete: boolean;
    results: ResultItem[];
}