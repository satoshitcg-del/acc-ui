import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { SelectChangeEvent } from '@mui/material';
import { useRecoilState } from 'recoil';
import { TriggerLang } from '@/core/storerecoil';
import { t } from 'i18next';
interface IMonth {
    month_number: number;
    month_name: string;
}


interface IYear {
    year_number: number;
    year_name: string;
}

export const useTranslate = () => {
    const TranslateMonth = (month_number: number): string => {
        switch (month_number) {
            case 0:
                return t('select.all');
            case 1:
                return t('month.jan');
            case 2:
                return t('month.feb');
            case 3:
                return t('month.mar');
            case 4:
                return t('month.apr');
            case 5:
                return t('month.may');
            case 6:
                return t('month.jun');
            case 7:
                return t('month.jul');
            case 8:
                return t('month.aug');
            case 9:
                return t('month.sep');
            case 10:
                return t('month.oct');
            case 11:
                return t('month.nov');
            case 12:
                return t('month.dec');
            default:
                return "";
        }
    }
    return { TranslateMonth }
}


export const useOnetimeCalendar = () => {
    const { TranslateMonth } = useTranslate()
    const [triggerTriggerLang, setTriggerLang] = useRecoilState(TriggerLang);
    const currentYearAD = dayjs().year();
    const [month, setMonth] = useState<IMonth[]>([]);
    const [selectMonth, setSelectMonth] = useState<string | number>(0);
    const [selectYear, setSelectYear] = useState<string | number>(0);
    const [selectMonthBillingNote, setSelectMonthBillingNote] = useState<string | number>(0);
    const [selectYearBillingNote, setSelectYearBillingNote] = useState<string | number>(0);
    const [years, setYears] = useState<IYear[]>([]);

    useEffect(() => {
        fetchCurrentDate()
        yearOptions();
    }, []);

    const fetchCurrentDate = () => {
        setSelectMonth(0);
        setSelectYear(0);
        setSelectMonthBillingNote(0);
        setSelectYearBillingNote(0);
    }

    useEffect(() => {
        monthOptions();
        yearOptions();
    }, [selectYear, triggerTriggerLang]);

    const monthOptions = () => {
        const months = Array.from({ length: 12 }, (_, i) => {
            return { month_number: i + 1, month_name: TranslateMonth(i + 1) }
        });

        months.unshift({ month_number: 0, month_name: TranslateMonth(0) });
        setMonth(months)
    }

    const yearOptions = () => {
        const yearList = Array.from({ length: 5 }, (_, i) => {
            const year = currentYearAD - i;
            return { year_number: year, year_name: year.toString() };
        });
        yearList.unshift({ year_number: 0, year_name: t('select.all') });
        setYears(yearList);
    }

    const handleMonthChange = (event: SelectChangeEvent) => {
        setSelectMonth(event.target.value)
    }

    const handleYearChange = (event: SelectChangeEvent) => {
        setSelectYear(event.target.value)
        setSelectMonth(0)
    }

    const handleMonthBillingNoteChange = (event: SelectChangeEvent) => {
        setSelectMonthBillingNote(event.target.value)
    }

    const handleYearBillingNoteChange = (event: SelectChangeEvent) => {
        setSelectYearBillingNote(event.target.value)
    }

    const handleClearSelect = () => {
        fetchCurrentDate()
    }

    return { month, years, selectMonth, selectYear, selectMonthBillingNote, selectYearBillingNote, handleClearSelect, handleMonthChange, handleYearChange, handleMonthBillingNoteChange, handleYearBillingNoteChange }
}