import {
  BaseOmittedFields,
  FilterFieldBase,
  FilterType,
  useFilterBase,
} from "./FilterBase";

export type InputFilter = FilterFieldBase<string> & {
  type: FilterType.INPUT;
  main?: boolean;
};

export const useInputFilter = (
  params: Omit<InputFilter, BaseOmittedFields>
): InputFilter => {
  const filterBase = useFilterBase(params, "");

  return {
    ...params,
    ...filterBase,
    type: FilterType.INPUT,
  };
};
