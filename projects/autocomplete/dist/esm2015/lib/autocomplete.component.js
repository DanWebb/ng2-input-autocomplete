import * as tslib_1 from "tslib";
/*
  MIT LICENSE @liuy97
*/
import { Component, ComponentFactoryResolver, Directive, ElementRef, EventEmitter, HostListener, Input, Output, ViewContainerRef } from '@angular/core';
let AutocompleteComponent = class AutocompleteComponent {
    constructor(elementRef) {
        this.classList = 'autocomplete';
        this.selectEvent = new EventEmitter();
        this.inputChangedEvent = new EventEmitter();
        this.maxLimit = 0;
        this.thisElement = elementRef.nativeElement;
        this.selectedIndex = 0;
        this.showAutoComplete = false;
        this.value = '';
    }
    ngOnInit() {
        if (this.config && this.config.class) {
            this.classList += ' ' + this.config.class;
        }
        if (this.config && this.config.max > 0) {
            this.maxLimit = this.config.max;
        }
        this.placeholder = 'autocomplete';
        this.inputElement = this.thisElement.querySelector('input');
        if (!this.isNull(this.config)) {
            if (!this.isNull(this.config.placeholder)) {
                this.placeholder = this.config.placeholder;
            }
            if (!this.isNull(this.config.sourceField)) {
                this.sourceField = this.config.sourceField;
            }
        }
        this.filterItems(this.value);
        this.inputElement.focus();
    }
    ngOnChanges() {
        this.filterItems(this.value);
    }
    enterText(event) {
        const total = this.candidates.length;
        switch (event.keyCode) {
            case 27:
                this.showAutoComplete = false;
                break;
            case 38:
                this.selectedIndex = (total + this.selectedIndex - 1) % total;
                break;
            case 40:
                this.selectedIndex = (total + this.selectedIndex + 1) % total;
                break;
            case 13:
                if (this.candidates.length > 0) {
                    this.onSelect(this.selectedIndex);
                }
                event.preventDefault();
                break;
            default:
                this.value = event.target.value;
                this.inputChangedEvent.emit(this.value);
                break;
        }
    }
    onSelect(idx) {
        this.showAutoComplete = false;
        this.value = this.candidatesLabels[idx];
        this.selectEvent.emit(this.candidates[idx]);
    }
    onKeyUpEvent(event, idx) {
        if (event.keyCode === 13) {
            this.onSelect(idx);
        }
    }
    filterItems(search) {
        const field = this.sourceField;
        const filterItem = this.filterItem;
        if (this.items) {
            this.candidates = this.items.filter(item => {
                return filterItem(item, field, search);
            });
            if (this.maxLimit > 0) {
                this.candidates = this.candidates.slice(0, this.maxLimit);
            }
            this.buildLabels();
        }
    }
    getFieldValue(object, path) {
        if (typeof object === 'string') {
            return object;
        }
        if (path instanceof Array) {
            let result = object;
            path.forEach((element) => {
                if (result !== null &&
                    result !== undefined &&
                    result[element] !== null &&
                    result[element] !== undefined) {
                    result = result[element];
                }
                else {
                    result = '';
                }
            });
            return result;
        }
        else {
            return object[path] || '';
        }
    }
    isNull(object) {
        return object === null || object === undefined;
    }
    buildLabels() {
        const field = this.sourceField;
        const getFieldValue = this.getFieldValue;
        this.candidatesLabels = this.candidates.map((e) => getFieldValue(e, field));
    }
    filterItem(item, path, search) {
        if (search === null || search === undefined || search.length === 0) {
            return true;
        }
        let result;
        if (typeof item === 'string') {
            result = item;
        }
        else if (path instanceof Array) {
            result = item;
            path.forEach((element) => {
                if (result !== null &&
                    result !== undefined &&
                    result[element] !== null &&
                    result[element] !== undefined) {
                    result = result[element];
                }
                else {
                    result = '';
                }
            });
        }
        else {
            result = item[path] || '';
        }
        return result.toLowerCase().indexOf(search.toLowerCase()) >= 0;
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Array)
], AutocompleteComponent.prototype, "items", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], AutocompleteComponent.prototype, "config", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], AutocompleteComponent.prototype, "selectEvent", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", EventEmitter)
], AutocompleteComponent.prototype, "inputChangedEvent", void 0);
AutocompleteComponent = tslib_1.__decorate([
    Component({
        // tslint:disable-next-line
        selector: 'ng2-input-autocomplete',
        template: `
  <div [ngClass]="classList">
    <input type="text"
      placeholder="{{placeholder}}"
      (blur)="showAutoComplete = false;"
      (focus)="showAutoComplete = true;"
      [value]="value"
      (keyup)="enterText($event)">
    <ul *ngIf="showAutoComplete && candidates && candidates.length > 0">
      <li *ngFor="let candidate of candidates; let idx = index"
        [ngClass]="{ active: (idx === selectedIndex) }"
        (keyup)="onKeyUpEvent($event, idx)"
        (mouseover)="selectedIndex = idx;"
        (mousedown)="onSelect(idx)">
        {{candidatesLabels[idx]}}
      </li>
    </ul>
  </div>`,
        styles: [`.autocomplete ul {
       position: absolute;
       left: 0;
       width: 100%;
       border-left: 1px solid #888;
       border-right: 1px solid #888;
       border-bottom: 1px solid #888;
       list-style: none;
       padding-left: 0px;
       margin-top: 2px;
       background-color: #fff;
       z-index: 100;
     }
     .autocomplete li {
       text-align: left;
       list-style: none;
       width: 100%;
       padding: 0.4em 0 0.4em 0;
     }
     .autocomplete li.active {
       width: 100%;
       background-color: #4bf;
     }

     .autocomplete .highlight {
       background-color: #e2e2e2;
     }
     .autocomplete li.active .highlight {
       background: #666;
       color: #fff;
     }`]
    }),
    tslib_1.__metadata("design:paramtypes", [ElementRef])
], AutocompleteComponent);
export { AutocompleteComponent };
let AutocompleteDirective = class AutocompleteDirective {
    constructor(resolver, viewContainerRef) {
        this.resolver = resolver;
        this.viewContainerRef = viewContainerRef;
        this.ngModelChange = new EventEmitter();
        this.inputChangedEvent = new EventEmitter();
        this.selectEvent = new EventEmitter();
        this.hideAutocomplete = (event) => {
            if (!this.componentRef) {
                return;
            }
            if (event && event.target && this.thisElement && event.target === this.thisElement.parentElement) {
                return;
            }
            if (!event ||
                (event.target !== this.thisElement && event.type === 'click')) {
                this.componentRef.destroy();
                this.componentRef = undefined;
            }
            if (this.inputElement['tabIndex'] < 0) {
                this.inputElement['tabIndex'] = this.tabIndex;
            }
        };
        this.onInputChanged = (val) => {
            this.inputElement.value = val;
            if (val !== this.ngModel) {
                this.ngModel = val;
                this.ngModelChange.emit(val);
            }
            const component = this.componentRef.instance;
            component.filterItems(val);
            this.inputChangedEvent.emit(val);
        };
        this.onSelect = (item) => {
            const component = this.componentRef.instance;
            const val = component.value;
            if (val !== this.ngModel) {
                this.ngModel = val;
                this.ngModelChange.emit(val);
            }
            this.selectEvent.emit(item);
            if (this.inputElement) {
                this.inputElement.value = '' + val;
            }
            this.hideAutocomplete();
        };
        this.thisElement = this.viewContainerRef.element.nativeElement;
    }
    ngOnInit() {
        if (this.thisElement.tagName.toLowerCase() === 'form') {
            return;
        }
        this.createDiv();
    }
    ngOnDestroy() {
        if (this.componentRef) {
            this.componentRef.instance.selectEvent.unsubscribe();
            this.componentRef.instance.inputChangedEvent.unsubscribe();
        }
        document.removeEventListener('click', this.hideAutocomplete);
    }
    ngOnChanges(changes) {
        if (changes['items'] && this.componentRef) {
            const component = this.componentRef.instance;
            component.items = changes['items'].currentValue;
            component.filterItems(component.value);
        }
    }
    showAutocomplete(event) {
        this.hideAutocomplete();
        if (event === this.thisElement) {
            this.createAutocomplete();
        }
    }
    createDiv() {
        const element = document.createElement('div');
        element.style.display = 'inline-block';
        element.style.position = 'relative';
        this.thisElement.parentElement.insertBefore(element, this.thisElement.nextSibling);
        element.appendChild(this.thisElement);
        document.addEventListener('click', this.hideAutocomplete);
    }
    createAutocomplete() {
        const factory = this.resolver.resolveComponentFactory(AutocompleteComponent);
        this.componentRef = this.viewContainerRef.createComponent(factory);
        const component = this.componentRef.instance;
        component.config = this.config;
        component.items = this.items;
        component.selectEvent.subscribe(this.onSelect);
        component.inputChangedEvent.subscribe(this.onInputChanged);
        this.autocompleteElement = this.componentRef.location.nativeElement;
        this.autocompleteElement.style.display = 'none';
        this.inputElement = this.thisElement;
        if (this.thisElement.tagName !== 'INPUT' && this.autocompleteElement) {
            this.inputElement = this.thisElement.querySelector('input');
            this.inputElement.parentElement.insertBefore(this.autocompleteElement, this.inputElement.nextSibling);
        }
        this.inputElement.value = this.ngModel ? this.ngModel : '';
        component.value = this.inputElement.value;
        this.tabIndex = this.inputElement['tabIndex'];
        this.inputElement['tabIndex'] = -100;
        if (this.componentRef) {
            const rect = this.thisElement.getBoundingClientRect();
            const style = this.autocompleteElement.style;
            style.width = rect.width + 'px';
            style.position = 'absolute';
            style.zIndex = '1';
            style.top = '0';
            style.left = '0';
            style.display = 'inline-block';
        }
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], AutocompleteDirective.prototype, "config", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], AutocompleteDirective.prototype, "items", void 0);
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], AutocompleteDirective.prototype, "ngModel", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", Object)
], AutocompleteDirective.prototype, "ngModelChange", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", Object)
], AutocompleteDirective.prototype, "inputChangedEvent", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", Object)
], AutocompleteDirective.prototype, "selectEvent", void 0);
tslib_1.__decorate([
    HostListener('click', ['$event.target']),
    HostListener('focus', ['$event.target']),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], AutocompleteDirective.prototype, "showAutocomplete", null);
