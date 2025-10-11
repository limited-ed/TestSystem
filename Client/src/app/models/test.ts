import { Group, TestPart } from "models";

export interface Test {
    id: number;
    parts: TestPart[];
    timer: number;
    groups: Group[];
    userId: number;
}