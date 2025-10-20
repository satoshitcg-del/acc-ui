import { useState } from "react";
import { IFormBundle } from "../props";
import { SelectChangeEvent } from "@mui/material";
import dayjs from "dayjs";
import PrefixService from "@/services/PrefixService";
import { useTranslation } from "react-i18next";
import { useAlertDialog } from "../../alert-dialog/useAlertDialog";
import { ProductMasterType } from "@/core/enum";

export const useFormBundle = <T extends { id: number }>(initFormBundle: T) => {
  const { t } = useTranslation()
  const { getInfoByPrefix } = PrefixService()
  const { alertError } = useAlertDialog();
  const [countID, setCountID] = useState<number>(1);
  const [formBundle, setFormBundle] = useState<T[]>([initFormBundle] as T[]);
  const [selectPrefix, setSelectPrefix] = useState(null);
  const [trigerRemoveFormBundle, setTrigerRemoveFormBundle] = useState(true);
  const addNewItem = (newItem: IFormBundle) => {
    setFormBundle([...formBundle, newItem] as T[]);
  };

  const handleAddItem = () => {
    setCountID((prevCountID) => prevCountID + 1);
    const newItem = {
      id: countID + 1,
      product_id: "",
      discounts: [],
      prefixes: "",
      deposit: 0,
      client_name: '',
      agent_id: '',
      fiat_currency_id: '',
      cryptocurrency_id: '',
      opening_date: '',
      closing_date: '',
      note: '',
      sync_loading: false,
      is_sync_prefix: false,
      is_sync_icon: false,
      is_fix_currency: false,
      currency_deposit: "USDT",
    };
    addNewItem(newItem);
  };


  const handleRemoveItem = (id: number) => {
    setFormBundle(formBundle.filter((a) => a.id !== id));
    setTrigerRemoveFormBundle(!trigerRemoveFormBundle);
  };

  const handleUpdateMultiple = (event: SelectChangeEvent, id: number) => {
    let checkDiscount = event.target.value as unknown as string[]
    checkDiscount = checkDiscount.filter(e => e !== undefined)

    setFormBundle((currentFormBundle) =>
      currentFormBundle.map((bundle) =>
        bundle.id === id
          ? { ...bundle, discounts: [...checkDiscount] }
          : bundle,
      ),
    );
  };

  const handleUpdate = (
    event: any,
    id: number,
    field: keyof IFormBundle,
  ) => {
    let value: string | number = field === "deposit" ? event?.floatValue : event?.target?.value;
    if (field === "deposit" && value === undefined) {
      value = 0;
    }
    if (field === "client_name") {
      value = event?.web ? event?.web : '';
    }
    if (field === "agent_id") {
      value = event?.agentId ? event?.agentId : '';
    }
    if (field === "prefixes" && !event?.target?.value) {
      value = event?.prefix;
    }
    if (field === "auto_product") {
      value = event?.product ? event?.product : '';
    }
    setFormBundle((currentFormBundle) =>
      currentFormBundle.map((bundle) =>
        bundle.id === id
          ? { ...bundle, [field]: value }
          : bundle
      )
    );
  };


  const handleUpdateClientName = (event: SelectChangeEvent,
    id: number,
    field: keyof IFormBundle,
  ) => {
    let client_name: string = event.target.value;
    setFormBundle((currentFormBundle) =>
      currentFormBundle.map((bundle) =>
        bundle.id === id ? { ...bundle, [field]: client_name } : bundle,
      ),
    );

  }

  const handleUpdateFiatCurrency = (
    event: SelectChangeEvent,
    id: number,
    field: keyof IFormBundle,
  ) => {
    let fiat_currency_id: string = event.target.value;
    setFormBundle((currentFormBundle) =>
      currentFormBundle.map((bundle) =>
        bundle.id === id ? { ...bundle, [field]: fiat_currency_id, discounts: [] } : bundle,
      ),
    );
  }

  const handleUpdateAutocomplete = (
    prefix_id: string,
    id: number,
    field: keyof IFormBundle,
  ) => {
    setFormBundle((currentFormBundle) =>
      currentFormBundle.map((bundle) =>
        bundle.id === id ? { ...bundle, [field]: prefix_id } : bundle,
      ),
    );
  };

  const handleUpdateProduct = (
    product_id: string,
    id: number,
    field: keyof IFormBundle,
    type?: string
  ) => {
    setFormBundle((currentFormBundle) =>
      currentFormBundle.map((bundle: any) =>
        bundle.id === id
          ? {
            ...bundle,
            [field]: product_id,
            ["prefixes"]: '',
            ["client_name"]: '',
            ["auto_product"]: '',
            ["agent_id"]: '',
            ["opening_date"]: '',
            ["sync_loading"]: false,
            ["is_sync_status"]: false,
            ["is_sync_icon"]: false,
            ["is_fix_currency"]: false,
            ["fiat_currency_id"]: '',
            ["discounts"]: type === ProductMasterType.DIRECT_API ? [] : bundle.discounts,
            type: type ?? bundle.type
          }
          : bundle
      ),
    );
  }

  const handleOpeningDate = (opening_date: string, id: number) => {
    const openingDateObject = dayjs(opening_date);
    const localOpeningDateString = openingDateObject.format('YYYY-MM-DD');
    const bundle: any = formBundle.find(bundle => bundle.id === id);

    // Check if closing date exists and if it's before the opening date
    const closingDateObject = dayjs(bundle?.closing_date);
    if (closingDateObject.isValid() && closingDateObject.isBefore(openingDateObject)) {
      // If closing date is before opening date, clear the closing date
      setFormBundle((currentFormBundle) =>
        currentFormBundle.map((bundle) =>
          bundle.id === id ? { ...bundle, opening_date: localOpeningDateString, closing_date: "" } : bundle
        )
      );
    } else {
      // If closing date is after or equal to opening date, update only the opening date
      setFormBundle((currentFormBundle) =>
        currentFormBundle.map((bundle) =>
          bundle.id === id ? { ...bundle, opening_date: localOpeningDateString } : bundle
        )
      );
    }
  };

  const handleClosingDate = (closing_date: any, id: number) => {
    const dateObject = dayjs(closing_date);
    const localDateString = dateObject.format('YYYY-MM-DD');
    setFormBundle((currentFormBundle) =>
      currentFormBundle.map((bundle) =>
        bundle.id === id ? { ...bundle, closing_date: localDateString || "" } : bundle,
      ),
    );
  }

  const handleUpdateDescription = (
    note: any,
    id: number,
    field: keyof IFormBundle,) => {
    setFormBundle((currentFormBundle) =>
      currentFormBundle.map((bundle) =>
        bundle.id === id ? { ...bundle, [field]: note } : bundle,
      ),
    );
  };

  const handleSyncPrefix = async (prefix: string, id: number, fiatCurrency: any) => {
    try {
      setFormBundle((currentFormBundle) =>
        currentFormBundle.map((bundle) =>
          bundle.id === id
            ? {
              ...bundle,
              ["sync_loading"]: true,
            } : bundle
        )
      );
      const res: any = await getInfoByPrefix(prefix)
      const currencyId = fiatCurrency.find((currency: any) => currency.currency_name === res?.data?.currency)?._id || null;
      if (res?.data?.agentId && res?.data?.web) {
        if (res?.data.isActive) {
          setFormBundle((currentFormBundle) =>
            currentFormBundle.map((bundle) =>
              bundle.id === id
                ? {
                  ...bundle,
                  ["agent_id"]: res?.data?.agentId,
                  ["client_name"]: res?.data?.web,
                  ["opening_date"]: dayjs(new Date(res?.data?.createdDate)),
                  ["fiat_currency_id"]: currencyId,
                  ["sync_loading"]: false,
                  ["is_sync_status"]: true,
                  ["is_sync_icon"]: true,
                  ["is_fix_currency"]: true,
                } : bundle
            )
          );
        } else {
          setFormBundle((currentFormBundle) =>
            currentFormBundle.map((bundle) =>
              bundle.id === id
                ? {
                  ...bundle,
                  ["agent_id"]: '',
                  ["client_name"]: '',
                  ["opening_date"]: '',
                  ["sync_loading"]: false,
                  ["is_sync_status"]: false,
                  ["is_sync_icon"]: false,
                  ["is_fix_currency"]: false,
                } : bundle
            )
          );
          alertError(t('alert.prefix-inactive'));
        }
      } else {
        setFormBundle((currentFormBundle) =>
          currentFormBundle.map((bundle) =>
            bundle.id === id
              ? {
                ...bundle,
                ["agent_id"]: '',
                ["client_name"]: '',
                ["opening_date"]: '',
                ["sync_loading"]: false,
                ["is_sync_status"]: false,
                ["is_sync_icon"]: true,
                ["is_fix_currency"]: false,
              } : bundle
          )
        );
        alertError(t(`alert.synce-prefix-fail`));
      }
    } catch (error: any) {
      console.log(error)
      setFormBundle((currentFormBundle) =>
        currentFormBundle.map((bundle) =>
          bundle.id === id
            ? {
              ...bundle,
              ["agent_id"]: '',
              ["client_name"]: '',
              ["opening_date"]: '',
              ["sync_loading"]: false,
              ["is_sync_status"]: false,
              ["is_sync_icon"]: false,
              ["is_fix_currency"]: false,
            } : bundle
        )
      );
      if (error?.response?.data?.code) {
        alertError(t(`error.${error?.response?.data?.code}`));
      }
    }
  }

  return {
    formBundle,
    setFormBundle,
    selectPrefix,
    setSelectPrefix,
    trigerRemoveFormBundle,
    addNewItem,
    handleAddItem,
    handleRemoveItem,
    handleUpdate,
    handleUpdateMultiple,
    handleUpdateAutocomplete,
    handleUpdateProduct,
    handleOpeningDate,
    handleClosingDate,
    handleUpdateClientName,
    handleUpdateFiatCurrency,
    handleUpdateDescription,
    handleSyncPrefix,
  };
};
