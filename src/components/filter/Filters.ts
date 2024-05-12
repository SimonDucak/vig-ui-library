export enum FilterType {
    INPUT = 0,
    SELECT = 1,
}

export type FilterFieldBase = {
    type: FilterType;
    placeholder: string;
}