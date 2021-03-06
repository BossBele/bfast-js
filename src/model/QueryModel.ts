import {FilterModel} from "./FilterModel";

export interface QueryModel<T> {
    skip?: number;
    size?: number;
    orderBy?: Array<{ [P in keyof T]: 1 | -1 }>;
    filter?: FilterModel<T>
    keys?: Array<string>;
    id?: string;
}
