import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutocompleteComponent, AutocompleteDirective } from './autocomplete.component';
var AutocompleteModule = /** @class */ (function () {
    function AutocompleteModule() {
    }
    AutocompleteModule_1 = AutocompleteModule;
    AutocompleteModule.forRoot = function () {
        return {
            ngModule: AutocompleteModule_1
        };
    };
    var AutocompleteModule_1;
    AutocompleteModule = AutocompleteModule_1 = tslib_1.__decorate([
        NgModule({
            imports: [CommonModule, FormsModule],
            declarations: [AutocompleteComponent, AutocompleteDirective],
            exports: [AutocompleteComponent, AutocompleteDirective],
            entryComponents: [AutocompleteComponent]
        })
    ], AutocompleteModule);
    return AutocompleteModule;
}());
export { AutocompleteModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nMi1pbnB1dC1hdXRvY29tcGxldGUvIiwic291cmNlcyI6WyJsaWIvYXV0b2NvbXBsZXRlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBdUIsTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUscUJBQXFCLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQVF4RjtJQUFBO0lBTUEsQ0FBQzsyQkFOWSxrQkFBa0I7SUFDdEIsMEJBQU8sR0FBZDtRQUNFLE9BQU87WUFDTCxRQUFRLEVBQUUsb0JBQWtCO1NBQzdCLENBQUM7SUFDSixDQUFDOztJQUxVLGtCQUFrQjtRQU45QixRQUFRLENBQUM7WUFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDO1lBQ3BDLFlBQVksRUFBRSxDQUFDLHFCQUFxQixFQUFFLHFCQUFxQixDQUFDO1lBQzVELE9BQU8sRUFBRSxDQUFDLHFCQUFxQixFQUFFLHFCQUFxQixDQUFDO1lBQ3ZELGVBQWUsRUFBRSxDQUFDLHFCQUFxQixDQUFDO1NBQ3pDLENBQUM7T0FDVyxrQkFBa0IsQ0FNOUI7SUFBRCx5QkFBQztDQUFBLEFBTkQsSUFNQztTQU5ZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBBdXRvY29tcGxldGVDb21wb25lbnQsIEF1dG9jb21wbGV0ZURpcmVjdGl2ZSB9IGZyb20gJy4vYXV0b2NvbXBsZXRlLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIEZvcm1zTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbQXV0b2NvbXBsZXRlQ29tcG9uZW50LCBBdXRvY29tcGxldGVEaXJlY3RpdmVdLFxuICBleHBvcnRzOiBbQXV0b2NvbXBsZXRlQ29tcG9uZW50LCBBdXRvY29tcGxldGVEaXJlY3RpdmVdLFxuICBlbnRyeUNvbXBvbmVudHM6IFtBdXRvY29tcGxldGVDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIEF1dG9jb21wbGV0ZU1vZHVsZSB7XG4gIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogQXV0b2NvbXBsZXRlTW9kdWxlXG4gICAgfTtcbiAgfVxufVxuXG4iXX0=