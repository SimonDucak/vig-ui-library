import { Box, Grid, InputAdornment, Tab, Tabs, TextField, Typography, useTheme } from "@mui/material"
import { Pagination } from "../components/Pagination"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Filter, FilterProps, FilterType } from "../components/Filter";
import { useState } from "react";
import { IoAccessibility, IoChevronForward, IoDocument, IoSearchOutline, IoSwapHorizontal } from "react-icons/io5";
import { PopupProvider } from "../components/popup/PopupProvider";

export const Requests = () => {
    const theme = useTheme();

    const [tab, setTab] = useState(1);

    const [query, setQuery] = useState({
        q: "",
        status: -1,
        requester: -1,
        client: -1,
        partnerNo: -1,
        customFilter: -1,
        customFilter1: -1,
        customFilter2: -1,
        page: 1,
        pageSize: 25,
    });

    const filterProps: FilterProps<typeof query> = {
        query,
        onQueryChange: (newQuery: typeof query) => {
            setQuery(newQuery);
        },
        filters: {
            q: {
                type: FilterType.INPUT,
                main: true,
                placeholder: "Vyhľadať žiadosť",
            },
            client: {
                type: FilterType.SELECT,
                options: [
                    { label: "John Doe", value: 1 },
                    { label: "Jane Doe", value: 2 },
                    { label: "Alice", value: 3 },
                    { label: "Bob", value: 4 },
                    { label: "Charlie", value: 5 },
                    { label: "David", value: 6 },
                ],
                placeholder: "Klient",
            },
            partnerNo: {
                type: FilterType.SELECT,
                options: [
                    { label: "123456", value: 1 },
                    { label: "654321", value: 2 },
                    { label: "987654", value: 3 },
                    { label: "456789", value: 4 },
                    { label: "789456", value: 5 },
                    { label: "321654", value: 6 },
                ],
                placeholder: "Číslo partnera",
            },
            status: {
                type: FilterType.SELECT,
                options: [
                    { label: "Odoslané", value: 1 },
                    { label: "Spracovávané", value: 2 },
                    { label: "Dokončené", value: 3 },
                ],
                placeholder: "Stav žiadosti",
            },
            requester: {
                type: FilterType.SELECT,
                options: [
                    { label: "Klient", value: 1 },
                    { label: "Maklér", value: 2 },
                    { label: "Obchodník", value: 3 },
                ],
                placeholder: "Podávateľ",
            },
            customFilter: {
                type: FilterType.SELECT,
                options: [
                    { label: "123456", value: 1 },
                    { label: "654321", value: 2 },
                    { label: "987654", value: 3 },
                    { label: "456789", value: 4 },
                    { label: "789456", value: 5 },
                    { label: "321654", value: 6 },
                ],
                placeholder: "Custom Filter",
            },
            customFilter1: {
                type: FilterType.SELECT,
                options: [
                    { label: "123456", value: 1 },
                    { label: "654321", value: 2 },
                    { label: "987654", value: 3 },
                    { label: "456789", value: 4 },
                    { label: "789456", value: 5 },
                    { label: "321654", value: 6 },
                ],
                placeholder: "Custom Filter",
            },
            customFilter2: {
                type: FilterType.SELECT,
                options: [
                    { label: "123456", value: 1 },
                    { label: "654321", value: 2 },
                    { label: "987654", value: 3 },
                    { label: "456789", value: 4 },
                    { label: "789456", value: 5 },
                    { label: "321654", value: 6 },
                ],
                placeholder: "Custom Filter",
            },
        },
    };

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={(_event, value: number) => setTab(value)} aria-label="basic tabs example">
                    <Tab label="Zoznam žiadosti" value={1} />
                    <Tab label="Pridať novú žiadosť" value={2} />
                </Tabs>
            </Box>

            {tab === 1 && (
                <Box flexGrow={1} width="100%" display="flex" flexDirection="column" overflow="auto">
                    <Box p={1} px={2}>
                        <Filter {...filterProps} />
                    </Box>

                    <Box display="flex" py={1} px={2} justifyContent="flex-end">
                        <Pagination
                            totalCount={389}
                            page={query.page}
                            pageSize={query.pageSize}
                            onChange={(page: number, pageSize: number) => {
                                setQuery({ ...query, page, pageSize });
                            }}
                        />
                    </Box>

                    <Box sx={{ flexGrow: 1 }} px={2} pb={`${theme.variables.appBarHeight * 2}px`}>
                        <RequestsTable />
                    </Box>
                </Box>
            )}

            {tab === 2 && (
                <Box flexGrow={1} p={2} width="100%" display="flex" alignItems="center" flexDirection="column" overflow="auto">
                    <Box mb={2} maxWidth={768} width="100%">
                        <TextField
                            label="Vyhľadať žiadosť"
                            fullWidth
                            placeholder="Začnite písať názov žiadosti"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <IoSearchOutline />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <Grid mt={2} spacing={2} container columns={{ xs: 1, md: 2 }}>
                        <Grid py={2} borderRight={1} borderColor={theme.palette.divider} item xs={1}>
                            <Box mb={4}>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <IoSwapHorizontal size={24} color={theme.palette.text.primary} />

                                    <Typography variant="h6">
                                        Žiadosti o zmenu
                                    </Typography>
                                </Box>

                                <Typography variant="body1">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                </Typography>
                            </Box>

                            <RequestTile />
                        </Grid>

                        <Grid item xs={1}>
                            Column 2
                        </Grid>
                    </Grid>
                </Box>
            )}
        </Box>
    );
}

