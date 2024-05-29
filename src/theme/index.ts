import { createTheme } from "@mui/material";
import { palette } from "./palette";
import { fontFamily, typography } from "./typography";
import { injectTableTheme } from "./table";
import { injectPaginationTheme } from "./pagination";
import { injectButtonTheme } from "./button";
import { injectTextFieldTheme } from "./textField";

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
        MuiTextField: {
            variants: [
                {
                    props: { variant: "filled" },
                    style: {
                        "& .MuiInputBase-input": {
                            backgroundColor: 'black',
                            borderRadius: 8,
                        },
                    },
                },
            ],
        }
    },
    variables: {
        drawerWidth: 268,
        appBarHeight: 64,
    }
});



theme = injectTableTheme(theme);
theme = injectPaginationTheme(theme);
theme = injectButtonTheme(theme);
theme = injectTextFieldTheme(theme);   

export default theme;