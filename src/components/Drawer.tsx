import {
    CSSObject,
    Theme,
    styled,
    Drawer as MuiDrawer,
    DrawerProps as MuiDrawerProps,
    useMediaQuery,
    useTheme,
    Box,
} from "@mui/material";

const openedMixin = (theme: Theme): CSSObject => ({
    width: theme.variables.drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

export const DrawerHeader = styled('div', {})(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),

    ...theme.mixins.toolbar,
}));

const DesktopStyledDrawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open'
})(
    ({ theme, open }) => ({
        width: theme.variables.drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export type DrawerProps = {
    open: boolean;
    children: React.ReactNode;
} & MuiDrawerProps;

export const Drawer = ({ children, ...restProps }: DrawerProps) => {
    const theme = useTheme();

    const onlyMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

    if (onlyMediumScreen) {
        return <MuiDrawer variant="temporary" {...restProps}>
            <Box maxWidth={theme.variables.drawerWidth}>
                {children}
            </Box>
        </MuiDrawer>;
    }

    return <DesktopStyledDrawer variant="permanent" {...restProps}>
        {children}
    </DesktopStyledDrawer>;
}