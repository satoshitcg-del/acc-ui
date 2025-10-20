import { create } from 'zustand'

interface SearchCustomerState {
    customerName: string
    username: string
    prefix: string
    telegramId: string
    email: string
    phoneNumber: string
    startDate: string
    endDate: string
    clientName: string
}

interface CustomerSearch {
    searchCustomer: SearchCustomerState
    setSearchCustomer: (data: Partial<SearchCustomerState>) => void
    resetSearchCustomer: () => void
}

const initialSearchCustomerState: SearchCustomerState = {
    customerName: '',
    username: '',
    prefix: '',
    telegramId: '',
    email: '',
    phoneNumber: '',
    startDate: '',
    endDate: '',
    clientName: '',
}

export const useCustomerSearchStore = create<CustomerSearch>((set) => ({
    searchCustomer: {
        customerName: '',
        username: '',
        prefix: '',
        telegramId: '',
        email: '',
        phoneNumber: '',
        startDate: '',
        endDate: '',
        clientName: '',
    },
    setSearchCustomer: (data) =>
        set((state) => ({
            searchCustomer: { ...state.searchCustomer, ...data },
        })),
    resetSearchCustomer: () =>
        set({
            searchCustomer: { ...initialSearchCustomerState },
        }),
}))
