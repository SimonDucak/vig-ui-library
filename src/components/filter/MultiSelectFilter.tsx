import {
  Box,
  Button,
  FormControlLabel,
  Popover,
  Checkbox,
  TextField,
  useTheme,
  useMediaQuery,
  Typography,
} from "@mui/material";
import {
  BaseOmittedFields,
  FilterFieldBase,
  FilterType,
  useFilterBase,
} from "./FilterBase";
import { useState } from "react";
import { removeDiacritics } from "../../utils/string";
import { SelectOption, StyledOptionsWrapper } from "./SelectFilter";
import { PopoverTriggerButton, StyledPopoverBody } from "./FieldPopover";
import { MobileRoute } from "../MobileRoute";
import { FilterMobileRouteHeader } from "./Filter";

export type MultiSelectFilter<T> = FilterFieldBase<T[]> & {
  type: FilterType.MULTI_SELECT;
  options: SelectOption<T>[];
};

export const useMultiSelect = <T,>(
  params: Omit<MultiSelectFilter<T>, BaseOmittedFields>
): MultiSelectFilter<T> => {
  const filterBase = useFilterBase(params, []);

  return {
    ...params,
    ...filterBase,
    type: FilterType.MULTI_SELECT,
  };
};

const useMultiSelectHook = <T,>(props: MultiSelectFilter<T>) => {
  const [search, setSearch] = useState("");

  const currentValue: T[] = props.getValue();

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const openPopover = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closePopover = () => {
    setAnchorEl(null);
    props.setLocalValue(currentValue);
  };

  const open = Boolean(anchorEl);

  const currentSelectedOptions = props.options.filter((option) =>
    currentValue.includes(option.value)
  );

  const applyFilter = () => {
    props.applyFilter();
    setAnchorEl(null);
  };

  const resetFilter = () => {
    props.setLocalValue([]);
    props.applyFilter();
    setAnchorEl(null);
  };

  const filteredOptions: SelectOption<T>[] = props.options.filter((option) => {
    const searchWithoutDia = removeDiacritics(search);
    const labelWithoutDia = removeDiacritics(option.label);
    return labelWithoutDia
      .toLowerCase()
      .includes(searchWithoutDia.toLowerCase());
  });

  return {
    search,
    setSearch,
    anchorEl,
    openPopover,
    closePopover,
    open,
    currentValue,
    currentSelectedOptions,
    filteredOptions,
    applyFilter,
    resetFilter,
  };
};

export const MultiSelectFilterField = <T,>(props: MultiSelectFilter<T>) => {
  const theme = useTheme();

  const onlySmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (onlySmallScreen) {
    return <MobileMultiSelectFilterField {...props} />;
  }

  return <DesktopMultiSelectFilterField {...props} />;
};

function DesktopMultiSelectFilterField<T>(props: MultiSelectFilter<T>) {
  const theme = useTheme();

  const { outlined, placeholder, localValue, setLocalValue } = props;

  const {
    search,
    setSearch,
    anchorEl,
    openPopover,
    closePopover,
    open,
    currentSelectedOptions,
    resetFilter,
    applyFilter,
    filteredOptions,
  } = useMultiSelectHook(props);

  return (
    <>
      <PopoverTriggerButton
        onClick={openPopover}
        placeholder={placeholder}
        value={currentSelectedOptions}
        outlined={outlined}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={closePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ minWidth: "240px" }}>
          <Box
            sx={{
              width: "100%",
              padding: theme.spacing(1),
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <TextField
              label={placeholder}
              variant="filled"
              size="small"
              fullWidth
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </Box>

          <StyledPopoverBody>
            <CheckboxesGroup
              options={filteredOptions}
              localValue={localValue}
              handleChange={setLocalValue}
            />
          </StyledPopoverBody>

          <Box padding={1} display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={applyFilter} size="small">
              Použiť
            </Button>

            <Button onClick={resetFilter} size="small" color="secondary">
              Vymazať
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
}

function MobileMultiSelectFilterField<T>(props: MultiSelectFilter<T>) {
  const [expanded, setExpanded] = useState(false);

  const { placeholder, options, localValue, setLocalValue } = props;

  const { filteredOptions, resetFilter } = useMultiSelectHook(props);

  const limit = 6;

  const slicedOptions = options.slice(0, limit);

  const restOptions = options.slice(limit);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: (theme) => theme.spacing(2),
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="subtitle2">{placeholder}</Typography>

      <CheckboxesGroup
        options={slicedOptions}
        localValue={localValue}
        handleChange={setLocalValue}
        wrappedLayout={true}
      />

      {restOptions.length > 0 && (
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography
            variant="body2"
            p={1}
            onClick={() => setExpanded(true)}
            color="primary"
          >
            <strong>
              <u>Ďalšie možnosti ({restOptions.length})</u>
            </strong>
          </Typography>
        </Box>
      )}

      {expanded && (
        <MobileRoute
          onClose={() => setExpanded(false)}
          headerBuilder={(onClose) => (
            <FilterMobileRouteHeader
              onClose={onClose}
              title={placeholder}
              onClear={resetFilter}
            />
          )}
        >
          <Box p={2}>
            <CheckboxesGroup
              options={filteredOptions}
              localValue={localValue}
              handleChange={setLocalValue}
            />
          </Box>
        </MobileRoute>
      )}
    </Box>
  );
}

type CheckboxesGroupProps<T> = {
  options: SelectOption<T>[];
  localValue: T[];
  handleChange: (option: T[]) => void;
  wrappedLayout?: boolean;
};

function CheckboxesGroup<T>(props: CheckboxesGroupProps<T>) {
  const { wrappedLayout, options, localValue } = props;

  const handleChange = (toggleValue: T) => {
    const newValue = localValue.includes(toggleValue)
      ? localValue.filter((value) => value !== toggleValue)
      : [...localValue, toggleValue];
    props.handleChange(newValue);
  };

  return (
    <StyledOptionsWrapper wrap={!!wrappedLayout}>
      {options.map((option, index) => {
        return (
          <FormControlLabel
            key={index + 1}
            control={
              <Checkbox
                size="small"
                checked={localValue.includes(option.value)}
                value={option.value}
                onChange={() => handleChange(option.value)}
              />
            }
            label={option.label}
          />
        );
      })}
    </StyledOptionsWrapper>
  );
}
