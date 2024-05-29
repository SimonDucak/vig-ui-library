export enum FilterType {
    INPUT = 0,
    SELECT = 1,
    MULTI_SELECT = 2,
}

export type FilterFieldBase = {
    type: FilterType;
    placeholder: string;
}