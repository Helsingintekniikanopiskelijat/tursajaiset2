import {Component} from "@angular/core";


export interface CustomComponent {
    type: any
    componentDescription: string
    params: {type: string, name: string, description: string}[]
}