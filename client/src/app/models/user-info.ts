import { UserRoles } from "./auth/roles";

export interface UserInfo{
    id: number,
    login: string,
    fullname: string,
    role: string,
    canDelete: boolean,
    group: string    
}