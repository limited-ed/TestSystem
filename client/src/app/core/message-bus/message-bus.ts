import { Injectable } from "@angular/core";
import { ToastMessageOptions } from "primeng/api";
import { Observable, Subject } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class MessageBus{
    private messageSubject = new Subject<ToastMessageOptions>()

    public send(messageOptions: ToastMessageOptions){
        this.messageSubject.next(messageOptions);
    }

    public on(): Observable<ToastMessageOptions> {
        return this.messageSubject.asObservable();
    }
}
