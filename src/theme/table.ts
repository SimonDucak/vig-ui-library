import { Theme, createTheme, tableCellClasses } from "@mui/material";

export const injectTableTheme = (theme: Theme): Theme => {
    theme = createTheme(theme, {
        components: {
            MuiTableRow: {
                styleOverrides: {
                    root: {
                        [`& .${tableCellClasses.root}`]: {
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            padding: theme.spacing(1.5) + " " + theme.spacing(2),
                        }
                    }
                }
            }
        }
    });

    return theme;
};