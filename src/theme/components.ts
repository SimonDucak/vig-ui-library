import { Theme, createTheme, tableCellClasses } from "@mui/material";

export const useComponentsTheme = (theme: Theme): Theme => {
    theme = createTheme(theme, {
        components: {
            MuiButton: {
                defaultProps: {
                    variant: "contained",
                    color: "primary",
                    disableElevation: true,
                }
            },
            MuiPagination: {
                defaultProps: {
                    shape: "rounded",
                    color: "primary",
                    boundaryCount: 2,
                }
            },
            MuiTableRow: {
                styleOverrides: {
                    root: {
                        [`& .${tableCellClasses.root}`]: {
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            padding: theme.spacing(1.5) + " " + theme.spacing(2),
                        }
                    }
                }
            },
            MuiTextField: {
                variants: [
                    {
                        props: { variant: "filled" },
                        style: {
                            "& .MuiFilledInput-root": {
                                backgroundColor: theme.palette.grey[200],
                                borderRadius: `${theme.shape.borderRadius}px`,
                                border: `1px solid ${theme.palette.divider}`,
                            },
                            "& :before, & :after": {
                                display: "none",
                            },
                            "& .MuiInputLabel-root": {
                                color: theme.palette.text.secondary,
                                "&.Mui-focused": {
                                    color: theme.palette.text.secondary,
                                }
                            },
                        },
                    },
                ],
            },
            MuiCheckbox: {
                styleOverrides: {
                    root: {
                        padding: theme.spacing(0.75),
                        color: theme.palette.grey[400],
                    }
                },
            },
            MuiRadio: {
                styleOverrides: {
                    root: {
                        padding: theme.spacing(0.75),
                        color: theme.palette.grey[400],
                    }
                },
            },
        },
        typography: {
            button: {
                textTransform: 'none',
            },
        },
    });
    
    return theme;
}