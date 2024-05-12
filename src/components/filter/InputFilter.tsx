import { FilterFieldBase, FilterType } from "./Filters";

export type InputFilter = FilterFieldBase & {
    type: FilterType.INPUT;
    main?: boolean;
    placeholder: string;
    onChange: (value: string) => void;
    getValue: () => string;
}