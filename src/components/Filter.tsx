import { Box, MenuItem, Select, TextField, useTheme } from "@mui/material";
import React from "react";
import { FaFilter } from "react-icons/fa6";

export enum FilterType {
    SELECT = "SELECT",
    DATEPICKER = "DATEPICKER"
}

export type FilterFieldBase = {
    type: FilterType;
    placeholder: string;
}

export type DateFilter = FilterFieldBase & {
    type: FilterType.DATEPICKER;
    value: Date;
    onChange: (date: Date) => void;
}

export type SelectOption<T> = {
    value: T;
    label: string;
}

export type SelectFilter<T> = FilterFieldBase & {
    type: FilterType.SELECT;
    value: T
    options: SelectOption<T>[];
    onChange: (value: T) => void;
}

export type FilterField = DateFilter | SelectFilter<any>;

export type FilterProps = {
    input?: {
        placeholder: string;
        value: string;
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    },
    fields: FilterField[];
};

export const Filter = ({ input, fields }: FilterProps) => {
    const theme = useTheme();

    return (
        <Box
            px={2} height="65px" borderRadius={1}
            bgcolor={theme.palette.grey[100]} width="100%" display="flex"
            alignItems="center" justifyContent="space-between"
        >
            <Box display="flex" gap={2} alignItems="center" width="100%">
                <FaFilter size="18px" color={theme.palette.primary.main} />

                {input && (
                    <TextField
                        fullWidth
                        variant="standard"
                        placeholder={input.placeholder}
                        value={input.value}
                        onChange={input.onChange}
                        InputProps={{
                            disableUnderline: true,
                        }}
                    />
                )}
            </Box>

            <Box display="flex" gap={2} alignItems="center">
                {fields.map((field, index) => {
                    if (field.type === FilterType.SELECT) {
                        return (
                            <Select key={index + 1} value={field.value} size="small" sx={{ boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 } }}>
                                <MenuItem value={-1}>{field.placeholder}</MenuItem>

                                {
                                    field.options.map(option => (
                                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                    ))
                                }
                            </Select>
                        );
                    }
                })}
            </Box>
        </Box>
    );
}