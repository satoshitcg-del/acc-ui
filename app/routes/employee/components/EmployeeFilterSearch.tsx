import { Box, Button, TextField } from "@mui/material";
import { t } from "i18next";

interface ComponentProps {
    filterSearchTable: any;
    setFilterSearchTable: any;
    handleFilterSearchTable: any;
    handleClearFilterSearchTable: any;
}

export default function Component(props: ComponentProps) {
    const { filterSearchTable, setFilterSearchTable, handleFilterSearchTable, handleClearFilterSearchTable } = props;

    return (
        <Box
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    justifyContent: 'flex-end',
                    width: '100%',
                }}
            >
                <TextField
                    data-testid="employee-search-username-text"
                    id="username-input"
                    label={t("placeholder.username")}
                    size="small"
                    fullWidth
                    onChange={(e) => setFilterSearchTable({ ...filterSearchTable, username: e.target.value })}
                    value={filterSearchTable.username}
                />
                <TextField
                    data-testid="employee-search-customername-text"
                    id="customer-name-input"
                    label={t("placeholder.employee-name")}
                    size="small"
                    fullWidth
                    onChange={(e) => setFilterSearchTable({ ...filterSearchTable, employeeName: e.target.value })}
                    value={filterSearchTable.employeeName}
                />
                <TextField
                    data-testid="employee-search-telegram-text"
                    id="telegram-input"
                    label={t("placeholder.telegram")}
                    size="small"
                    fullWidth
                    onChange={(e) => setFilterSearchTable({ ...filterSearchTable, telegram: e.target.value })}
                    value={filterSearchTable.telegram}
                />
                <TextField
                    data-testid="employee-search-email-text"
                    id="email-input"
                    label={t("placeholder.email")}
                    size="small"
                    fullWidth
                    onChange={(e) => setFilterSearchTable({ ...filterSearchTable, email: e.target.value })}
                    value={filterSearchTable.email}
                />
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, }}>
                    <Button
                        data-testid="employee-search-button"
                        variant="contained"
                        color="primary"
                        type="submit"
                        sx={{
                            width: "7%",
                            height: "40px",
                            marginRight: "5px",
                            marginLeft: "5px",
                        }}
                        onClick={() => handleFilterSearchTable()}
                    >
                        {t("button.search")}
                    </Button>
                    <Button
                        disabled={Object.values(filterSearchTable).every(value => value === '')}
                        data-testid="employee-clear-button"
                        variant="contained"
                        color="secondary"
                        sx={{
                            width: "7%",
                            height: "40px",
                            marginRight: "5px",
                            marginLeft: "5px",
                        }}
                        onClick={() => handleClearFilterSearchTable()}
                    >
                        {t("button.clear")}
                    </Button>
                </Box>
            </Box>

        </Box>
    );
}

Component.displayName = 'EmployeeFilterSearch';
