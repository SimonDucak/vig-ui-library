import { Palette } from "@mui/material"
import { TypographyOptions } from "@mui/material/styles/createTypography"
import JuliRegular from "../assets/julisans-regular.woff2"
import JuliMedium from "../assets/julisans-medium.woff2"
import JuliBold from "../assets/julisans-bold.woff2"

export const typography = (palette: Palette): TypographyOptions => {
    const commonHeadline = {
        fontFamily: 'Juli, sans-serif',
        fontWeight: 700,
        color: palette.text.primary,
    }

    const commonBody = {
        fontFamily: 'Juli, sans-serif',
        fontWeight: 400,
        color: palette.text.secondary,
    }

    return {
        fontFamily: 'Juli, sans-serif',
        h1: {
            ...commonHeadline,
            fontSize: '32px',
            lineHeight: '38px',
        },
        h2: {
            ...commonHeadline,
            fontSize: '28px',
            lineHeight: '36px',
        },
        h3: {
            ...commonHeadline,
            fontSize: '25px',
            lineHeight: '32px',
        },
        h4: {
            ...commonHeadline,
            fontSize: '22px',
            lineHeight: '28px',
        },
        h5: {
            ...commonHeadline,
            fontSize: '20px',
            lineHeight: '28px',
        },
        h6: {
            ...commonHeadline,
            fontSize: '18px',
            lineHeight: '24px',
        },
        subtitle1: {
            ...commonBody,
            fontSize: '17px',
            lineHeight: '24px',
            color: palette.text.primary,
        },
        subtitle2: {
            ...commonBody,
            fontSize: '16px',
            lineHeight: '24px',
            color: palette.text.primary,
        },
        body1: {
            ...commonBody,
            fontSize: '16px',
            lineHeight: '24px',
        },
        body2: {
            ...commonBody,
            fontSize: '15px',
            lineHeight: '24px',
        },
    }
};

export const fontFamily = `
    @font-face {
    font-family: 'Juli';
    font-style: normal;
    font-display: swap;
    font-weight: 400;
    src: local('Juli'), local('Juli-Regular'), url(${JuliRegular}) format('woff2');
    unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
    }
    @font-face {
    font-family: 'Juli';
    font-style: medium;
    font-display: swap;
    font-weight: 500;
    src: local('Juli'), local('Juli-Medium'), url(${JuliMedium}) format('woff2');
    unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
    }
    @font-face {
    font-family: 'Juli';
    font-style: normal;
    font-display: swap;
    font-weight: 700;
    src: local('Juli'), local('Juli-Bold'), url(${JuliBold}) format('woff2');
    unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
    }
`