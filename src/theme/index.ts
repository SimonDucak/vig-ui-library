import { createTheme } from "@mui/material";
import { palette } from "./palette";
import { fontFamily, typography } from "./typography";
import { useComponentsTheme } from "./components";

declare module '@mui/material/styles' {
    interface VigTheme {
        variables: {
            drawerWidth: number;
            appBarHeight: number;
        };
    }

    interface Theme extends VigTheme { }

    interface ThemeOptions extends VigTheme { }
}

let theme = createTheme({
    spacing: 8,
    shape: {
        borderRadius: 8,
    },
    palette,
    typography,
    components: {
        MuiCssBaseline: {
            styleOverrides: fontFamily,
        },
    },
    variables: {
        drawerWidth: 268,
        appBarHeight: 64,
    }
});

theme = useComponentsTheme(theme); 

export default theme;