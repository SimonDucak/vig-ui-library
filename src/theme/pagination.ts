import { Theme, createTheme } from "@mui/material";

export const injectPaginationTheme = (theme: Theme): Theme => {
    theme = createTheme(theme, {
        components: {
            MuiPagination: {
                defaultProps: {
                    shape: "rounded",
                    color: "primary",
                    boundaryCount: 2,
                }
            }
        }
    });

    return theme;
};