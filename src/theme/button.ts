import { Theme, createTheme } from "@mui/material";

export const injectButtonTheme = (theme: Theme): Theme => {
    theme = createTheme(theme, {
        components: {
            MuiButton: {
                defaultProps: {
                    variant: "contained",
                    color: "primary",
                    disableElevation: true,
                }
            }
        },
        typography: {
            button: {
                textTransform: 'none',
            },
        }
    });

    return theme;
}