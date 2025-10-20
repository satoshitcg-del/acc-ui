export interface IFormBundle {
  id: number;
  product_id: string | number;
  prefixes: string;
  discounts: string[];
  deposit: number;
  client_name: string;
  agent_id: string;
  auto_product?: string;
  fiat_currency_id: string;
  cryptocurrency_id: string;
  opening_date: string;
  closing_date: string;
  note: string;
  type?: string;
  sync_loading?: boolean;
  is_sync_status?: boolean;
  is_sync_icon?: boolean;
  is_fix_currency?: boolean;
  deposit_currency?: string;
}

export interface ITempPrefixs {
  product_link_id: string;
  product_link_name: string;
}

export interface ITempProduct {
  product_id: string;
  product_name: string;
}
