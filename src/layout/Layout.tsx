import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { ListItem as MuiListItem, useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { AppBar } from '../components/AppBar';
import {
    IoMenuOutline,
    IoChevronForwardCircleOutline,
    IoChevronBackCircleOutline,
    IoNotificationsOutline,
    IoLogOutOutline,
} from "react-icons/io5";
import { Drawer, DrawerHeader } from '../components/Drawer';
import { Logo } from '../components/Logo';
import { useNavigate, useMatch } from "react-router-dom";
import { Route, useRouter, routes } from '../router/router';

export type LayoutProps = {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const theme = useTheme();

    const onlyMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

    const onlySmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const [open, setOpen] = React.useState(!onlyMediumScreen);

    const { currentRoute } = useRouter();

    const getContentWidth = (): string => {
        if (onlyMediumScreen) return "100vw";
        if (open) return `calc(100vw - ${theme.variables.drawerWidth}px)`;
        return `calc(100vw - ${theme.spacing(7) + 1}px)`;
    }

    return (
        <Box sx={{ display: 'flex' }} height="100vh" overflow="hidden">
            <AppBar drawerOpen={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => setOpen(true)}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && !onlyMediumScreen && { display: 'none' }),
                        }}
                    >
                        <IoMenuOutline />
                    </IconButton>

                    <Typography variant="h6" sx={{ flexGrow: 1 }} noWrap component="h6">
                        {currentRoute?.name}
                    </Typography>

                    <Box sx={{ display: "flex", gap: theme.spacing(1) }}>
                        {!onlySmallScreen && <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='subtitle2' style={{ lineHeight: 1 }}>
                                Kooperativa s.r.o.
                            </Typography>

                            <Typography variant='body2'>
                                simon@ecoding.sk
                            </Typography>
                        </Box>}

                        <Box sx={{ display: "flex" }}>
                            <IconButton color="primary">
                                <IoLogOutOutline />
                            </IconButton>

                            <IconButton color="primary">
                                <IoNotificationsOutline />
                            </IconButton>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer open={open} onClose={() => setOpen(false)}>
                <DrawerHeader>
                    {open && <div style={{ position: "absolute", left: theme.spacing(1) }}>
                        <Logo />
                    </div>}
                    <IconButton onClick={() => setOpen(false)}>
                        {theme.direction === 'rtl' ?
                            <IoChevronForwardCircleOutline /> :
                            <IoChevronBackCircleOutline />
                        }
                    </IconButton>
                </DrawerHeader>

                <Divider />

                <List>
                    {
                        Object.values(routes).map((definition, index) => <ListItem
                            key={index + 1}
                            open={open}
                            {...definition}
                        ></ListItem>)
                    }
                </List>

                <Divider />

                <div style={{ flexGrow: 1 }}></div>

                <Divider />

                {open && <div>
                    <Typography
                        whiteSpace="wrap"
                        textAlign="center"
                        variant="body2"
                        p={theme.spacing(1)}
                        style={{ fontSize: 12 }}
                    >
                        © 2024 Copyright KOOPERATIVA Poisťovňa, a.s.
                        Vienna Insurance Group Všetky práva vyhradené. Web realizovala spoločnosť <br />
                        <a style={{ color: theme.palette.primary.main }} target="_blank" href="https://ecoding.sk/">
                            <strong>ECoding slovakia s.r.o.</strong>
                        </a>
                    </Typography>
                </div>}
            </Drawer>

            <Box width={getContentWidth()} component="main" sx={{ flexGrow: 1 }}>
                <DrawerHeader />
                {children}
            </Box>
        </Box>
    );
}

const ListItem = ({
    open, icon, name, path
}: Route & { open: boolean }) => {
    const theme = useTheme();

    const navigate = useNavigate();

    const active = useMatch({ path });

    return (
        <MuiListItem disablePadding sx={{ display: "block" }} onClick={() => navigate(path)}>
            <ListItemButton
                sx={{
                    minHeight: 36,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        fontSize: 20,
                        color: active ? theme.palette.primary.main : theme.palette.grey[600],
                    }}
                >
                    {icon}
                </ListItemIcon>

                <ListItemText sx={{ opacity: open ? 1 : 0 }}>
                    <Typography variant="subtitle2" style={{
                        color: active ? theme.palette.primary.main : theme.palette.text.primary,
                    }}>{name}</Typography>
                </ListItemText>
            </ListItemButton>
        </MuiListItem>
    );
}