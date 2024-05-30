import { useState } from "react";

export enum FilterType {
    INPUT = 0,
    SELECT = 1,
    MULTI_SELECT = 2,
}

export type FilterFieldBase<T> = {
    placeholder: string;
    getValue: () => T;
    onChange: (option: T) => void;
    // Omitted fields
    type: FilterType;
    localValue: T;
    setLocalValue: (value: T) => void;
    applyFilter: () => void;
    resetFilter: () => void;
    rollbackFilter: () => void;
    outlined?: boolean;
}

export type BaseOmittedFields = 'localValue' | 'setLocalValue' | 'type' | 'applyFilter' | 'resetFilter' | 'rollbackFilter';

export const useFilterBase = <T,>(params: Omit<FilterFieldBase<T>, BaseOmittedFields>, initialValue: T): Omit<FilterFieldBase<T>, 'type'> => {
    const [localValue, setLocalValue] = useState<T>(initialValue);
  
    const applyFilter = () => {
        params.onChange(localValue);
    };

    const resetFilter = () => {
        setLocalValue(initialValue);
        params.onChange(initialValue);
    };

    const rollbackFilter = () => {
        setLocalValue(params.getValue());
    };
  
    return {
      ...params,
      localValue,
      setLocalValue,
      applyFilter,
      resetFilter,
      rollbackFilter,
    };
  }