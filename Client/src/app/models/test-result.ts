import { ResultItem } from "models";

export interface TestResult {
    id: number;
    userId: number;
    testId: number;
    dateTime: string;
    total: number;
    answered: number;
    right: number;
    complete: boolean;
    results: ResultItem[];
}