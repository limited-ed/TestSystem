import { Group, Test } from "models";

export interface GroupTest {
    groupId: number;
    group: Group;
    testId: number;
    test: Test;
}