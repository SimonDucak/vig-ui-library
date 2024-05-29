import { Theme, createTheme } from "@mui/material";

export const injectTextFieldTheme = (theme: Theme): Theme => {
    theme = createTheme(theme, {
        components: {
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
            }
        } 
    });

    return theme;
};