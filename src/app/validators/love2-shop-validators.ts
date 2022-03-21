import { FormControl, ValidationErrors } from "@angular/forms";

export class Love2ShopValidators {
    static notOnlyWhiteSpace(control: FormControl) : ValidationErrors{

        //check if string contains only whitespace
    if(control.value != null && (control.value.trim().length == 0)){
        return {'notOnlyWhitespace': true};
    }
        return null;
    }
}
