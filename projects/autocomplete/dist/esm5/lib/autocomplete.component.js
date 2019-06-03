import * as tslib_1 from "tslib";
/*
  MIT LICENSE @liuy97
*/
import { Component, ComponentFactoryResolver, Directive, ElementRef, EventEmitter, HostListener, Input, Output, ViewContainerRef } from '@angular/core';
var AutocompleteComponent = /** @class */ (function () {
    function AutocompleteComponent(elementRef) {
        this.classList = 'autocomplete';
        this.selectEvent = new EventEmitter();
        this.inputChangedEvent = new EventEmitter();
        this.maxLimit = 0;
        this.thisElement = elementRef.nativeElement;
        this.selectedIndex = 0;
        this.showAutoComplete = false;
        this.value = '';
    }
    AutocompleteComponent.prototype.ngOnInit = function () {
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
    };
    AutocompleteComponent.prototype.ngOnChanges = function () {
        this.filterItems(this.value);
    };
    AutocompleteComponent.prototype.enterText = function (event) {
        var total = this.candidates.length;
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
    };
    AutocompleteComponent.prototype.onSelect = function (idx) {
        this.showAutoComplete = false;
        this.value = this.candidatesLabels[idx];
        this.selectEvent.emit(this.candidates[idx]);
    };
    AutocompleteComponent.prototype.onKeyUpEvent = function (event, idx) {
        if (event.keyCode === 13) {
            this.onSelect(idx);
        }
    };
    AutocompleteComponent.prototype.filterItems = function (search) {
        var field = this.sourceField;
        var filterItem = this.filterItem;
        if (this.items) {
            this.candidates = this.items.filter(function (item) {
                return filterItem(item, field, search);
            });
            if (this.maxLimit > 0) {
                this.candidates = this.candidates.slice(0, this.maxLimit);
            }
            this.buildLabels();
        }
    };
    AutocompleteComponent.prototype.getFieldValue = function (object, path) {
        if (typeof object === 'string') {
            return object;
        }
        if (path instanceof Array) {
            var result_1 = object;
            path.forEach(function (element) {
                if (result_1 !== null &&
                    result_1 !== undefined &&
                    result_1[element] !== null &&
                    result_1[element] !== undefined) {
                    result_1 = result_1[element];
                }
                else {
                    result_1 = '';
                }
            });
            return result_1;
        }
        else {
            return object[path] || '';
        }
    };
    AutocompleteComponent.prototype.isNull = function (object) {
        return object === null || object === undefined;
    };
    AutocompleteComponent.prototype.buildLabels = function () {
        var field = this.sourceField;
        var getFieldValue = this.getFieldValue;
        this.candidatesLabels = this.candidates.map(function (e) {
            return getFieldValue(e, field);
        });
    };
    AutocompleteComponent.prototype.filterItem = function (item, path, search) {
        if (search === null || search === undefined || search.length === 0) {
            return true;
        }
        var result;
        if (typeof item === 'string') {
            result = item;
        }
        else if (path instanceof Array) {
            result = item;
            path.forEach(function (element) {
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
            template: "\n  <div [ngClass]=\"classList\">\n    <input type=\"text\"\n      placeholder=\"{{placeholder}}\"\n      (blur)=\"showAutoComplete = false;\"\n      (focus)=\"showAutoComplete = true;\"\n      [value]=\"value\"\n      (keyup)=\"enterText($event)\">\n    <ul *ngIf=\"showAutoComplete && candidates && candidates.length > 0\">\n      <li *ngFor=\"let candidate of candidates; let idx = index\"\n        [ngClass]=\"{ active: (idx === selectedIndex) }\"\n        (keyup)=\"onKeyUpEvent($event, idx)\"\n        (mouseover)=\"selectedIndex = idx;\"\n        (mousedown)=\"onSelect(idx)\">\n        {{candidatesLabels[idx]}}\n      </li>\n    </ul>\n  </div>",
            styles: [".autocomplete ul {\n       position: absolute;\n       left: 0;\n       width: 100%;\n       border-left: 1px solid #888;\n       border-right: 1px solid #888;\n       border-bottom: 1px solid #888;\n       list-style: none;\n       padding-left: 0px;\n       margin-top: 2px;\n       background-color: #fff;\n       z-index: 100;\n     }\n     .autocomplete li {\n       text-align: left;\n       list-style: none;\n       width: 100%;\n       padding: 0.4em 0 0.4em 0;\n     }\n     .autocomplete li.active {\n       width: 100%;\n       background-color: #4bf;\n     }\n\n     .autocomplete .highlight {\n       background-color: #e2e2e2;\n     }\n     .autocomplete li.active .highlight {\n       background: #666;\n       color: #fff;\n     }"]
        }),
        tslib_1.__metadata("design:paramtypes", [ElementRef])
    ], AutocompleteComponent);
    return AutocompleteComponent;
}());
export { AutocompleteComponent };
var AutocompleteDirective = /** @class */ (function () {
    function AutocompleteDirective(resolver, viewContainerRef) {
        var _this = this;
        this.resolver = resolver;
        this.viewContainerRef = viewContainerRef;
        this.ngModelChange = new EventEmitter();
        this.inputChangedEvent = new EventEmitter();
        this.selectEvent = new EventEmitter();
        this.hideAutocomplete = function (event) {
            if (!_this.componentRef) {
                return;
            }
            if (event && event.target && _this.thisElement && event.target === _this.thisElement.parentElement) {
                return;
            }
            if (!event ||
                (event.target !== _this.thisElement && event.type === 'click')) {
                _this.componentRef.destroy();
                _this.componentRef = undefined;
            }
            if (_this.inputElement['tabIndex'] < 0) {
                _this.inputElement['tabIndex'] = _this.tabIndex;
            }
        };
        this.onInputChanged = function (val) {
            _this.inputElement.value = val;
            if (val !== _this.ngModel) {
                _this.ngModel = val;
                _this.ngModelChange.emit(val);
            }
            var component = _this.componentRef.instance;
            component.filterItems(val);
            _this.inputChangedEvent.emit(val);
        };
        this.onSelect = function (item) {
            var component = _this.componentRef.instance;
            var val = component.value;
            if (val !== _this.ngModel) {
                _this.ngModel = val;
                _this.ngModelChange.emit(val);
            }
            _this.selectEvent.emit(item);
            if (_this.inputElement) {
                _this.inputElement.value = '' + val;
            }
            _this.hideAutocomplete();
        };
        this.thisElement = this.viewContainerRef.element.nativeElement;
    }
    AutocompleteDirective.prototype.ngOnInit = function () {
        if (this.thisElement.tagName.toLowerCase() === 'form') {
            return;
        }
        this.createDiv();
    };
    AutocompleteDirective.prototype.ngOnDestroy = function () {
        if (this.componentRef) {
            this.componentRef.instance.selectEvent.unsubscribe();
            this.componentRef.instance.inputChangedEvent.unsubscribe();
        }
        document.removeEventListener('click', this.hideAutocomplete);
    };
    AutocompleteDirective.prototype.ngOnChanges = function (changes) {
        if (changes['items'] && this.componentRef) {
            var component = this.componentRef.instance;
            component.items = changes['items'].currentValue;
            component.filterItems(component.value);
        }
    };
    AutocompleteDirective.prototype.showAutocomplete = function (event) {
        this.hideAutocomplete();
        if (event === this.thisElement) {
            this.createAutocomplete();
        }
    };
    AutocompleteDirective.prototype.createDiv = function () {
        var element = document.createElement('div');
        element.style.display = 'inline-block';
        element.style.position = 'relative';
        this.thisElement.parentElement.insertBefore(element, this.thisElement.nextSibling);
        element.appendChild(this.thisElement);
        document.addEventListener('click', this.hideAutocomplete);
    };
    AutocompleteDirective.prototype.createAutocomplete = function () {
        var factory = this.resolver.resolveComponentFactory(AutocompleteComponent);
        this.componentRef = this.viewContainerRef.createComponent(factory);
        var component = this.componentRef.instance;
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
            var rect = this.thisElement.getBoundingClientRect();
            var style = this.autocompleteElement.style;
            style.width = rect.width + 'px';
            style.position = 'absolute';
            style.zIndex = '1';
            style.top = '0';
            style.left = '0';
            style.display = 'inline-block';
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
    return AutocompleteDirective;
}());
export { AutocompleteDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nMi1pbnB1dC1hdXRvY29tcGxldGUvIiwic291cmNlcyI6WyJsaWIvYXV0b2NvbXBsZXRlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0VBRUU7QUFDRixPQUFPLEVBQ0wsU0FBUyxFQUNULHdCQUF3QixFQUV4QixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixZQUFZLEVBQ1osS0FBSyxFQUlMLE1BQU0sRUFFTixnQkFBZ0IsRUFFakIsTUFBTSxlQUFlLENBQUM7QUF5RHZCO0lBaUJFLCtCQUFZLFVBQXNCO1FBaEJsQyxjQUFTLEdBQUcsY0FBYyxDQUFDO1FBR2pCLGdCQUFXLEdBQXNCLElBQUksWUFBWSxFQUFPLENBQUM7UUFDekQsc0JBQWlCLEdBQXNCLElBQUksWUFBWSxFQUFPLENBQUM7UUFRekUsYUFBUSxHQUFHLENBQUMsQ0FBQztRQUtYLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQztRQUM1QyxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1FBQzlCLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ2xCLENBQUM7SUFFRCx3Q0FBUSxHQUFSO1FBQ0UsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO1lBQ3BDLElBQUksQ0FBQyxTQUFTLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1NBQzNDO1FBQ0QsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRTtZQUN0QyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO1NBQ2pDO1FB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QixFQUFFLENBQUM7WUFDdEQsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQztZQUM3QyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2hDLEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO1lBQzVCLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1lBQ25CLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1lBQ2hCLEtBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1lBQ2pCLEtBQUssQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFDO1NBQ2hDO0lBQ0gsQ0FBQztJQWpKUTtRQUFSLEtBQUssRUFBRTs7eURBQWE7SUFDWjtRQUFSLEtBQUssRUFBRTs7d0RBQVk7SUFDWDtRQUFSLEtBQUssRUFBRTs7MERBQWlCO0lBQ2Y7UUFBVCxNQUFNLEVBQUU7O2dFQUFvQztJQUNuQztRQUFULE1BQU0sRUFBRTs7b0VBQXdDO0lBQ3ZDO1FBQVQsTUFBTSxFQUFFOzs4REFBa0M7SUF3QzNDO1FBRkMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3hDLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQzs7OztpRUFNeEM7SUFuRFUscUJBQXFCO1FBSmpDLFNBQVMsQ0FBQztZQUNULDJCQUEyQjtZQUMzQixRQUFRLEVBQUUsMEJBQTBCO1NBQ3JDLENBQUM7aURBZ0JvQix3QkFBd0I7WUFDakIsZ0JBQWdCO09BaEJoQyxxQkFBcUIsQ0FtSmpDO0lBQUQsNEJBQUM7Q0FBQSxBQW5KRCxJQW1KQztTQW5KWSxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICBNSVQgTElDRU5TRSBAbGl1eTk3XG4qL1xuaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIENvbXBvbmVudFJlZixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBIb3N0QmluZGluZ1xufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuICBzZWxlY3RvcjogJ25nMi1pbnB1dC1hdXRvY29tcGxldGUnLFxuICB0ZW1wbGF0ZTogYFxuICA8ZGl2IFtuZ0NsYXNzXT1cImNsYXNzTGlzdFwiPlxuICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiXG4gICAgICBwbGFjZWhvbGRlcj1cInt7cGxhY2Vob2xkZXJ9fVwiXG4gICAgICAoYmx1cik9XCJzaG93QXV0b0NvbXBsZXRlID0gZmFsc2U7XCJcbiAgICAgIChmb2N1cyk9XCJzaG93QXV0b0NvbXBsZXRlID0gdHJ1ZTtcIlxuICAgICAgW3ZhbHVlXT1cInZhbHVlXCJcbiAgICAgIChrZXl1cCk9XCJlbnRlclRleHQoJGV2ZW50KVwiPlxuICAgIDx1bCAqbmdJZj1cInNob3dBdXRvQ29tcGxldGUgJiYgY2FuZGlkYXRlcyAmJiBjYW5kaWRhdGVzLmxlbmd0aCA+IDBcIj5cbiAgICAgIDxsaSAqbmdGb3I9XCJsZXQgY2FuZGlkYXRlIG9mIGNhbmRpZGF0ZXM7IGxldCBpZHggPSBpbmRleFwiXG4gICAgICAgIFtuZ0NsYXNzXT1cInsgYWN0aXZlOiAoaWR4ID09PSBzZWxlY3RlZEluZGV4KSB9XCJcbiAgICAgICAgKGtleXVwKT1cIm9uS2V5VXBFdmVudCgkZXZlbnQsIGlkeClcIlxuICAgICAgICAobW91c2VvdmVyKT1cInNlbGVjdGVkSW5kZXggPSBpZHg7XCJcbiAgICAgICAgKG1vdXNlZG93bik9XCJvblNlbGVjdChpZHgpXCI+XG4gICAgICAgIHt7Y2FuZGlkYXRlc0xhYmVsc1tpZHhdfX1cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cbiAgPC9kaXY+YCxcbiAgc3R5bGVzOiBbXG4gICAgYC5hdXRvY29tcGxldGUgdWwge1xuICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICBsZWZ0OiAwO1xuICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgIGJvcmRlci1sZWZ0OiAxcHggc29saWQgIzg4ODtcbiAgICAgICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCAjODg4O1xuICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjODg4O1xuICAgICAgIGxpc3Qtc3R5bGU6IG5vbmU7XG4gICAgICAgcGFkZGluZy1sZWZ0OiAwcHg7XG4gICAgICAgbWFyZ2luLXRvcDogMnB4O1xuICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XG4gICAgICAgei1pbmRleDogMTAwO1xuICAgICB9XG4gICAgIC5hdXRvY29tcGxldGUgbGkge1xuICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgICAgbGlzdC1zdHlsZTogbm9uZTtcbiAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICBwYWRkaW5nOiAwLjRlbSAwIDAuNGVtIDA7XG4gICAgIH1cbiAgICAgLmF1dG9jb21wbGV0ZSBsaS5hY3RpdmUge1xuICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgIGJhY2tncm91bmQtY29sb3I6ICM0YmY7XG4gICAgIH1cblxuICAgICAuYXV0b2NvbXBsZXRlIC5oaWdobGlnaHQge1xuICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNlMmUyZTI7XG4gICAgIH1cbiAgICAgLmF1dG9jb21wbGV0ZSBsaS5hY3RpdmUgLmhpZ2hsaWdodCB7XG4gICAgICAgYmFja2dyb3VuZDogIzY2NjtcbiAgICAgICBjb2xvcjogI2ZmZjtcbiAgICAgfWBcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBBdXRvY29tcGxldGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG4gIGNsYXNzTGlzdCA9ICdhdXRvY29tcGxldGUnO1xuICBASW5wdXQoKSBpdGVtczogYW55W107XG4gIEBJbnB1dCgpIGNvbmZpZzogYW55O1xuICBAT3V0cHV0KCkgc2VsZWN0RXZlbnQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBpbnB1dENoYW5nZWRFdmVudDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgaW5wdXRFbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50O1xuICB2YWx1ZTogc3RyaW5nO1xuICBjYW5kaWRhdGVzOiBhbnlbXTtcbiAgY2FuZGlkYXRlc0xhYmVsczogYW55W107XG4gIHNlbGVjdGVkSW5kZXg6IG51bWJlcjtcbiAgc2hvd0F1dG9Db21wbGV0ZTogYm9vbGVhbjtcbiAgcGxhY2Vob2xkZXI6IHN0cmluZztcbiAgbWF4TGltaXQgPSAwO1xuICBwcml2YXRlIHNvdXJjZUZpZWxkOiBhbnk7XG4gIHByaXZhdGUgdGhpc0VsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHtcbiAgICB0aGlzLnRoaXNFbGVtZW50ID0gZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9IDA7XG4gICAgdGhpcy5zaG93QXV0b0NvbXBsZXRlID0gZmFsc2U7XG4gICAgdGhpcy52YWx1ZSA9ICcnO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuY29uZmlnICYmIHRoaXMuY29uZmlnLmNsYXNzKSB7XG4gICAgICB0aGlzLmNsYXNzTGlzdCArPSAnICcgKyB0aGlzLmNvbmZpZy5jbGFzcztcbiAgICB9XG4gICAgaWYgKHRoaXMuY29uZmlnICYmIHRoaXMuY29uZmlnLm1heCA+IDApIHtcbiAgICAgIHRoaXMubWF4TGltaXQgPSB0aGlzLmNvbmZpZy5tYXg7XG4gICAgfVxuICAgIHRoaXMucGxhY2Vob2xkZXIgPSAnYXV0b2NvbXBsZXRlJztcbiAgICB0aGlzLmlucHV0RWxlbWVudCA9IHRoaXMudGhpc0VsZW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICdpbnB1dCdcbiAgICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG5cbiAgICBpZiAoIXRoaXMuaXNOdWxsKHRoaXMuY29uZmlnKSkge1xuICAgICAgaWYgKCF0aGlzLmlzTnVsbCh0aGlzLmNvbmZpZy5wbGFjZWhvbGRlcikpIHtcbiAgICAgICAgdGhpcy5wbGFjZWhvbGRlciA9IHRoaXMuY29uZmlnLnBsYWNlaG9sZGVyO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmlzTnVsbCh0aGlzLmNvbmZpZy5zb3VyY2VGaWVsZCkpIHtcbiAgICAgICAgdGhpcy5zb3VyY2VGaWVsZCA9IHRoaXMuY29uZmlnLnNvdXJjZUZpZWxkO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmZpbHRlckl0ZW1zKHRoaXMudmFsdWUpO1xuICAgIHRoaXMuaW5wdXRFbGVtZW50LmZvY3VzKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICB0aGlzLmZpbHRlckl0ZW1zKHRoaXMudmFsdWUpO1xuICB9XG5cbiAgZW50ZXJUZXh0KGV2ZW50OiBhbnkpIHtcbiAgICBjb25zdCB0b3RhbCA9IHRoaXMuY2FuZGlkYXRlcy5sZW5ndGg7XG4gICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XG4gICAgICBjYXNlIDI3OlxuICAgICAgICB0aGlzLnNob3dBdXRvQ29tcGxldGUgPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM4OlxuICAgICAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSAodG90YWwgKyB0aGlzLnNlbGVjdGVkSW5kZXggLSAxKSAlIHRvdGFsO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNDA6XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleCA9ICh0b3RhbCArIHRoaXMuc2VsZWN0ZWRJbmRleCArIDEpICUgdG90YWw7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxMzpcbiAgICAgICAgaWYgKHRoaXMuY2FuZGlkYXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhpcy5vblNlbGVjdCh0aGlzLnNlbGVjdGVkSW5kZXgpO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy52YWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcbiAgICAgICAgdGhpcy5pbnB1dENoYW5nZWRFdmVudC5lbWl0KHRoaXMudmFsdWUpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBvblNlbGVjdChpZHg6IG51bWJlcikge1xuICAgIHRoaXMuc2hvd0F1dG9Db21wbGV0ZSA9IGZhbHNlO1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLmNhbmRpZGF0ZXNMYWJlbHNbaWR4XTtcbiAgICB0aGlzLnNlbGVjdEV2ZW50LmVtaXQodGhpcy5jYW5kaWRhdGVzW2lkeF0pO1xuICB9XG5cbiAgb25LZXlVcEV2ZW50KGV2ZW50OiBLZXlib2FyZEV2ZW50LCBpZHg6IG51bWJlcik6IHZvaWQge1xuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAxMykge1xuICAgICAgdGhpcy5vblNlbGVjdChpZHgpO1xuICAgIH1cbiB9XG5cbiAgZmlsdGVySXRlbXMoc2VhcmNoOiBzdHJpbmcpIHtcbiAgICBjb25zdCBmaWVsZCA9IHRoaXMuc291cmNlRmllbGQ7XG4gICAgY29uc3QgZmlsdGVySXRlbSA9IHRoaXMuZmlsdGVySXRlbTtcbiAgICBpZiAodGhpcy5pdGVtcykge1xuICAgICAgdGhpcy5jYW5kaWRhdGVzID0gdGhpcy5pdGVtcy5maWx0ZXIoaXRlbSA9PiB7XG4gICAgICAgIHJldHVybiBmaWx0ZXJJdGVtKGl0ZW0sIGZpZWxkLCBzZWFyY2gpO1xuICAgICAgfSk7XG4gICAgICBpZiAodGhpcy5tYXhMaW1pdCA+IDApIHtcbiAgICAgICAgdGhpcy5jYW5kaWRhdGVzID0gdGhpcy5jYW5kaWRhdGVzLnNsaWNlKDAsIHRoaXMubWF4TGltaXQpO1xuICAgICAgfVxuICAgICAgdGhpcy5idWlsZExhYmVscygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0RmllbGRWYWx1ZShvYmplY3Q6IGFueSwgcGF0aDogYW55KSB7XG4gICAgaWYgKHR5cGVvZiBvYmplY3QgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cbiAgICBpZiAocGF0aCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBsZXQgcmVzdWx0OiBhbnkgPSBvYmplY3Q7XG4gICAgICBwYXRoLmZvckVhY2goKGVsZW1lbnQ6IGFueSkgPT4ge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgcmVzdWx0ICE9PSBudWxsICYmXG4gICAgICAgICAgcmVzdWx0ICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICByZXN1bHRbZWxlbWVudF0gIT09IG51bGwgJiZcbiAgICAgICAgICByZXN1bHRbZWxlbWVudF0gIT09IHVuZGVmaW5lZFxuICAgICAgICApIHtcbiAgICAgICAgICByZXN1bHQgPSByZXN1bHRbZWxlbWVudF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0ID0gJyc7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9iamVjdFtwYXRoXSB8fCAnJztcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGlzTnVsbChvYmplY3Q6IGFueSkge1xuICAgIHJldHVybiBvYmplY3QgPT09IG51bGwgfHwgb2JqZWN0ID09PSB1bmRlZmluZWQ7XG4gIH1cblxuICBwcml2YXRlIGJ1aWxkTGFiZWxzKCkge1xuICAgIGNvbnN0IGZpZWxkID0gdGhpcy5zb3VyY2VGaWVsZDtcbiAgICBjb25zdCBnZXRGaWVsZFZhbHVlID0gdGhpcy5nZXRGaWVsZFZhbHVlO1xuICAgIHRoaXMuY2FuZGlkYXRlc0xhYmVscyA9IHRoaXMuY2FuZGlkYXRlcy5tYXAoKGU6IGFueSkgPT5cbiAgICAgIGdldEZpZWxkVmFsdWUoZSwgZmllbGQpXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgZmlsdGVySXRlbShpdGVtOiBhbnksIHBhdGg6IGFueSwgc2VhcmNoOiBzdHJpbmcpIHtcbiAgICBpZiAoc2VhcmNoID09PSBudWxsIHx8IHNlYXJjaCA9PT0gdW5kZWZpbmVkIHx8IHNlYXJjaC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBsZXQgcmVzdWx0OiBhbnk7XG4gICAgaWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJykge1xuICAgICAgcmVzdWx0ID0gaXRlbTtcbiAgICB9IGVsc2UgaWYgKHBhdGggaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgcmVzdWx0ID0gaXRlbTtcbiAgICAgIHBhdGguZm9yRWFjaCgoZWxlbWVudDogYW55KSA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICByZXN1bHQgIT09IG51bGwgJiZcbiAgICAgICAgICByZXN1bHQgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgIHJlc3VsdFtlbGVtZW50XSAhPT0gbnVsbCAmJlxuICAgICAgICAgIHJlc3VsdFtlbGVtZW50XSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICkge1xuICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdFtlbGVtZW50XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQgPSAnJztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCA9IGl0ZW1bcGF0aF0gfHwgJyc7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQudG9Mb3dlckNhc2UoKS5pbmRleE9mKHNlYXJjaC50b0xvd2VyQ2FzZSgpKSA+PSAwO1xuICB9XG59XG5cbkBEaXJlY3RpdmUoe1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgc2VsZWN0b3I6ICdbbmcyLWlucHV0LWF1dG9jb21wbGV0ZV0nXG59KVxuZXhwb3J0IGNsYXNzIEF1dG9jb21wbGV0ZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBPbkNoYW5nZXMge1xuICBASW5wdXQoKSBjb25maWc6IGFueTtcbiAgQElucHV0KCkgaXRlbXM6IGFueTtcbiAgQElucHV0KCkgbmdNb2RlbDogc3RyaW5nO1xuICBAT3V0cHV0KCkgbmdNb2RlbENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGlucHV0Q2hhbmdlZEV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgc2VsZWN0RXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHJpdmF0ZSBjb21wb25lbnRSZWY6IENvbXBvbmVudFJlZjxBdXRvY29tcGxldGVDb21wb25lbnQ+O1xuICBwcml2YXRlIHRoaXNFbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBhdXRvY29tcGxldGVFbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBpbnB1dEVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gIHByaXZhdGUgdGFiSW5kZXg6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgcHVibGljIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWZcbiAgKSB7XG4gICAgdGhpcy50aGlzRWxlbWVudCA9IHRoaXMudmlld0NvbnRhaW5lclJlZi5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy50aGlzRWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdmb3JtJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmNyZWF0ZURpdigpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuY29tcG9uZW50UmVmKSB7XG4gICAgICB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZS5zZWxlY3RFdmVudC51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2UuaW5wdXRDaGFuZ2VkRXZlbnQudW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhpZGVBdXRvY29tcGxldGUpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogeyBbcHJvcEtleTogc3RyaW5nXTogU2ltcGxlQ2hhbmdlIH0pIHtcbiAgICBpZiAoY2hhbmdlc1snaXRlbXMnXSAmJiB0aGlzLmNvbXBvbmVudFJlZikge1xuICAgICAgY29uc3QgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRSZWYuaW5zdGFuY2U7XG4gICAgICBjb21wb25lbnQuaXRlbXMgPSBjaGFuZ2VzWydpdGVtcyddLmN1cnJlbnRWYWx1ZTtcbiAgICAgIGNvbXBvbmVudC5maWx0ZXJJdGVtcyhjb21wb25lbnQudmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQudGFyZ2V0J10pXG4gIEBIb3N0TGlzdGVuZXIoJ2ZvY3VzJywgWyckZXZlbnQudGFyZ2V0J10pXG4gIHNob3dBdXRvY29tcGxldGUoZXZlbnQ6IGFueSkge1xuICAgIHRoaXMuaGlkZUF1dG9jb21wbGV0ZSgpO1xuICAgIGlmIChldmVudCA9PT0gdGhpcy50aGlzRWxlbWVudCkge1xuICAgICAgdGhpcy5jcmVhdGVBdXRvY29tcGxldGUoKTtcbiAgICB9XG4gIH1cblxuICBoaWRlQXV0b2NvbXBsZXRlID0gKGV2ZW50PzogYW55KTogdm9pZCA9PiB7XG4gICAgaWYgKCF0aGlzLmNvbXBvbmVudFJlZikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZXZlbnQgJiYgZXZlbnQudGFyZ2V0ICYmIHRoaXMudGhpc0VsZW1lbnQgJiYgZXZlbnQudGFyZ2V0ID09PSB0aGlzLnRoaXNFbGVtZW50LnBhcmVudEVsZW1lbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKFxuICAgICAgIWV2ZW50IHx8XG4gICAgICAoZXZlbnQudGFyZ2V0ICE9PSB0aGlzLnRoaXNFbGVtZW50ICYmIGV2ZW50LnR5cGUgPT09ICdjbGljaycpXG4gICAgKSB7XG4gICAgICB0aGlzLmNvbXBvbmVudFJlZi5kZXN0cm95KCk7XG4gICAgICB0aGlzLmNvbXBvbmVudFJlZiA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaWYgKHRoaXMuaW5wdXRFbGVtZW50Wyd0YWJJbmRleCddIDwgMCkge1xuICAgICAgdGhpcy5pbnB1dEVsZW1lbnRbJ3RhYkluZGV4J10gPSB0aGlzLnRhYkluZGV4O1xuICAgIH1cbiAgfVxuXG4gIG9uSW5wdXRDaGFuZ2VkID0gKHZhbDogc3RyaW5nKSA9PiB7XG4gICAgdGhpcy5pbnB1dEVsZW1lbnQudmFsdWUgPSB2YWw7XG4gICAgaWYgKHZhbCAhPT0gdGhpcy5uZ01vZGVsKSB7XG4gICAgICB0aGlzLm5nTW9kZWwgPSB2YWw7XG4gICAgICB0aGlzLm5nTW9kZWxDaGFuZ2UuZW1pdCh2YWwpO1xuICAgIH1cbiAgICBjb25zdCBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudFJlZi5pbnN0YW5jZTtcbiAgICBjb21wb25lbnQuZmlsdGVySXRlbXModmFsKTtcbiAgICB0aGlzLmlucHV0Q2hhbmdlZEV2ZW50LmVtaXQodmFsKTtcbiAgfVxuXG4gIG9uU2VsZWN0ID0gKGl0ZW06IGFueSkgPT4ge1xuICAgIGNvbnN0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlO1xuICAgIGNvbnN0IHZhbCA9IGNvbXBvbmVudC52YWx1ZTtcbiAgICBpZiAodmFsICE9PSB0aGlzLm5nTW9kZWwpIHtcbiAgICAgIHRoaXMubmdNb2RlbCA9IHZhbDtcbiAgICAgIHRoaXMubmdNb2RlbENoYW5nZS5lbWl0KHZhbCk7XG4gICAgfVxuICAgIHRoaXMuc2VsZWN0RXZlbnQuZW1pdChpdGVtKTtcbiAgICBpZiAodGhpcy5pbnB1dEVsZW1lbnQpIHtcbiAgICAgIHRoaXMuaW5wdXRFbGVtZW50LnZhbHVlID0gJycgKyB2YWw7XG4gICAgfVxuICAgIHRoaXMuaGlkZUF1dG9jb21wbGV0ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVEaXYoKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snO1xuICAgIGVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgIHRoaXMudGhpc0VsZW1lbnQucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoXG4gICAgICBlbGVtZW50LFxuICAgICAgdGhpcy50aGlzRWxlbWVudC5uZXh0U2libGluZ1xuICAgICk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnRoaXNFbGVtZW50KTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGlkZUF1dG9jb21wbGV0ZSk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUF1dG9jb21wbGV0ZSgpIHtcbiAgICBjb25zdCBmYWN0b3J5ID0gdGhpcy5yZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShcbiAgICAgIEF1dG9jb21wbGV0ZUNvbXBvbmVudFxuICAgICk7XG4gICAgdGhpcy5jb21wb25lbnRSZWYgPSB0aGlzLnZpZXdDb250YWluZXJSZWYuY3JlYXRlQ29tcG9uZW50KGZhY3RvcnkpO1xuICAgIGNvbnN0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlO1xuICAgIGNvbXBvbmVudC5jb25maWcgPSB0aGlzLmNvbmZpZztcbiAgICBjb21wb25lbnQuaXRlbXMgPSB0aGlzLml0ZW1zO1xuICAgIGNvbXBvbmVudC5zZWxlY3RFdmVudC5zdWJzY3JpYmUodGhpcy5vblNlbGVjdCk7XG4gICAgY29tcG9uZW50LmlucHV0Q2hhbmdlZEV2ZW50LnN1YnNjcmliZSh0aGlzLm9uSW5wdXRDaGFuZ2VkKTtcbiAgICB0aGlzLmF1dG9jb21wbGV0ZUVsZW1lbnQgPSB0aGlzLmNvbXBvbmVudFJlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuYXV0b2NvbXBsZXRlRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIHRoaXMuaW5wdXRFbGVtZW50ID0gdGhpcy50aGlzRWxlbWVudCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgIGlmICh0aGlzLnRoaXNFbGVtZW50LnRhZ05hbWUgIT09ICdJTlBVVCcgJiYgdGhpcy5hdXRvY29tcGxldGVFbGVtZW50KSB7XG4gICAgICB0aGlzLmlucHV0RWxlbWVudCA9IHRoaXMudGhpc0VsZW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgJ2lucHV0J1xuICAgICAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgdGhpcy5pbnB1dEVsZW1lbnQucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoXG4gICAgICAgIHRoaXMuYXV0b2NvbXBsZXRlRWxlbWVudCxcbiAgICAgICAgdGhpcy5pbnB1dEVsZW1lbnQubmV4dFNpYmxpbmdcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5pbnB1dEVsZW1lbnQudmFsdWUgPSB0aGlzLm5nTW9kZWwgPyB0aGlzLm5nTW9kZWwgOiAnJztcbiAgICBjb21wb25lbnQudmFsdWUgPSB0aGlzLmlucHV0RWxlbWVudC52YWx1ZTtcbiAgICB0aGlzLnRhYkluZGV4ID0gdGhpcy5pbnB1dEVsZW1lbnRbJ3RhYkluZGV4J107XG4gICAgdGhpcy5pbnB1dEVsZW1lbnRbJ3RhYkluZGV4J10gPSAtMTAwO1xuICAgIGlmICh0aGlzLmNvbXBvbmVudFJlZikge1xuICAgICAgY29uc3QgcmVjdCA9IHRoaXMudGhpc0VsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBjb25zdCBzdHlsZSA9IHRoaXMuYXV0b2NvbXBsZXRlRWxlbWVudC5zdHlsZTtcbiAgICAgIHN0eWxlLndpZHRoID0gcmVjdC53aWR0aCArICdweCc7XG4gICAgICBzdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICBzdHlsZS56SW5kZXggPSAnMSc7XG4gICAgICBzdHlsZS50b3AgPSAnMCc7XG4gICAgICBzdHlsZS5sZWZ0ID0gJzAnO1xuICAgICAgc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snO1xuICAgIH1cbiAgfVxufVxuIl19