import { Injectable } from "@angular/core";
import { patchState, signalStore, type, withMethods } from "@ngrx/signals";
import { removeEntity, setAllEntities, setEntity, withEntities } from '@ngrx/signals/entities';
import { get } from "http";
import { Group, Question, Category, User, Test } from "models";

export type AdministratorState = {
    users: User[];
    groups: Group[];
}

const initialState: AdministratorState = {
    users: [],
    groups: [],
}

@Injectable({ providedIn: 'root' })
export class AdministratorStore extends signalStore(
    withEntities({ entity: type<User>(), collection: 'users' }),
    withEntities({ entity: type<Group>(), collection: 'groups' }),
    withEntities({ entity: type<Category>(), collection: 'categories' }),
    withEntities({ entity: type<Question>(), collection: 'questions' }),
    withEntities({ entity: type<Test>(), collection: 'tests' }),
    withMethods((store) => ({
        updateAllUsers(entities: User[]): void {
            patchState(store, setAllEntities(entities, { collection: 'users' }));
        },
        updateAllGroups(entities: Group[]): void {
            patchState(store, setAllEntities(entities, { collection: 'groups' }));
        },
        updateUser(entity: User) {
            patchState(store, setEntity(entity, { collection: 'users' }));
        },
        updateGroup(entity: Group) {
            patchState(store, setEntity(entity, { collection: 'groups' }));
        },
        updateAllCategories(entities: Category[]): void {
            patchState(store, setAllEntities(entities, { collection: 'categories' }));
        },
        updateCategory(entity: Category) {
            patchState(store, setEntity(entity, { collection: 'categories' }));
        },
        getQuestionById(id: number): Question {
            let q = store.questionsEntities().find(q => q.id === id);
            if (!q) {
              q= { id: 0, categoryId: 0, content: '', answers: [] } as Question;
            }
            return q;
        },
        updateAllQuestions(entities: Question[]): void {
            patchState(store, setAllEntities(entities, { collection: 'questions' }));
        },
        updateQuestion(entity: Question) {
            patchState(store, setEntity(entity, { collection: 'questions' }));
        },
        deleteQuestion(id: number) {
            patchState(store, removeEntity(id, { collection: 'questions' }));
        },
        updateAllTests(entities: Test[]): void {
            patchState(store, setAllEntities(entities, { collection: 'tests' }));
        },
        updateTest(entity: Test): void {
            patchState(store, setEntity(entity, { collection: 'tests' }))
        },

    }))
) { };