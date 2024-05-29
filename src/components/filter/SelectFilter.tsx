import {
  Box,
  Button,
  FormControlLabel,
  Popover,
  Radio,
  RadioGroup,
  TextField,
  Theme,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FilterFieldBase, FilterType } from "./Filters";
import { useState } from "react";
import { removeDiacritics } from "../../utils/string";
import { PopoverTriggerButton, StyledPopoverBody } from "./FieldPopover";
import { MobileRoute } from "../MobileRoute";

export type SelectOption<T> = {
  label: string;
  value: T;
};

export type SelectFilter<T> = FilterFieldBase & {
  type: FilterType.SELECT;
  options: SelectOption<T>[];
  onChange: (option: SelectOption<T> | null) => void;
  getValue: () => T | null;
};

export interface SelectFilterFieldProps<T> extends SelectFilter<T> {
  outlined?: boolean;
}

function useSelectHook<T>({
  onChange,
  getValue,
  options,
}: SelectFilterFieldProps<T>) {
  const [search, setSearch] = useState("");

  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);

  const value = getValue();

  const selectedOption = options.find((option) => option.value === value);

  const handleChange = (option: SelectOption<any> | null) => {
    onChange(option);
    setAnchorEl(null);
  };

  const filteredOptions = options.filter((option) => {
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
    setAnchorEl,
    handleClick,
    open,
    value,
    selectedOption,
    handleChange,
    filteredOptions,
  };
}

export function SelectFilterField<T>(props: SelectFilterFieldProps<T>) {
  const theme = useTheme();

  const onlySmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (onlySmallScreen) {
    return <MobileSelectFilterField {...props} />;
  }

  return <DesktopSelectFilterField {...props} />;
}

function DesktopSelectFilterField<T>(props: SelectFilterFieldProps<T>) {
  const theme = useTheme();

  const { outlined, placeholder } = props;

  const {
    search,
    setSearch,
    anchorEl,
    setAnchorEl,
    handleClick,
    open,
    value,
    selectedOption,
    handleChange,
    filteredOptions,
  } = useSelectHook(props);

  return (
    <>
      <PopoverTriggerButton
        onClick={handleClick}
        placeholder={placeholder}
        value={selectedOption}
        outlined={outlined}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
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
            <CheckboxesGroup
              options={filteredOptions}
              value={value}
              handleChange={handleChange}
            />
          </StyledPopoverBody>

          {!!value && (
            <Box padding={1} display="flex" justifyContent="flex-end">
              <Button
                onClick={() => handleChange(null)}
                size="small"
                color="secondary"
              >
                Vymazať
              </Button>
            </Box>
          )}
        </Box>
      </Popover>
    </>
  );
}

function MobileSelectFilterField<T>(props: SelectFilterFieldProps<T>) {
  const [expanded, setExpanded] = useState(false);

  const { placeholder, options } = props;

  const { value, handleChange, filteredOptions } = useSelectHook(props);

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
        value={value}
        handleChange={handleChange}
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
        <MobileRoute title={placeholder} onClose={() => setExpanded(false)}>
          <Box p={2}>
            <CheckboxesGroup
              options={filteredOptions}
              value={value}
              handleChange={handleChange}
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
  handleChange: (option: SelectOption<T> | null) => void;
  wrappedLayout?: boolean;
};

function CheckboxesGroup<T>({
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
              onChange={() => handleChange(option)}
            />
          }
          label={option.label}
        />
      ))}
    </StyledOptionsWrapper>
  );
}

export const StyledOptionsWrapper = styled(
  "div",
  {}
)(({ wrap }: { wrap: boolean }) => ({
  display: "flex",
  flexDirection: "column",
  ...(wrap && {
    flexWrap: "wrap",
    flexDirection: "row",
    gap: 0.2,
  }),
}));
