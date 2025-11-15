import { Group, GroupTest, TestPart } from "models";

export interface Test {
    id: number;
    title: string;
    parts: TestPart[];
    timer: number;
    groupTests: GroupTest[];
    userId: number;
}