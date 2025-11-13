import { Group, TestPart } from "models";

export interface Test {
    id: number;
    title: string,
    parts: TestPart[];
    timer: number;
    groups: Group[];
    userId: number;
}