import { useTheme } from '@mui/material/styles';
import { Box, MenuItem, Pagination as MuiPagination, PaginationProps as MuiPaginationProps, Select, SelectChangeEvent, Typography } from "@mui/material";

export type PaginationProps = Omit<MuiPaginationProps, "count" | "onChange"> & {
    pageSizeOptions?: number[];
    pageSize?: number;
    totalCount: number;
    page: number;
    onChange: (page: number, pageSize: number) => void;
}

export const Pagination = ({ totalCount, page, onChange, pageSize, ...restProps }: PaginationProps) => {
    const theme = useTheme();

    const pageSizeOptions = restProps.pageSizeOptions || [25, 50, 100];

    const currentPageSize = pageSize || pageSizeOptions[0];

    const count = Math.ceil(totalCount / currentPageSize);

    const pageOptions = Array.from({ length: count }, (_, i) => i + 1);

    return (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", flexWrap: "wrap", gap: theme.spacing(1) }}>
            <Box display={{ xs: "none", md: "flex" }} alignItems="center">
                <Typography variant="body2">Page</Typography>

                <Select
                    size="small"
                    sx={{ boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: "0!important" } }}
                    value={page}
                    onChange={(event: SelectChangeEvent<number>) => {
                        onChange(Number(event.target.value), currentPageSize);
                    }}
                >
                    {
                        pageOptions.map((option) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))
                    }
                </Select>

                <Typography variant="body2">Rows Per Page</Typography>

                <Select
                    size="small"
                    sx={{ boxShadow: 'none', '.MuiOutlinedInput-notchedOutline': { border: "0!important" } }}
                    value={currentPageSize}
                    onChange={(event: SelectChangeEvent<number>) => {
                        onChange(page, Number(event.target.value));
                    }}
                >
                    {
                        pageSizeOptions.map(option => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))
                    }
                </Select>

                <Typography variant="body2">{(page - 1) * currentPageSize} - {page * currentPageSize} of {totalCount}</Typography>
            </Box>

            <MuiPagination
                onChange={(_event, p) => {
                    onChange(p, currentPageSize);
                }}
                count={count} {...restProps}
            />
        </Box>
    )
}