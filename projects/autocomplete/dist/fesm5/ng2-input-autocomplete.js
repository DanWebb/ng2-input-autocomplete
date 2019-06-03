import { __decorate, __metadata } from 'tslib';
import { Input, Output, EventEmitter, Component, ElementRef, HostListener, Directive, ComponentFactoryResolver, ViewContainerRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], AutocompleteComponent.prototype, "items", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AutocompleteComponent.prototype, "config", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], AutocompleteComponent.prototype, "selectEvent", void 0);
    __decorate([
        Output(),
        __metadata("design:type", EventEmitter)
    ], AutocompleteComponent.prototype, "inputChangedEvent", void 0);
    AutocompleteComponent = __decorate([
        Component({
            // tslint:disable-next-line
            selector: 'ng2-input-autocomplete',
            template: "\n  <div [ngClass]=\"classList\">\n    <input type=\"text\"\n      placeholder=\"{{placeholder}}\"\n      (blur)=\"showAutoComplete = false;\"\n      (focus)=\"showAutoComplete = true;\"\n      [value]=\"value\"\n      (keyup)=\"enterText($event)\">\n    <ul *ngIf=\"showAutoComplete && candidates && candidates.length > 0\">\n      <li *ngFor=\"let candidate of candidates; let idx = index\"\n        [ngClass]=\"{ active: (idx === selectedIndex) }\"\n        (keyup)=\"onKeyUpEvent($event, idx)\"\n        (mouseover)=\"selectedIndex = idx;\"\n        (mousedown)=\"onSelect(idx)\">\n        {{candidatesLabels[idx]}}\n      </li>\n    </ul>\n  </div>",
            styles: [".autocomplete ul {\n       position: absolute;\n       left: 0;\n       width: 100%;\n       border-left: 1px solid #888;\n       border-right: 1px solid #888;\n       border-bottom: 1px solid #888;\n       list-style: none;\n       padding-left: 0px;\n       margin-top: 2px;\n       background-color: #fff;\n       z-index: 100;\n     }\n     .autocomplete li {\n       text-align: left;\n       list-style: none;\n       width: 100%;\n       padding: 0.4em 0 0.4em 0;\n     }\n     .autocomplete li.active {\n       width: 100%;\n       background-color: #4bf;\n     }\n\n     .autocomplete .highlight {\n       background-color: #e2e2e2;\n     }\n     .autocomplete li.active .highlight {\n       background: #666;\n       color: #fff;\n     }"]
        }),
        __metadata("design:paramtypes", [ElementRef])
    ], AutocompleteComponent);
    return AutocompleteComponent;
}());
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
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AutocompleteDirective.prototype, "config", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], AutocompleteDirective.prototype, "items", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], AutocompleteDirective.prototype, "ngModel", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], AutocompleteDirective.prototype, "ngModelChange", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], AutocompleteDirective.prototype, "inputChangedEvent", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], AutocompleteDirective.prototype, "selectEvent", void 0);
    __decorate([
        HostListener('click', ['$event.target']),
        HostListener('focus', ['$event.target']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], AutocompleteDirective.prototype, "showAutocomplete", null);
    AutocompleteDirective = __decorate([
        Directive({
            // tslint:disable-next-line
            selector: '[ng2-input-autocomplete]'
        }),
        __metadata("design:paramtypes", [ComponentFactoryResolver,
            ViewContainerRef])
    ], AutocompleteDirective);
    return AutocompleteDirective;
}());

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
    AutocompleteModule = AutocompleteModule_1 = __decorate([
        NgModule({
            imports: [CommonModule, FormsModule],
            declarations: [AutocompleteComponent, AutocompleteDirective],
            exports: [AutocompleteComponent, AutocompleteDirective],
            entryComponents: [AutocompleteComponent]
        })
    ], AutocompleteModule);
    return AutocompleteModule;
}());

/*
 * Public API Surface of autocomplete
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AutocompleteComponent, AutocompleteDirective, AutocompleteModule };
//# sourceMappingURL=ng2-input-autocomplete.js.map