const RequestTile = () => {
    return (
        <Box pr={2} display="flex" alignItems={"center"}>
            <Box pr={2}>
                <IoAccessibility size={24} />
            </Box>

            <Box flexGrow={1}>
                <Typography variant="subtitle1">
                    <strong>Zmena adresy</strong>
                </Typography>

                <Typography variant="body2">
                    Donec feugiat, ipsum in iaculis consectetur, tortor odio eleifend
                </Typography>
            </Box>

            <IoChevronForward />
        </Box>
    )
}

function createData(
    name: string,
    date: string,
    status: number,
    requester: string,
    partnerNo: string,
    reason: string,
    client: string,
    clientId: string,

) {
    return { name, date, status, requester, partnerNo, reason, client, clientId };
}

const rows = [
    createData('Ziadost 1', '01.01.2021', 1, 'Alice', '987654', 'Dovod 1', 'Customer', '654321'),
    createData('Ziadost 2', '02.01.2021', 2, 'Bob', '456789', 'Dovod 2', 'Supplier', '987654'),
    createData('Ziadost 3', '03.01.2021', 3, 'Charlie', '789456', 'Dovod 3', 'Klient', '159753'),
    createData('Ziadost 4', '04.01.2021', 4, 'David', '321654', 'Dovod 4', 'Customer', '357159'),
    createData('Ziadost 5', '05.01.2021', 5, 'Emily', '654321', 'Dovod 5', 'Supplier', '753159'),
    createData('Ziadost 6', '06.01.2021', 6, 'Frank', '963258', 'Dovod 6', 'Klient', '951357'),
    createData('Ziadost 7', '07.01.2021', 7, 'Grace', '147258', 'Dovod 7', 'Customer', '357951'),
    createData('Ziadost 8', '08.01.2021', 8, 'Henry', '258369', 'Dovod 8', 'Supplier', '159357'),
    createData('Ziadost 9', '09.01.2021', 9, 'Ivy', '369147', 'Dovod 9', 'Klient', '753951'),
    createData('Ziadost 10', '10.01.2021', 10, 'Jack', '951753', 'Dovod 10', 'Customer', '951753'),
    createData('Ziadost 11', '11.01.2021', 11, 'Kate', '753951', 'Dovod 11', 'Supplier', '369147'),
    createData('Ziadost 12', '12.01.2021', 12, 'Liam', '357159', 'Dovod 12', 'Klient', '258369'),
    createData('Ziadost 13', '13.01.2021', 13, 'Mia', '159357', 'Dovod 13', 'Customer', '147258'),
    createData('Ziadost 14', '14.01.2021', 14, 'Nathan', '951357', 'Dovod 14', 'Supplier', '963258'),
    createData('Ziadost 15', '15.01.2021', 15, 'Olivia', '753159', 'Dovod 15', 'Klient', '654321'),
    createData('Ziadost 16', '16.01.2021', 16, 'Patrick', '357951', 'Dovod 16', 'Customer', '321654'),
    createData('Ziadost 17', '17.01.2021', 17, 'Quinn', '159753', 'Dovod 17', 'Supplier', '789456'),
    createData('Ziadost 18', '18.01.2021', 18, 'Rachel', '951753', 'Dovod 18', 'Klient', '456789'),
    createData('Ziadost 19', '19.01.2021', 19, 'Samuel', '369147', 'Dovod 19', 'Customer', '987654'),
    createData('Ziadost 20', '20.01.2021', 20, 'Tiffany', '753951', 'Dovod 20', 'Supplier', '123456')
];

export default function RequestsTable() {
    const { addPopup } = PopupProvider.usePopups();

    const addNewPopup = (id: string) => {
        addPopup({
            id: id,
            name: "Popup name",
            body: (<div>popup body {id}</div>),
            data: {},
            title: `Popup title ${id}`,
            icon: <IoDocument />
        })
    }

    return (
        <TableContainer>
            <Table sx={{ minWidth: 900 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Názov</TableCell>
                        <TableCell>Dátum</TableCell>
                        <TableCell>Stav</TableCell>
                        <TableCell>Podávateľ</TableCell>
                        <TableCell>Číslo partnera</TableCell>
                        <TableCell>Dôvod</TableCell>
                        <TableCell>Klient</TableCell>
                        <TableCell>ID Klienta</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow onClick={() => addNewPopup(index.toString())} key={row.name}>
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.status}</TableCell>
                            <TableCell>{row.requester}</TableCell>
                            <TableCell>{row.partnerNo}</TableCell>
                            <TableCell>{row.reason}</TableCell>
                            <TableCell>{row.client}</TableCell>
                            <TableCell>{row.clientId}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}