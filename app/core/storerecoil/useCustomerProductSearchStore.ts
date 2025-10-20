import { create } from 'zustand'

interface SearchCustomerProductState {
    productName: string
    prefix: string
    clientName: string
    status: string
}

interface CustomerProductSearch {
    searchCustomerProduct: SearchCustomerProductState
    setSearchCustomerProduct: (data: Partial<SearchCustomerProductState>) => void
    resetSearchCustomerProduct: () => void
}

const initialSearchCustomerProductState: SearchCustomerProductState = {
    productName: '',
    prefix: '',
    clientName: '',
    status: 'ALL',
}

export const useCustomerProductSearchStore = create<CustomerProductSearch>((set) => ({
    searchCustomerProduct: {
        productName: '',
        prefix: '',
        clientName: '',
        status: 'ALL',
    },
    setSearchCustomerProduct: (data) =>
        set((state) => ({
            searchCustomerProduct: { ...state.searchCustomerProduct, ...data },
        })),
    resetSearchCustomerProduct: () =>
        set({
            searchCustomerProduct: { ...initialSearchCustomerProductState },
        })
}))
