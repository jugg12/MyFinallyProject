import {configureStore} from "@reduxjs/toolkit"
import filter from "./slices/FilterSlice";
import favouritesAction from "./actions/favouritesAction";
import advertisementAction from "./actions/advertisementAction";

const store = configureStore({
  reducer: { 
    filter,
    favouritesAction,
    advertisementAction,
    }
})

export default store
