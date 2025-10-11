import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'removeTags'
})
export class RemoveTagsPipe implements PipeTransform
{
    transform(value: string, ...args: any[]) {
        if (value) 
        {
            return value.replace(/<[^>]*>/g, '');
        }
        else 
            return '';
    }
    
}