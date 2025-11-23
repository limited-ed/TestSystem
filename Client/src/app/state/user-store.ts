import { Injectable } from "@angular/core"
import { patchState, signalStore, type, withMethods, withState } from "@ngrx/signals"
import { addEntity, removeEntity, setAllEntities, updateEntities, withEntities } from "@ngrx/signals/entities"
import { Question, ResultItem, Test, TestResult } from "models"

type UserState = {
    mode: UserMode,
    tests: Test[],
    testToken: string
    startedTest: Test 
    testResult: TestResult
}

const initialState: UserState = {
    mode: "select",
    tests: [],
    testToken: "",
    startedTest: {
        id: 0,
        title: "",
        parts: [],
        timer: 0,
        groupTests: [],
        userId: 0
    },
    testResult: {
        id: 0,
        userId: 0,
        testId: 0,
        dateTime: "",
        total: 0,
        answered: 0,
        right: 0,
        complete: false,
        results: []
    }
}

type UserMode = 'select' | 'testing' | 'result'

@Injectable({ providedIn: 'root' })
export class UserStore extends signalStore(
    withState(initialState),
    withEntities({ entity: type<Question>(), collection: 'questions' }),
    withMethods((store) => ({
        updateTest(newTests: Test[]): void {
            patchState(store, { tests: newTests })
        },
        updateQuestions(questions: Question[]): void {
            patchState(store, setAllEntities(questions, { collection: 'questions' }))
        },
        deleteQuestion(id: number): void {
            patchState(store, removeEntity(id, {collection: 'questions'}));
        },
        updateMode(mode: UserMode):  void {
            patchState(store, {mode: mode});
        },
        updateTestToken(testToken: string): void{
            patchState(store, {testToken: testToken});
        },
        updateState(state: Partial<UserState>): void {
            patchState(store, {...state});
        },
        setTestResult(testResult: TestResult) {
            patchState(store, { testResult: testResult });
        },
        updateTestResult(testResult: Partial<TestResult>){
            patchState(store, {testResult: {...store.testResult(), ...testResult}})
        },
        addResultItem(result: ResultItem): void {
            patchState(store, {testResult: {...store.testResult(), results: [...store.testResult().results, result]}})
        },
        resetState(): void {
            patchState(store, initialState);
        }

    }))
) { };