import { ComponentFactoryResolver, ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChange, ViewContainerRef } from '@angular/core';
export declare class AutocompleteComponent implements OnInit, OnChanges {
    classList: string;
    items: any[];
    config: any;
    selectEvent: EventEmitter<any>;
    inputChangedEvent: EventEmitter<any>;
    inputElement: HTMLInputElement;
    value: string;
    candidates: any[];
    candidatesLabels: any[];
    selectedIndex: number;
    showAutoComplete: boolean;
    placeholder: string;
    maxLimit: number;
    private sourceField;
    private thisElement;
    constructor(elementRef: ElementRef);
    ngOnInit(): void;
    ngOnChanges(): void;
    enterText(event: any): void;
    onSelect(idx: number): void;
    onKeyUpEvent(event: KeyboardEvent, idx: number): void;
    filterItems(search: string): void;
    private getFieldValue;
    private isNull;
    private buildLabels;
    private filterItem;
}
export declare class AutocompleteDirective implements OnInit, OnDestroy, OnChanges {
    private resolver;
    viewContainerRef: ViewContainerRef;
    config: any;
    items: any;
    ngModel: string;
    ngModelChange: EventEmitter<{}>;
    inputChangedEvent: EventEmitter<{}>;
    selectEvent: EventEmitter<{}>;
    private componentRef;
    private thisElement;
    private autocompleteElement;
    private inputElement;
    private tabIndex;
    constructor(resolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
    ngOnChanges(changes: {
        [propKey: string]: SimpleChange;
    }): void;
    showAutocomplete(event: any): void;
    hideAutocomplete: (event?: any) => void;
    onInputChanged: (val: string) => void;
    onSelect: (item: any) => void;
    private createDiv;
    private createAutocomplete;
}
