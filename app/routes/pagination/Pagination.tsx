import { Pagination, Box, Typography, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useTranslation } from 'react-i18next';

const PaginationTable = (props: any) => {
    const { t } = useTranslation()
    const {
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage,
        dataAmount,
        pageAmount,
        rowAmount
    } = props

    const handleChangePage = (value: any) => {
        console.log("event", value)
        setPage(value)
    }
    const handleChangeRowsPerPage = (event: SelectChangeEvent) => {
        setRowsPerPage(event.target.value);
        // console.log("rowsPerPage", event)
        setPage(1);
    };
    return (
        <Box sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "end"
        }}>
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                paddingRight: 3
            }}>
                <Typography sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                }}>
                    {t('invoice.row-per-page')}
                </Typography>
                <FormControl sx={{
                    m: 0.5,
                    minWidth: 60,
                    '& .MuiInputBase-root': {
                        height: 32,
                    },
                }}>
                    <Select
                        data-testid="globalcomponent-pagination-litmit-select"
                        id="limit"
                        size="small"
                        value={rowsPerPage}
                        onChange={handleChangeRowsPerPage}
                        MenuProps={{
                            disableScrollLock: true,
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'left',
                            },
                            transformOrigin: {
                                vertical: 'top',
                                horizontal: 'left',
                            },
                        }}
                    >
                        <MenuItem value={50}>50</MenuItem>
                        <MenuItem value={100}>100</MenuItem>
                        <MenuItem value={150}>150</MenuItem>
                    </Select>
                </FormControl>
                <Typography sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                }}>
                    {/* {`${rowAmount == 1 ? 1 : (rowsPerPage * page) - (rowAmount == 0 ? 0 : rowsPerPage - 1) || 0}-${((rowAmount == 1 ? 1 : (rowsPerPage * page) - (rowAmount == 0 ? 0 : rowsPerPage - 1) || 0) - 1) + rowAmount || 0} of ${dataAmount || 0}`} */}
                    {`${page > 1 ? ((page - 1) * rowsPerPage + 1) : page} - ${((page - 1) * rowsPerPage) + rowAmount} of ${dataAmount}`}
                </Typography>
            </Box>
            <Pagination sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
            }}
                page={page}
                onChange={(e, value) => handleChangePage(value)}
                count={pageAmount}
                showFirstButton showLastButton
            />
        </Box>
    );
}
export default PaginationTable