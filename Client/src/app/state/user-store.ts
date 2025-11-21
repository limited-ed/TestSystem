import { Injectable } from "@angular/core"
import { patchState, signalStore, type, withMethods, withState } from "@ngrx/signals"
import { addEntity, removeEntity, setAllEntities, updateEntities, withEntities } from "@ngrx/signals/entities"
import { Question, ResultItem, Test } from "models"

type UserState = {
    mode: 'select' | 'testing',
    tests: Test[],
    testToken: string
    startedTest: Test 
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
    }
}

@Injectable({ providedIn: 'root' })
export class UserStore extends signalStore(
    withState(initialState),
    withEntities({ entity: type<Question>(), collection: 'questions' }),
    withEntities({entity:type<ResultItem>(), collection: 'resultItems'}),
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
        updateMode(mode: 'select' | 'testing'):  void {
            patchState(store, {mode: mode});
        },
        updateTestToken(testToken: string): void{
            patchState(store, {testToken: testToken});
        },
        updateState(state: Partial<UserState>): void {
            patchState(store, {...state});
        },
        addResultItem(result: ResultItem): void {
            patchState(store, addEntity(result, {collection: 'resultItems'}))
        },

    }))
) { };