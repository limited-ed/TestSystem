export interface MenuItem {
    label?: string;
    icon?: string;
    opened?: boolean;
    active?: boolean;
    items?: MenuItem[];
    header?: boolean;
    separator?: boolean;
    action?: ()=>{}
    routerLink?:string;

}