import { Box, Button, MenuItem, Popover, Select, SelectChangeEvent, TextField, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { FaFilter } from "react-icons/fa6";
import { MobileRoute } from "./MobileRoute";

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
    main?: boolean;
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
    filters: { [key in keyof T]?: FilterField };
}

export const Filter = <T extends {}>({ query, onQueryChange, filters }: FilterProps<T>) => {
    type Key = keyof T;

    type FilterEntry = [Key, FilterField];

    const theme = useTheme();

    const onlyMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

    const onlySmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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

    const { Popover, Trigger } = usePopoverFilter({
        fields: filtersArray,
        query,
        updateQuery,
    });

    let fieldLimit = 4;

    if (onlyMediumScreen) fieldLimit = 2;

    if (onlySmallScreen) fieldLimit = 1;

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
                <FilterFields
                    query={query}
                    updateQuery={updateQuery}
                    fields={filtersArray}
                    limit={fieldLimit}
                ></FilterFields>

                {filtersArray.length > fieldLimit && (Trigger)}
            </Box>

            {Popover}
        </Box>
    );
}

type FilterFieldsProps<T extends {}> = {
    query: T,
    updateQuery: (entry: [keyof T, FilterField], value: unknown) => void;
    fields: Array<[keyof T, FilterField]>;
    limit?: number;
    outlined?: boolean;
}

const usePopoverFilter = <T extends {}>({
    fields,
    query,
    updateQuery,
}: Omit<FilterFieldsProps<T>, "limit" | "outlined">): {
    Popover: JSX.Element;
    Trigger: JSX.Element;
} => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const open = Boolean(anchorEl);

    const theme = useTheme();

    const onlySmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const getPopover = (): JSX.Element => {
        if (onlySmallScreen && open) {
            return <MobileRoute title="Filter" onClose={() => setAnchorEl(null)}>
                <FilterFields
                    query={query}
                    updateQuery={updateQuery}
                    fields={fields}
                    outlined={true}
                ></FilterFields>
            </MobileRoute>
        }

        if (onlySmallScreen && !open) return (<></>)

        return <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <Box p={2} minWidth="320px" display="flex" flexDirection="column" gap={2}>
                <FilterFields
                    query={query}
                    updateQuery={updateQuery}
                    fields={fields}
                    outlined={true}
                ></FilterFields>
            </Box>
        </Popover>
    }

    return {
        Popover: getPopover(),
        Trigger: (
            <Button variant="text" style={{ whiteSpace: "nowrap" }} onClick={(e) => setAnchorEl(e.currentTarget)}>
                Dalšie filtre
                <Box sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: "8px",
                    lineHeight: 1,
                    fontSize: 12,
                }}>{fields.length}</Box>
            </Button>
        ),
    }
}

const FilterFields = <T extends {}>({ fields, query, updateQuery, limit, outlined }: FilterFieldsProps<T>) => {
    const slice = limit ? fields.slice(0, limit) : fields;

    return (
        <>
            {slice.map(([key, field], index) => {
                if (field.type === FilterType.SELECT) {
                    return <SelectFilterField
                        key={index + 1}
                        queryKey={key}
                        field={field}
                        query={query}
                        updateQuery={updateQuery}
                        outlined={outlined}
                    />;
                }
            })}
        </>
    );
}

type BaseFieldProps<T extends {}, V> = {
    queryKey: keyof T,
    query: T,
    updateQuery: (entry: [keyof T, FilterField], value: V) => void;
    outlined?: boolean;
}

type SelectFilterFieldProps<T extends {}> = BaseFieldProps<T, number | string> & {
    field: SelectFilter;
}

const SelectFilterField = <T extends {}>({ queryKey, field, query, updateQuery, outlined }: SelectFilterFieldProps<T>) => {
    const theme = useTheme();

    // TODO: Fix this
    const value = query[queryKey] as string | number;

    const hasValue = value !== -1;

    return (
        <Select
            label={outlined ? field.placeholder : null}
            value={value}
            onChange={(event: SelectChangeEvent<number | string>) => updateQuery([queryKey, field], event.target.value)}
            size="small"
            sx={{
                boxShadow: 'none',
                ...(outlined ? {} : {
                    '.MuiOutlinedInput-notchedOutline': { border: "0!important" },
                    ...(hasValue ? {
                        '.MuiInputBase-input': { color: theme.palette.primary.main, fontWeight: 700 },
                        '.MuiSelect-icon': { color: theme.palette.primary.main },
                    } : {})
                })
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