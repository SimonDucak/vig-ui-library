import * as React from "react";
import {
    AppBar as MuiAppBar,
    styled,
    AppBarProps as MuiAppBarProps,
    useTheme,
    useMediaQuery,
} from '@mui/material';

export type AppBarProps = {
    drawerOpen: boolean;
    children: React.ReactNode;
}

type StyledAppBarProps = MuiAppBarProps & Omit<AppBarProps, 'children'> & { mobile: boolean; };

const StyledAppBar = styled((props: MuiAppBarProps & StyledAppBarProps) => {
    const { drawerOpen, mobile, children, ...other } = props;
    return <MuiAppBar {...other}>{children}</MuiAppBar>;
})(({ theme, drawerOpen, mobile }) => ({
    zIndex: mobile ? theme.zIndex.drawer : theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(drawerOpen && {
        marginLeft: mobile ? 0 : theme.variables.drawerWidth,
        width: mobile ? "100%" : `calc(100% - ${theme.variables.drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
    backgroundColor: theme.palette.background.default,
    boxShadow: theme.shadows[0],
    borderBottom: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
}));

export const AppBar = ({ drawerOpen, children }: AppBarProps) => {
    const theme = useTheme();

    const onlyMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

    return <StyledAppBar
        drawerOpen={drawerOpen}
        mobile={onlyMediumScreen}
    >{children}</StyledAppBar>;
}