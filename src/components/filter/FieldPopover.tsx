import { Box, Typography, styled, useTheme } from "@mui/material";
import { IoChevronDown } from "react-icons/io5";
import { SelectOption } from "./SelectFilter";

export type PopoverTriggerButtonProps<T> = {
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  value?: SelectOption<T> | SelectOption<T>[] | null;
  placeholder: string;
  outlined?: boolean;
};

export function PopoverTriggerButton<T>({
  onClick,
  placeholder,
  value,
  outlined,
}: PopoverTriggerButtonProps<T>) {
  const theme = useTheme();

  const hasValue = !!value && (Array.isArray(value) ? value.length > 0 : true);

  const getLabel = () => {
    if (!value) return placeholder;
    if (Array.isArray(value)) {
      if (!value.length) return placeholder;
      if (value.length === 1) return value[0].label;
      const [firstOption, ...restOptions] = value;
      return `${firstOption.label} (+${restOptions.length})`;
    }
    return value.label;
  };

  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(1),
        width: "fit-content",
        whiteSpace: "nowrap",
        cursor: "pointer",
        padding: `${theme.spacing(1.5)} ${theme.spacing(1)}`,
        color: hasValue ? theme.palette.primary.main : undefined,
        ...(outlined && {
          width: "100%",
          justifyContent: "space-between",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: `${theme.shape.borderRadius}px`,
          padding: theme.spacing(1),
        }),
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: hasValue ? theme.palette.primary.main : undefined,
          fontWeight: hasValue ? 700 : undefined,
        }}
      >
        {getLabel()}
      </Typography>

      <IoChevronDown size={18} />
    </Box>
  );
}

export const StyledPopoverBody = styled(
  "div",
  {}
)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  maxHeight: "400px",
  overflowY: "auto",
  overflowX: "hidden",
  width: "100%",
  padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));
