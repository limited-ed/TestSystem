import { Group } from 'models'


export interface User {
    id: number;
    login: string;
    password: string;
    confirmation: string,
    fullname: string;
    role: number;
    groupId: number;
    group?: Group;
    canDelete: boolean;
}