import { useTheme } from '@mui/material/styles';
import { Box, MenuItem, Pagination as MuiPagination, PaginationProps as MuiPaginationProps, Select, Typography } from "@mui/material"

export type PaginationProps = MuiPaginationProps;

export const Pagination = (props: MuiPaginationProps) => {
    const theme = useTheme();

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: theme.spacing(1) }}>
            <Typography variant="body2">Page</Typography>

            <Select value={1} size="small" sx={{ boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 } }}>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
            </Select>

            <Typography variant="body2">Rows Per Page</Typography>

            <Select value={25} size="small" sx={{ boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: 0 } }}>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
            </Select>

            <Typography variant="body2">1 - 50 of 389</Typography>

            <MuiPagination {...props} />
        </Box>
    )
}