import {
  Box,
  Button,
  Popover,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { InputFilter } from "./InputFilter";
import { SelectFilter, SelectFilterField } from "./SelectFilter";
import { FilterType } from "./Filters";
import { FaFilter } from "react-icons/fa6";
import { useState } from "react";
import { MobileRoute } from "../MobileRoute";
import { MultiSelectFilterField, MultiSelectFilter } from "./MultiSelectFilter";

export type FilterField =
  | SelectFilter<any>
  | InputFilter
  | MultiSelectFilter<any>;

export type FilterProps = {
  filters: Array<FilterField>;
  onClear: () => void;
};

export const Filter = ({ filters, onClear }: FilterProps) => {
  const theme = useTheme();

  const onlyMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  const onlySmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const mainInputFilter: InputFilter | undefined = filters.find(
    (filter: FilterField) => filter.type === FilterType.INPUT && filter.main
  ) as InputFilter | undefined;

  const { Popover, Trigger } = usePopoverFilter({ filters, onClear });

  let fieldLimit = 4;

  if (onlyMediumScreen) fieldLimit = 2;

  if (onlySmallScreen) fieldLimit = 1;

  return (
    <Box
      px={2}
      height="65px"
      borderRadius={1}
      bgcolor={theme.palette.grey[100]}
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box display="flex" gap={2} alignItems="center" width="100%">
        <FaFilter size="18px" color={theme.palette.primary.main} />

        {mainInputFilter && (
          <TextField
            fullWidth
            variant="standard"
            placeholder={mainInputFilter.placeholder}
            InputProps={{
              disableUnderline: true,
            }}
            onChange={(event) => mainInputFilter.onChange(event.target.value)}
          />
        )}
      </Box>

      <Box display="flex" gap={2} alignItems="center">
        <FilterFields filters={filters} limit={fieldLimit}></FilterFields>

        {filters.length > fieldLimit && Trigger}
      </Box>

      {Popover}
    </Box>
  );
};

const usePopoverFilter = ({
  filters,
  onClear,
}: FilterProps): {
  Popover: JSX.Element;
  Trigger: JSX.Element;
} => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const open = Boolean(anchorEl);

  const theme = useTheme();

  const onlySmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const onClearFilter = () => {
    onClear();
    setAnchorEl(null);
  };

  const getPopover = (): JSX.Element => {
    if (onlySmallScreen && open) {
      return (
        <MobileRoute title="Filter" onClose={() => setAnchorEl(null)}>
          <FilterFields filters={filters} outlined={true}></FilterFields>
        </MobileRoute>
      );
    }

    if (onlySmallScreen && !open) return <></>;

    return (
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box display="flex" flexDirection="column">
          <Box
            p={1}
            pt={2}
            minWidth="460px"
            display="grid"
            gridTemplateColumns="repeat(2, 1fr)"
            gap={1}
            borderBottom={`1px solid ${theme.palette.divider}`}
          >
            <FilterFields filters={filters} outlined={true}></FilterFields>
          </Box>

          <Box p={1} display="flex" justifyContent="flex-end">
            <Button
              size="small"
              variant="contained"
              color="secondary"
              onClick={onClearFilter}
            >
              Vymazať filter
            </Button>
          </Box>
        </Box>
      </Popover>
    );
  };

  return {
    Popover: getPopover(),
    Trigger: (
      <OpenFiltersPopoverTrigger
        filters={filters}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      />
    ),
  };
};

const OpenFiltersPopoverTrigger = ({
  onClick,
  filters,
}: {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  filters: FilterField[];
}) => {
  const theme = useTheme();

  const filtersWithValues = filters.filter((filter) => {
    const value = filter.getValue();
    if (Array.isArray(value)) return value.length > 0;
    return !!value;
  });

  return (
    <Button variant="text" style={{ whiteSpace: "nowrap" }} onClick={onClick}>
      Dalšie filtre
      {filtersWithValues.length > 0 && (
        <Box
          sx={{
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
          }}
        >
          {filtersWithValues.length}
        </Box>
      )}
    </Button>
  );
};

type FilterFieldsProps = Omit<FilterProps, "onClear"> & {
  limit?: number;
  outlined?: boolean;
};

const FilterFields = ({ filters, limit, outlined }: FilterFieldsProps) => {
  const slice = limit ? filters.slice(0, limit) : filters;

  return (
    <>
      {slice.map((filter, index) => {
        if (filter.type === FilterType.SELECT) {
          return (
            <SelectFilterField
              key={index + 1}
              {...filter}
              outlined={outlined}
            />
          );
        }
        if (filter.type === FilterType.MULTI_SELECT) {
          return (
            <MultiSelectFilterField
              key={index + 1}
              {...filter}
              outlined={outlined}
            />
          );
        }
      })}
    </>
  );
};
