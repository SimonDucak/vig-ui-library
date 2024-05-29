import { Box, IconButton, Typography, styled, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { IoChevronBack } from "react-icons/io5";

export const MobileRouteWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ theme, open }) => ({
  top: 0,
  left: 0,
  position: "fixed",
  background: theme.palette.background.default,
  zIndex: theme.zIndex.drawer * 2,
  width: "100vw",
  height: "100vh",
  transform: open ? "translateX(0)" : "translateX(100%)",
  transition: theme.transitions.create(["transform"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  display: "flex",
  flexDirection: "column",
}));

export type MobileRouteProps = {
  children: React.ReactNode;
  title?: string;
  onClose: () => void;
  headerBuilder?: (onClose: () => void) => React.ReactNode;
};

export const MobileRoute = ({
  children,
  onClose,
  headerBuilder,
  ...restProps
}: MobileRouteProps) => {
  const [open, setOpen] = useState(false);

  const theme = useTheme();

  /// Bol som v lietadle ked som to robil neviem ci to je uplne v sulade best practice
  /// TODO: Pozri to ked budes mat net brasko
  useEffect(() => {
    setOpen(true);
  }, []);

  const beforeClose = () => {
    setOpen(false);
    setTimeout(onClose, theme.transitions.duration.enteringScreen);
  };

  return (
    <MobileRouteWrapper open={open}>
      {headerBuilder && headerBuilder(beforeClose)}
      {!headerBuilder && (
        <MobileRouteHeader
          onClose={beforeClose}
          {...restProps}
        ></MobileRouteHeader>
      )}

      <Box display="flex" flexGrow={1} flexDirection="column">
        {children}
      </Box>
    </MobileRouteWrapper>
  );
};

export type MobileRouteHeaderProps = Omit<
  MobileRouteProps,
  "children" | "headerBuilder"
>;

export const MobileRouteHeader = ({
  title,
  onClose,
}: MobileRouteHeaderProps) => {
  const theme = useTheme();

  return (
    <Box display="flex" justifyContent="space-between" width="100%">
      <Box
        display="flex"
        alignItems="center"
        p={2}
        borderBottom={1}
        borderColor={theme.palette.divider}
        flexGrow={1}
        gap={1}
      >
        <IconButton
          color="primary"
          aria-label="go back"
          onClick={() => onClose()}
          edge="start"
        >
          <IoChevronBack size={24} />
        </IconButton>

        {/* TODO: OVERFLOW FOR TEXT */}
        <Typography variant="h5" noWrap>
          {title}
        </Typography>
      </Box>
    </Box>
  );
};
