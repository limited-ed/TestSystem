export enum DialogResult {
    Ok,
    Canceled
}

export interface  DialogResultData<T> {
    result: DialogResult;
    data: T | undefined;
}