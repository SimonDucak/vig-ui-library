import {
  Box,
  Button,
  FormControlLabel,
  Popover,
  Radio,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  BaseOmittedFields,
  FilterFieldBase,
  FilterType,
  useFilterBase,
} from "./FilterBase";
import { useState } from "react";
import { removeDiacritics } from "../../utils/string";
import { PopoverTriggerButton, StyledPopoverBody } from "./FieldPopover";
import { MobileRoute } from "../MobileRoute";
import { FilterMobileRouteHeader } from "./Filter";

export type SelectOption<T> = {
  label: string;
  value: T;
};

export type SelectFilter<T> = FilterFieldBase<T | null> & {
  type: FilterType.SELECT;
  options: SelectOption<T>[];
};

export const useSelectFilter = <T,>(
  params: Omit<SelectFilter<T>, BaseOmittedFields>
): SelectFilter<T> => {
  const filterBase = useFilterBase(params, null);

  return {
    ...params,
    ...filterBase,
    type: FilterType.SELECT,
  };
};

const useSelectHook = <T,>(props: SelectFilter<T>) => {
  const [search, setSearch] = useState("");

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const currentValue: T | null = props.getValue();

  const openPopover = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closePopover = () => {
    setAnchorEl(null);
    props.setLocalValue(currentValue);
  };

  const open = Boolean(anchorEl);

  const currentSelectedOption = props.options.find(
    (option) => option.value === currentValue
  );

  const applyFilter = () => {
    props.applyFilter();
    setAnchorEl(null);
  };

  const resetFilter = () => {
    props.setLocalValue(null);
    props.applyFilter();
    setAnchorEl(null);
  };

  const filteredOptions = props.options.filter((option) => {
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
    currentSelectedOption,
    filteredOptions,
    applyFilter,
    resetFilter,
  };
};

export const SelectFilterField = <T,>(props: SelectFilter<T>) => {
  const theme = useTheme();

  const onlySmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (onlySmallScreen) {
    return <MobileSelectFilterField {...props} />;
  }

  return <DesktopSelectFilterField {...props} />;
};

function DesktopSelectFilterField<T>(props: SelectFilter<T>) {
  const theme = useTheme();

  const { outlined, placeholder, setLocalValue, localValue } = props;

  const {
    search,
    setSearch,
    anchorEl,
    openPopover,
    closePopover,
    open,
    currentSelectedOption,
    filteredOptions,
    applyFilter,
    resetFilter,
  } = useSelectHook(props);

  return (
    <>
      <PopoverTriggerButton
        onClick={openPopover}
        placeholder={placeholder}
        value={currentSelectedOption}
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
        <Box
          sx={{
            minWidth: "240px",
          }}
        >
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
            <RadioGroup
              options={filteredOptions}
              value={localValue}
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

function MobileSelectFilterField<T>(props: SelectFilter<T>) {
  const [expanded, setExpanded] = useState(false);

  const { placeholder, options, setLocalValue, localValue, resetFilter } =
    props;

  const { filteredOptions } = useSelectHook(props);

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

      <RadioGroup
        options={slicedOptions}
        value={localValue}
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
              onClear={() => {
                resetFilter();
                setExpanded(false);
              }}
            />
          )}
        >
          <Box p={2}>
            <RadioGroup
              options={filteredOptions}
              value={localValue}
              handleChange={setLocalValue}
            />
          </Box>
        </MobileRoute>
      )}
    </Box>
  );
}

type RadioGroupProps<T> = {
  options: SelectOption<T>[];
  value: T | null;
  handleChange: (option: T | null) => void;
  wrappedLayout?: boolean;
};

function RadioGroup<T>({
  options,
  value,
  handleChange,
  wrappedLayout,
}: RadioGroupProps<T>) {
  return (
    <StyledOptionsWrapper wrap={!!wrappedLayout}>
      {options.map((option, index) => (
        <FormControlLabel
          key={index + 1}
          control={
            <Radio
              size="small"
              checked={value === option.value}
              value={option.value}
              onChange={() => handleChange(option.value)}
            />
          }
          label={option.label}
        />
      ))}
    </StyledOptionsWrapper>
  );
}

export const StyledOptionsWrapper = ({
  children,
  wrap,
}: {
  children: React.ReactNode;
  wrap: boolean;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        ...(wrap && {
          flexWrap: "wrap",
          flexDirection: "row",
          gap: 0.2,
        }),
      }}
    >
      {children}
    </Box>
  );
};
