import { configureStore } from "@reduxjs/toolkit";
import currenciesReducer from "./CurrenciesSlice";
import brandsReducer from "./BrandsSlice";
import countriesReducer from "./CountriesSlice";
import policiesReducer from "./PoliciesSlice";
import proposalsReducer from "./ProposalsSlice"
import authReducer from "./AuthSlice";
import subscribersReducer from "./SubscribersSlice";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    currencies: currenciesReducer,
    brands: brandsReducer,
    countries: countriesReducer,
    proposals: proposalsReducer,
    subscribers: subscribersReducer,
    policies: policiesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

