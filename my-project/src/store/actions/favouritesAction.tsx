import {createSlice,PayloadAction} from "@reduxjs/toolkit"
import { FavouritesPropsRedux } from "../../interfaces";


const initialState:FavouritesPropsRedux={
  length:0,
  value:null,
  valueFromFavourites:null,
  favourites:[]
}

const FavouritesAction=createSlice({
name:"FavouritesAction",
initialState,
reducers:{
  setValue(state,action){
    state.value = action.payload;
  },
  setValueFromFavourites(state,action){
    state.valueFromFavourites = action.payload;
  },
  setLengthFavourites(state,action){
    state.length = action.payload;
  },
  increment(state,action){
    state.length=action.payload+1;
  },
  decrement(state,action){
    state.length=action.payload-1;
  }
}
})

export const {setValue,setValueFromFavourites,setLengthFavourites,increment,decrement} = FavouritesAction.actions

export default FavouritesAction.reducer;