AutocompleteDirective = tslib_1.__decorate([
    Directive({
        // tslint:disable-next-line
        selector: '[ng2-input-autocomplete]'
    }),
    tslib_1.__metadata("design:paramtypes", [ComponentFactoryResolver,
        ViewContainerRef])
], AutocompleteDirective);
export { AutocompleteDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nMi1pbnB1dC1hdXRvY29tcGxldGUvIiwic291cmNlcyI6WyJsaWIvYXV0b2NvbXBsZXRlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0VBRUU7QUFDRixPQUFPLEVBQ0wsU0FBUyxFQUNULHdCQUF3QixFQUV4QixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixZQUFZLEVBQ1osS0FBSyxFQUlMLE1BQU0sRUFFTixnQkFBZ0IsRUFFakIsTUFBTSxlQUFlLENBQUM7QUF5RHZCLElBQWEscUJBQXFCLEdBQWxDO0lBaUJFLFlBQVksVUFBc0I7UUFoQmxDLGNBQVMsR0FBRyxjQUFjLENBQUM7UUFHakIsZ0JBQVcsR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUN6RCxzQkFBaUIsR0FBc0IsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQVF6RSxhQUFRLEdBQUcsQ0FBQyxDQUFDO1FBS1gsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUMsYUFBYSxDQUFDO1FBQzVDLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFDOUIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7WUFDcEMsSUFBSSxDQUFDLFNBQVMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7U0FDM0M7UUFDRCxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFO1lBQ3RDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7U0FDakM7UUFDRCxJQUFJLENBQUMsV0FBVyxHQUFHLGNBQWMsQ0FBQztRQUNsQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUNoRCxPQUFPLENBQ1ksQ0FBQztRQUV0QixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRTtnQkFDekMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQzthQUM1QztZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUU7Z0JBQ3pDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7YUFDNUM7U0FDRjtRQUNELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQsU0FBUyxDQUFDLEtBQVU7UUFDbEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFDckMsUUFBUSxLQUFLLENBQUMsT0FBTyxFQUFFO1lBQ3JCLEtBQUssRUFBRTtnQkFDTCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO2dCQUM5QixNQUFNO1lBQ1IsS0FBSyxFQUFFO2dCQUNMLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7Z0JBQzlELE1BQU07WUFDUixLQUFLLEVBQUU7Z0JBQ0wsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztnQkFDOUQsTUFBTTtZQUNSLEtBQUssRUFBRTtnQkFDTCxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDOUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7aUJBQ25DO2dCQUNELEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDdkIsTUFBTTtZQUNSO2dCQUNFLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN4QyxNQUFNO1NBQ1Q7SUFDSCxDQUFDO0lBRUQsUUFBUSxDQUFDLEdBQVc7UUFDbEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztRQUM5QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVELFlBQVksQ0FBQyxLQUFvQixFQUFFLEdBQVc7UUFDNUMsSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLEVBQUUsRUFBRTtZQUN4QixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3BCO0lBQ0osQ0FBQztJQUVBLFdBQVcsQ0FBQyxNQUFjO1FBQ3hCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDL0IsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNuQyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN6QyxPQUFPLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3pDLENBQUMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRTtnQkFDckIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQzNEO1lBQ0QsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3BCO0lBQ0gsQ0FBQztJQUVPLGFBQWEsQ0FBQyxNQUFXLEVBQUUsSUFBUztRQUMxQyxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtZQUM5QixPQUFPLE1BQU0sQ0FBQztTQUNmO1FBQ0QsSUFBSSxJQUFJLFlBQVksS0FBSyxFQUFFO1lBQ3pCLElBQUksTUFBTSxHQUFRLE1BQU0sQ0FBQztZQUN6QixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBWSxFQUFFLEVBQUU7Z0JBQzVCLElBQ0UsTUFBTSxLQUFLLElBQUk7b0JBQ2YsTUFBTSxLQUFLLFNBQVM7b0JBQ3BCLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJO29CQUN4QixNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssU0FBUyxFQUM3QjtvQkFDQSxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUMxQjtxQkFBTTtvQkFDTCxNQUFNLEdBQUcsRUFBRSxDQUFDO2lCQUNiO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDSCxPQUFPLE1BQU0sQ0FBQztTQUNmO2FBQU07WUFDTCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDM0I7SUFDSCxDQUFDO0lBRU8sTUFBTSxDQUFDLE1BQVc7UUFDeEIsT0FBTyxNQUFNLEtBQUssSUFBSSxJQUFJLE1BQU0sS0FBSyxTQUFTLENBQUM7SUFDakQsQ0FBQztJQUVPLFdBQVc7UUFDakIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUMvQixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQ3JELGFBQWEsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQ3hCLENBQUM7SUFDSixDQUFDO0lBRU8sVUFBVSxDQUFDLElBQVMsRUFBRSxJQUFTLEVBQUUsTUFBYztRQUNyRCxJQUFJLE1BQU0sS0FBSyxJQUFJLElBQUksTUFBTSxLQUFLLFNBQVMsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNsRSxPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsSUFBSSxNQUFXLENBQUM7UUFDaEIsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7WUFDNUIsTUFBTSxHQUFHLElBQUksQ0FBQztTQUNmO2FBQU0sSUFBSSxJQUFJLFlBQVksS0FBSyxFQUFFO1lBQ2hDLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDZCxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBWSxFQUFFLEVBQUU7Z0JBQzVCLElBQ0UsTUFBTSxLQUFLLElBQUk7b0JBQ2YsTUFBTSxLQUFLLFNBQVM7b0JBQ3BCLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJO29CQUN4QixNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssU0FBUyxFQUM3QjtvQkFDQSxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUMxQjtxQkFBTTtvQkFDTCxNQUFNLEdBQUcsRUFBRSxDQUFDO2lCQUNiO1lBQ0gsQ0FBQyxDQUFDLENBQUM7U0FDSjthQUFNO1lBQ0wsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDM0I7UUFDRCxPQUFPLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pFLENBQUM7Q0FDRixDQUFBO0FBbktVO0lBQVIsS0FBSyxFQUFFOztvREFBYztBQUNiO0lBQVIsS0FBSyxFQUFFOztxREFBYTtBQUNYO0lBQVQsTUFBTSxFQUFFO3NDQUFjLFlBQVk7MERBQWdDO0FBQ3pEO0lBQVQsTUFBTSxFQUFFO3NDQUFvQixZQUFZO2dFQUFnQztBQUw5RCxxQkFBcUI7SUF2RGpDLFNBQVMsQ0FBQztRQUNULDJCQUEyQjtRQUMzQixRQUFRLEVBQUUsd0JBQXdCO1FBQ2xDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7U0FpQkg7aUJBRUw7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQThCRztLQUVOLENBQUM7NkNBa0J3QixVQUFVO0dBakJ2QixxQkFBcUIsQ0FxS2pDO1NBcktZLHFCQUFxQjtBQTJLbEMsSUFBYSxxQkFBcUIsR0FBbEM7SUFjRSxZQUNVLFFBQWtDLEVBQ25DLGdCQUFrQztRQURqQyxhQUFRLEdBQVIsUUFBUSxDQUEwQjtRQUNuQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBWmpDLGtCQUFhLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNuQyxzQkFBaUIsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3ZDLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQStDM0MscUJBQWdCLEdBQUcsQ0FBQyxLQUFXLEVBQVEsRUFBRTtZQUN2QyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDdEIsT0FBTzthQUNSO1lBQ0QsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUU7Z0JBQ2hHLE9BQU87YUFDUjtZQUNELElBQ0UsQ0FBQyxLQUFLO2dCQUNOLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsV0FBVyxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLEVBQzdEO2dCQUNBLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDO2FBQy9CO1lBQ0QsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDckMsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO2FBQy9DO1FBQ0gsQ0FBQyxDQUFBO1FBRUQsbUJBQWMsR0FBRyxDQUFDLEdBQVcsRUFBRSxFQUFFO1lBQy9CLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztZQUM5QixJQUFJLEdBQUcsS0FBSyxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUN4QixJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztnQkFDbkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDOUI7WUFDRCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQztZQUM3QyxTQUFTLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFBO1FBRUQsYUFBUSxHQUFHLENBQUMsSUFBUyxFQUFFLEVBQUU7WUFDdkIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUM7WUFDN0MsTUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQztZQUM1QixJQUFJLEdBQUcsS0FBSyxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUN4QixJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztnQkFDbkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDOUI7WUFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1QixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUM7YUFDcEM7WUFDRCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUMxQixDQUFDLENBQUE7UUE3RUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztJQUNqRSxDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEtBQUssTUFBTSxFQUFFO1lBQ3JELE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBRUQsV0FBVztRQUNULElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDckQsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDNUQ7UUFDRCxRQUFRLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCxXQUFXLENBQUMsT0FBNEM7UUFDdEQsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUN6QyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQztZQUM3QyxTQUFTLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxZQUFZLENBQUM7WUFDaEQsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDeEM7SUFDSCxDQUFDO0lBSUQsZ0JBQWdCLENBQUMsS0FBVTtRQUN6QixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN4QixJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQzlCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1NBQzNCO0lBQ0gsQ0FBQztJQThDTyxTQUFTO1FBQ2YsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUM7UUFDdkMsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FDekMsT0FBTyxFQUNQLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUM3QixDQUFDO1FBQ0YsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDdEMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRU8sa0JBQWtCO1FBQ3hCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQ25ELHFCQUFxQixDQUN0QixDQUFDO1FBQ0YsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25FLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDO1FBQzdDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMvQixTQUFTLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDN0IsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9DLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUM7UUFDcEUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ2hELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFdBQStCLENBQUM7UUFDekQsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sS0FBSyxPQUFPLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFO1lBQ3BFLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQ2hELE9BQU8sQ0FDWSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FDMUMsSUFBSSxDQUFDLG1CQUFtQixFQUN4QixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FDOUIsQ0FBQztTQUNIO1FBRUQsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzNELFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUM7UUFDMUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7UUFDckMsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUN0RCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDO1lBQzdDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDaEMsS0FBSyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7WUFDNUIsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFDbkIsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7WUFDaEIsS0FBSyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7WUFDakIsS0FBSyxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUM7U0FDaEM7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQWxKVTtJQUFSLEtBQUssRUFBRTs7cURBQWE7QUFDWjtJQUFSLEtBQUssRUFBRTs7b0RBQVk7QUFDWDtJQUFSLEtBQUssRUFBRTs7c0RBQWlCO0FBQ2Y7SUFBVCxNQUFNLEVBQUU7OzREQUFvQztBQUNuQztJQUFULE1BQU0sRUFBRTs7Z0VBQXdDO0FBQ3ZDO0lBQVQsTUFBTSxFQUFFOzswREFBa0M7QUF3QzNDO0lBRkMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3hDLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQzs7Ozs2REFNeEM7QUFuRFUscUJBQXFCO0lBSmpDLFNBQVMsQ0FBQztRQUNULDJCQUEyQjtRQUMzQixRQUFRLEVBQUUsMEJBQTBCO0tBQ3JDLENBQUM7NkNBZ0JvQix3QkFBd0I7UUFDakIsZ0JBQWdCO0dBaEJoQyxxQkFBcUIsQ0FtSmpDO1NBbkpZLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gIE1JVCBMSUNFTlNFIEBsaXV5OTdcbiovXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgQ29tcG9uZW50UmVmLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdExpc3RlbmVyLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBTaW1wbGVDaGFuZ2UsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIEhvc3RCaW5kaW5nXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG4gIHNlbGVjdG9yOiAnbmcyLWlucHV0LWF1dG9jb21wbGV0ZScsXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgW25nQ2xhc3NdPVwiY2xhc3NMaXN0XCI+XG4gICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCJcbiAgICAgIHBsYWNlaG9sZGVyPVwie3twbGFjZWhvbGRlcn19XCJcbiAgICAgIChibHVyKT1cInNob3dBdXRvQ29tcGxldGUgPSBmYWxzZTtcIlxuICAgICAgKGZvY3VzKT1cInNob3dBdXRvQ29tcGxldGUgPSB0cnVlO1wiXG4gICAgICBbdmFsdWVdPVwidmFsdWVcIlxuICAgICAgKGtleXVwKT1cImVudGVyVGV4dCgkZXZlbnQpXCI+XG4gICAgPHVsICpuZ0lmPVwic2hvd0F1dG9Db21wbGV0ZSAmJiBjYW5kaWRhdGVzICYmIGNhbmRpZGF0ZXMubGVuZ3RoID4gMFwiPlxuICAgICAgPGxpICpuZ0Zvcj1cImxldCBjYW5kaWRhdGUgb2YgY2FuZGlkYXRlczsgbGV0IGlkeCA9IGluZGV4XCJcbiAgICAgICAgW25nQ2xhc3NdPVwieyBhY3RpdmU6IChpZHggPT09IHNlbGVjdGVkSW5kZXgpIH1cIlxuICAgICAgICAoa2V5dXApPVwib25LZXlVcEV2ZW50KCRldmVudCwgaWR4KVwiXG4gICAgICAgIChtb3VzZW92ZXIpPVwic2VsZWN0ZWRJbmRleCA9IGlkeDtcIlxuICAgICAgICAobW91c2Vkb3duKT1cIm9uU2VsZWN0KGlkeClcIj5cbiAgICAgICAge3tjYW5kaWRhdGVzTGFiZWxzW2lkeF19fVxuICAgICAgPC9saT5cbiAgICA8L3VsPlxuICA8L2Rpdj5gLFxuICBzdHlsZXM6IFtcbiAgICBgLmF1dG9jb21wbGV0ZSB1bCB7XG4gICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgIGxlZnQ6IDA7XG4gICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgYm9yZGVyLWxlZnQ6IDFweCBzb2xpZCAjODg4O1xuICAgICAgIGJvcmRlci1yaWdodDogMXB4IHNvbGlkICM4ODg7XG4gICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICM4ODg7XG4gICAgICAgbGlzdC1zdHlsZTogbm9uZTtcbiAgICAgICBwYWRkaW5nLWxlZnQ6IDBweDtcbiAgICAgICBtYXJnaW4tdG9wOiAycHg7XG4gICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcbiAgICAgICB6LWluZGV4OiAxMDA7XG4gICAgIH1cbiAgICAgLmF1dG9jb21wbGV0ZSBsaSB7XG4gICAgICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICAgICBsaXN0LXN0eWxlOiBub25lO1xuICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgIHBhZGRpbmc6IDAuNGVtIDAgMC40ZW0gMDtcbiAgICAgfVxuICAgICAuYXV0b2NvbXBsZXRlIGxpLmFjdGl2ZSB7XG4gICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzRiZjtcbiAgICAgfVxuXG4gICAgIC5hdXRvY29tcGxldGUgLmhpZ2hsaWdodCB7XG4gICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2UyZTJlMjtcbiAgICAgfVxuICAgICAuYXV0b2NvbXBsZXRlIGxpLmFjdGl2ZSAuaGlnaGxpZ2h0IHtcbiAgICAgICBiYWNrZ3JvdW5kOiAjNjY2O1xuICAgICAgIGNvbG9yOiAjZmZmO1xuICAgICB9YFxuICBdXG59KVxuZXhwb3J0IGNsYXNzIEF1dG9jb21wbGV0ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcbiAgY2xhc3NMaXN0ID0gJ2F1dG9jb21wbGV0ZSc7XG4gIEBJbnB1dCgpIGl0ZW1zOiBhbnlbXTtcbiAgQElucHV0KCkgY29uZmlnOiBhbnk7XG4gIEBPdXRwdXQoKSBzZWxlY3RFdmVudDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIGlucHV0Q2hhbmdlZEV2ZW50OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBpbnB1dEVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gIHZhbHVlOiBzdHJpbmc7XG4gIGNhbmRpZGF0ZXM6IGFueVtdO1xuICBjYW5kaWRhdGVzTGFiZWxzOiBhbnlbXTtcbiAgc2VsZWN0ZWRJbmRleDogbnVtYmVyO1xuICBzaG93QXV0b0NvbXBsZXRlOiBib29sZWFuO1xuICBwbGFjZWhvbGRlcjogc3RyaW5nO1xuICBtYXhMaW1pdCA9IDA7XG4gIHByaXZhdGUgc291cmNlRmllbGQ6IGFueTtcbiAgcHJpdmF0ZSB0aGlzRWxlbWVudDogSFRNTEVsZW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZikge1xuICAgIHRoaXMudGhpc0VsZW1lbnQgPSBlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gMDtcbiAgICB0aGlzLnNob3dBdXRvQ29tcGxldGUgPSBmYWxzZTtcbiAgICB0aGlzLnZhbHVlID0gJyc7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5jb25maWcgJiYgdGhpcy5jb25maWcuY2xhc3MpIHtcbiAgICAgIHRoaXMuY2xhc3NMaXN0ICs9ICcgJyArIHRoaXMuY29uZmlnLmNsYXNzO1xuICAgIH1cbiAgICBpZiAodGhpcy5jb25maWcgJiYgdGhpcy5jb25maWcubWF4ID4gMCkge1xuICAgICAgdGhpcy5tYXhMaW1pdCA9IHRoaXMuY29uZmlnLm1heDtcbiAgICB9XG4gICAgdGhpcy5wbGFjZWhvbGRlciA9ICdhdXRvY29tcGxldGUnO1xuICAgIHRoaXMuaW5wdXRFbGVtZW50ID0gdGhpcy50aGlzRWxlbWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgJ2lucHV0J1xuICAgICkgYXMgSFRNTElucHV0RWxlbWVudDtcblxuICAgIGlmICghdGhpcy5pc051bGwodGhpcy5jb25maWcpKSB7XG4gICAgICBpZiAoIXRoaXMuaXNOdWxsKHRoaXMuY29uZmlnLnBsYWNlaG9sZGVyKSkge1xuICAgICAgICB0aGlzLnBsYWNlaG9sZGVyID0gdGhpcy5jb25maWcucGxhY2Vob2xkZXI7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuaXNOdWxsKHRoaXMuY29uZmlnLnNvdXJjZUZpZWxkKSkge1xuICAgICAgICB0aGlzLnNvdXJjZUZpZWxkID0gdGhpcy5jb25maWcuc291cmNlRmllbGQ7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuZmlsdGVySXRlbXModGhpcy52YWx1ZSk7XG4gICAgdGhpcy5pbnB1dEVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIHRoaXMuZmlsdGVySXRlbXModGhpcy52YWx1ZSk7XG4gIH1cblxuICBlbnRlclRleHQoZXZlbnQ6IGFueSkge1xuICAgIGNvbnN0IHRvdGFsID0gdGhpcy5jYW5kaWRhdGVzLmxlbmd0aDtcbiAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgIGNhc2UgMjc6XG4gICAgICAgIHRoaXMuc2hvd0F1dG9Db21wbGV0ZSA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzg6XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9ICh0b3RhbCArIHRoaXMuc2VsZWN0ZWRJbmRleCAtIDEpICUgdG90YWw7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA0MDpcbiAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gKHRvdGFsICsgdGhpcy5zZWxlY3RlZEluZGV4ICsgMSkgJSB0b3RhbDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDEzOlxuICAgICAgICBpZiAodGhpcy5jYW5kaWRhdGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aGlzLm9uU2VsZWN0KHRoaXMuc2VsZWN0ZWRJbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLnZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgICB0aGlzLmlucHV0Q2hhbmdlZEV2ZW50LmVtaXQodGhpcy52YWx1ZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIG9uU2VsZWN0KGlkeDogbnVtYmVyKSB7XG4gICAgdGhpcy5zaG93QXV0b0NvbXBsZXRlID0gZmFsc2U7XG4gICAgdGhpcy52YWx1ZSA9IHRoaXMuY2FuZGlkYXRlc0xhYmVsc1tpZHhdO1xuICAgIHRoaXMuc2VsZWN0RXZlbnQuZW1pdCh0aGlzLmNhbmRpZGF0ZXNbaWR4XSk7XG4gIH1cblxuICBvbktleVVwRXZlbnQoZXZlbnQ6IEtleWJvYXJkRXZlbnQsIGlkeDogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XG4gICAgICB0aGlzLm9uU2VsZWN0KGlkeCk7XG4gICAgfVxuIH1cblxuICBmaWx0ZXJJdGVtcyhzZWFyY2g6IHN0cmluZykge1xuICAgIGNvbnN0IGZpZWxkID0gdGhpcy5zb3VyY2VGaWVsZDtcbiAgICBjb25zdCBmaWx0ZXJJdGVtID0gdGhpcy5maWx0ZXJJdGVtO1xuICAgIGlmICh0aGlzLml0ZW1zKSB7XG4gICAgICB0aGlzLmNhbmRpZGF0ZXMgPSB0aGlzLml0ZW1zLmZpbHRlcihpdGVtID0+IHtcbiAgICAgICAgcmV0dXJuIGZpbHRlckl0ZW0oaXRlbSwgZmllbGQsIHNlYXJjaCk7XG4gICAgICB9KTtcbiAgICAgIGlmICh0aGlzLm1heExpbWl0ID4gMCkge1xuICAgICAgICB0aGlzLmNhbmRpZGF0ZXMgPSB0aGlzLmNhbmRpZGF0ZXMuc2xpY2UoMCwgdGhpcy5tYXhMaW1pdCk7XG4gICAgICB9XG4gICAgICB0aGlzLmJ1aWxkTGFiZWxzKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRGaWVsZFZhbHVlKG9iamVjdDogYW55LCBwYXRoOiBhbnkpIHtcbiAgICBpZiAodHlwZW9mIG9iamVjdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuICAgIGlmIChwYXRoIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIGxldCByZXN1bHQ6IGFueSA9IG9iamVjdDtcbiAgICAgIHBhdGguZm9yRWFjaCgoZWxlbWVudDogYW55KSA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICByZXN1bHQgIT09IG51bGwgJiZcbiAgICAgICAgICByZXN1bHQgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgIHJlc3VsdFtlbGVtZW50XSAhPT0gbnVsbCAmJlxuICAgICAgICAgIHJlc3VsdFtlbGVtZW50XSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICkge1xuICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdFtlbGVtZW50XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQgPSAnJztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb2JqZWN0W3BhdGhdIHx8ICcnO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaXNOdWxsKG9iamVjdDogYW55KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PT0gbnVsbCB8fCBvYmplY3QgPT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGRMYWJlbHMoKSB7XG4gICAgY29uc3QgZmllbGQgPSB0aGlzLnNvdXJjZUZpZWxkO1xuICAgIGNvbnN0IGdldEZpZWxkVmFsdWUgPSB0aGlzLmdldEZpZWxkVmFsdWU7XG4gICAgdGhpcy5jYW5kaWRhdGVzTGFiZWxzID0gdGhpcy5jYW5kaWRhdGVzLm1hcCgoZTogYW55KSA9PlxuICAgICAgZ2V0RmllbGRWYWx1ZShlLCBmaWVsZClcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBmaWx0ZXJJdGVtKGl0ZW06IGFueSwgcGF0aDogYW55LCBzZWFyY2g6IHN0cmluZykge1xuICAgIGlmIChzZWFyY2ggPT09IG51bGwgfHwgc2VhcmNoID09PSB1bmRlZmluZWQgfHwgc2VhcmNoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGxldCByZXN1bHQ6IGFueTtcbiAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXN1bHQgPSBpdGVtO1xuICAgIH0gZWxzZSBpZiAocGF0aCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICByZXN1bHQgPSBpdGVtO1xuICAgICAgcGF0aC5mb3JFYWNoKChlbGVtZW50OiBhbnkpID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHJlc3VsdCAhPT0gbnVsbCAmJlxuICAgICAgICAgIHJlc3VsdCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgcmVzdWx0W2VsZW1lbnRdICE9PSBudWxsICYmXG4gICAgICAgICAgcmVzdWx0W2VsZW1lbnRdICE9PSB1bmRlZmluZWRcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmVzdWx0ID0gcmVzdWx0W2VsZW1lbnRdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdCA9ICcnO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0ID0gaXRlbVtwYXRoXSB8fCAnJztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdC50b0xvd2VyQ2FzZSgpLmluZGV4T2Yoc2VhcmNoLnRvTG93ZXJDYXNlKCkpID49IDA7XG4gIH1cbn1cblxuQERpcmVjdGl2ZSh7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuICBzZWxlY3RvcjogJ1tuZzItaW5wdXQtYXV0b2NvbXBsZXRlXSdcbn0pXG5leHBvcnQgY2xhc3MgQXV0b2NvbXBsZXRlRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcyB7XG4gIEBJbnB1dCgpIGNvbmZpZzogYW55O1xuICBASW5wdXQoKSBpdGVtczogYW55O1xuICBASW5wdXQoKSBuZ01vZGVsOiBzdHJpbmc7XG4gIEBPdXRwdXQoKSBuZ01vZGVsQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgaW5wdXRDaGFuZ2VkRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBzZWxlY3RFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBwcml2YXRlIGNvbXBvbmVudFJlZjogQ29tcG9uZW50UmVmPEF1dG9jb21wbGV0ZUNvbXBvbmVudD47XG4gIHByaXZhdGUgdGhpc0VsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICBwcml2YXRlIGF1dG9jb21wbGV0ZUVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICBwcml2YXRlIGlucHV0RWxlbWVudDogSFRNTElucHV0RWxlbWVudDtcbiAgcHJpdmF0ZSB0YWJJbmRleDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICBwdWJsaWMgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZlxuICApIHtcbiAgICB0aGlzLnRoaXNFbGVtZW50ID0gdGhpcy52aWV3Q29udGFpbmVyUmVmLmVsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLnRoaXNFbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2Zvcm0nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuY3JlYXRlRGl2KCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5jb21wb25lbnRSZWYpIHtcbiAgICAgIHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlLnNlbGVjdEV2ZW50LnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5pbnB1dENoYW5nZWRFdmVudC51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGlkZUF1dG9jb21wbGV0ZSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiB7IFtwcm9wS2V5OiBzdHJpbmddOiBTaW1wbGVDaGFuZ2UgfSkge1xuICAgIGlmIChjaGFuZ2VzWydpdGVtcyddICYmIHRoaXMuY29tcG9uZW50UmVmKSB7XG4gICAgICBjb25zdCBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZTtcbiAgICAgIGNvbXBvbmVudC5pdGVtcyA9IGNoYW5nZXNbJ2l0ZW1zJ10uY3VycmVudFZhbHVlO1xuICAgICAgY29tcG9uZW50LmZpbHRlckl0ZW1zKGNvbXBvbmVudC52YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignY2xpY2snLCBbJyRldmVudC50YXJnZXQnXSlcbiAgQEhvc3RMaXN0ZW5lcignZm9jdXMnLCBbJyRldmVudC50YXJnZXQnXSlcbiAgc2hvd0F1dG9jb21wbGV0ZShldmVudDogYW55KSB7XG4gICAgdGhpcy5oaWRlQXV0b2NvbXBsZXRlKCk7XG4gICAgaWYgKGV2ZW50ID09PSB0aGlzLnRoaXNFbGVtZW50KSB7XG4gICAgICB0aGlzLmNyZWF0ZUF1dG9jb21wbGV0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIGhpZGVBdXRvY29tcGxldGUgPSAoZXZlbnQ/OiBhbnkpOiB2b2lkID0+IHtcbiAgICBpZiAoIXRoaXMuY29tcG9uZW50UmVmKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChldmVudCAmJiBldmVudC50YXJnZXQgJiYgdGhpcy50aGlzRWxlbWVudCAmJiBldmVudC50YXJnZXQgPT09IHRoaXMudGhpc0VsZW1lbnQucGFyZW50RWxlbWVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoXG4gICAgICAhZXZlbnQgfHxcbiAgICAgIChldmVudC50YXJnZXQgIT09IHRoaXMudGhpc0VsZW1lbnQgJiYgZXZlbnQudHlwZSA9PT0gJ2NsaWNrJylcbiAgICApIHtcbiAgICAgIHRoaXMuY29tcG9uZW50UmVmLmRlc3Ryb3koKTtcbiAgICAgIHRoaXMuY29tcG9uZW50UmVmID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAodGhpcy5pbnB1dEVsZW1lbnRbJ3RhYkluZGV4J10gPCAwKSB7XG4gICAgICB0aGlzLmlucHV0RWxlbWVudFsndGFiSW5kZXgnXSA9IHRoaXMudGFiSW5kZXg7XG4gICAgfVxuICB9XG5cbiAgb25JbnB1dENoYW5nZWQgPSAodmFsOiBzdHJpbmcpID0+IHtcbiAgICB0aGlzLmlucHV0RWxlbWVudC52YWx1ZSA9IHZhbDtcbiAgICBpZiAodmFsICE9PSB0aGlzLm5nTW9kZWwpIHtcbiAgICAgIHRoaXMubmdNb2RlbCA9IHZhbDtcbiAgICAgIHRoaXMubmdNb2RlbENoYW5nZS5lbWl0KHZhbCk7XG4gICAgfVxuICAgIGNvbnN0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlO1xuICAgIGNvbXBvbmVudC5maWx0ZXJJdGVtcyh2YWwpO1xuICAgIHRoaXMuaW5wdXRDaGFuZ2VkRXZlbnQuZW1pdCh2YWwpO1xuICB9XG5cbiAgb25TZWxlY3QgPSAoaXRlbTogYW55KSA9PiB7XG4gICAgY29uc3QgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2U7XG4gICAgY29uc3QgdmFsID0gY29tcG9uZW50LnZhbHVlO1xuICAgIGlmICh2YWwgIT09IHRoaXMubmdNb2RlbCkge1xuICAgICAgdGhpcy5uZ01vZGVsID0gdmFsO1xuICAgICAgdGhpcy5uZ01vZGVsQ2hhbmdlLmVtaXQodmFsKTtcbiAgICB9XG4gICAgdGhpcy5zZWxlY3RFdmVudC5lbWl0KGl0ZW0pO1xuICAgIGlmICh0aGlzLmlucHV0RWxlbWVudCkge1xuICAgICAgdGhpcy5pbnB1dEVsZW1lbnQudmFsdWUgPSAnJyArIHZhbDtcbiAgICB9XG4gICAgdGhpcy5oaWRlQXV0b2NvbXBsZXRlKCk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZURpdigpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jayc7XG4gICAgZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgdGhpcy50aGlzRWxlbWVudC5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShcbiAgICAgIGVsZW1lbnQsXG4gICAgICB0aGlzLnRoaXNFbGVtZW50Lm5leHRTaWJsaW5nXG4gICAgKTtcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKHRoaXMudGhpc0VsZW1lbnQpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5oaWRlQXV0b2NvbXBsZXRlKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQXV0b2NvbXBsZXRlKCkge1xuICAgIGNvbnN0IGZhY3RvcnkgPSB0aGlzLnJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KFxuICAgICAgQXV0b2NvbXBsZXRlQ29tcG9uZW50XG4gICAgKTtcbiAgICB0aGlzLmNvbXBvbmVudFJlZiA9IHRoaXMudmlld0NvbnRhaW5lclJlZi5jcmVhdGVDb21wb25lbnQoZmFjdG9yeSk7XG4gICAgY29uc3QgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2U7XG4gICAgY29tcG9uZW50LmNvbmZpZyA9IHRoaXMuY29uZmlnO1xuICAgIGNvbXBvbmVudC5pdGVtcyA9IHRoaXMuaXRlbXM7XG4gICAgY29tcG9uZW50LnNlbGVjdEV2ZW50LnN1YnNjcmliZSh0aGlzLm9uU2VsZWN0KTtcbiAgICBjb21wb25lbnQuaW5wdXRDaGFuZ2VkRXZlbnQuc3Vic2NyaWJlKHRoaXMub25JbnB1dENoYW5nZWQpO1xuICAgIHRoaXMuYXV0b2NvbXBsZXRlRWxlbWVudCA9IHRoaXMuY29tcG9uZW50UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5hdXRvY29tcGxldGVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgdGhpcy5pbnB1dEVsZW1lbnQgPSB0aGlzLnRoaXNFbGVtZW50IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgaWYgKHRoaXMudGhpc0VsZW1lbnQudGFnTmFtZSAhPT0gJ0lOUFVUJyAmJiB0aGlzLmF1dG9jb21wbGV0ZUVsZW1lbnQpIHtcbiAgICAgIHRoaXMuaW5wdXRFbGVtZW50ID0gdGhpcy50aGlzRWxlbWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAnaW5wdXQnXG4gICAgICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICB0aGlzLmlucHV0RWxlbWVudC5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShcbiAgICAgICAgdGhpcy5hdXRvY29tcGxldGVFbGVtZW50LFxuICAgICAgICB0aGlzLmlucHV0RWxlbWVudC5uZXh0U2libGluZ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLmlucHV0RWxlbWVudC52YWx1ZSA9IHRoaXMubmdNb2RlbCA/IHRoaXMubmdNb2RlbCA6ICcnO1xuICAgIGNvbXBvbmVudC52YWx1ZSA9IHRoaXMuaW5wdXRFbGVtZW50LnZhbHVlO1xuICAgIHRoaXMudGFiSW5kZXggPSB0aGlzLmlucHV0RWxlbWVudFsndGFiSW5kZXgnXTtcbiAgICB0aGlzLmlucHV0RWxlbWVudFsndGFiSW5kZXgnXSA9IC0xMDA7XG4gICAgaWYgKHRoaXMuY29tcG9uZW50UmVmKSB7XG4gICAgICBjb25zdCByZWN0ID0gdGhpcy50aGlzRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGNvbnN0IHN0eWxlID0gdGhpcy5hdXRvY29tcGxldGVFbGVtZW50LnN0eWxlO1xuICAgICAgc3R5bGUud2lkdGggPSByZWN0LndpZHRoICsgJ3B4JztcbiAgICAgIHN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgIHN0eWxlLnpJbmRleCA9ICcxJztcbiAgICAgIHN0eWxlLnRvcCA9ICcwJztcbiAgICAgIHN0eWxlLmxlZnQgPSAnMCc7XG4gICAgICBzdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jayc7XG4gICAgfVxuICB9XG59XG4iXX0=