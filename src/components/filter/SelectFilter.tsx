import { MenuItem, Select, SelectChangeEvent, useTheme } from "@mui/material";
import { FilterFieldBase, FilterType } from "./Filters";

export type SelectOption<T> = {
    label: string;
    value: T;
};

export type SelectFilter<T> = FilterFieldBase & {
    type: FilterType.SELECT;
    options: SelectOption<T>[];
    onChange: (value: T | null) => void;
    getValue: () => T;
};

export interface SelectFilterFieldProps<T> extends SelectFilter<T> {
    outlined?: boolean;
} 

export const SelectFilterField = ({ outlined, onChange, getValue, options, placeholder }: SelectFilterFieldProps<unknown>) => {
    const value = getValue();

    const theme = useTheme();
    
    return (
        <Select
            label={outlined ? placeholder : null}
            value={value}
            onChange={(event: SelectChangeEvent<unknown>) => {
                const value = event.target.value;
                if (typeof value === "string" || !value) {
                    onChange(null);
                } else {
                    onChange(value);
                }
            }}
            size="small"
            sx={{
                boxShadow: 'none',
                ...(outlined ? {} : {
                    '.MuiOutlinedInput-notchedOutline': { border: "0!important" },
                    ...(!!value && value != -1 ? {
                        '.MuiInputBase-input': { color: theme.palette.primary.main, fontWeight: 700 },
                        '.MuiSelect-icon': { color: theme.palette.primary.main },
                    } : {})
                })
            }}
        >
            <MenuItem value={-1}>{placeholder}</MenuItem>

            {
                options.map((option, index) => (
                    <MenuItem
                        key={index + 1}
                        value={index + 1}
                    >{option.label}</MenuItem>
                ))
            }
        </Select>
    );
}