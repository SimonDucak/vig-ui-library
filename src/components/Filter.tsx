import { Box, MenuItem, Select, TextField, useTheme } from "@mui/material";
import { FaFilter } from "react-icons/fa6";

export enum FilterType {
    INPUT = 0,
    SELECT = 1,
    DATEPICKER = 2,
}

export type FilterFieldBase = {
    type: FilterType;
    placeholder: string;
}

export type InputFilter = FilterFieldBase & {
    type: FilterType.INPUT;
    main: boolean;
    placeholder: string;
}

export type DateFilter = FilterFieldBase & {
    type: FilterType.DATEPICKER;
}

export type SelectOption = {
    label: string;
    value: number | string;
}

export type SelectFilter = FilterFieldBase & {
    type: FilterType.SELECT;
    options: SelectOption[];
}

export type FilterField = DateFilter | SelectFilter | InputFilter;

export type FilterProps<T extends {}> = {
    query: T;
    onQueryChange: (query: T) => void;
    filters: { [key in keyof T]: FilterField };
}

export const Filter = <T extends {}>({ query, onQueryChange, filters }: FilterProps<T>) => {
    type Key = keyof T;

    type FilterEntry = [Key, FilterField];

    const theme = useTheme();

    const filtersArray = Object.entries(filters) as FilterEntry[];

    const isInputFilter = (filter: FilterField): filter is InputFilter => {
        return filter.type === FilterType.INPUT;
    }

    const inputFields: Array<[Key, InputFilter]> = filtersArray
        .filter(([_key, filter]) => isInputFilter(filter)) as Array<[Key, InputFilter]>;

    const [_mainInputKey, mainInputDefinition] = inputFields
        .find(([_key, filter]) => filter.main) || [null, null];

    const updateQuery = ([key]: FilterEntry, value: unknown) => {
        onQueryChange({ ...query, [key]: value });
    }

    return (
        <Box
            px={2} height="65px" borderRadius={1}
            bgcolor={theme.palette.grey[100]} width="100%" display="flex"
            alignItems="center" justifyContent="space-between"
        >
            <Box display="flex" gap={2} alignItems="center" width="100%">
                <FaFilter size="18px" color={theme.palette.primary.main} />

                {mainInputDefinition && (
                    <TextField
                        fullWidth
                        variant="standard"
                        placeholder={mainInputDefinition.placeholder}
                        InputProps={{
                            disableUnderline: true,
                        }}
                    />
                )}
            </Box>

            <Box display="flex" gap={2} alignItems="center">
                {filtersArray.map(([key, field], index) => {
                    if (field.type === FilterType.SELECT) {
                        return (
                            <Select
                                key={index + 1}
                                value={query[key]}
                                onChange={event => updateQuery([key, field], event.target.value)}
                                size="small"
                                sx={{
                                    boxShadow: 'none',
                                    '.MuiOutlinedInput-notchedOutline': { border: 0 }
                                }}
                            >
                                <MenuItem value={-1}>{field.placeholder}</MenuItem>

                                {
                                    field.options.map(option => (
                                        <MenuItem
                                            key={option.value}
                                            value={option.value}
                                        >{option.label}</MenuItem>
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