export interface Group {
    id: number;
    title: string;
    parentId: number;
    canDelete: boolean;
    expanded: boolean
}