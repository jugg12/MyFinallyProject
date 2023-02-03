
import {createSlice,PayloadAction} from "@reduxjs/toolkit"
import { FilterPropsRedux } from "../../interfaces"


const initialState:FilterPropsRedux = {
  category : 1,
  categoryInfoId : 1,
  sort:"По умолчанию",
  filterAll:{
    rayon:"Выберите",
    rooms:"Выберите",
    priceMin:null,
    priceMax:null,
    sleepPlaces:"Выберите",
    metro:"Выберите",
    inputCheckboxInfo:"",
    city:"Выберите"
  },
  cityRayon:{
    city:"Минск",
    rayon:"",
    length:null,
  },
  city: "Минск",
  Rooms:"Квартиры на сутки"
}

const FilterSlice = createSlice({
  name:"filter",
  initialState,
  reducers:{
    setCategoryId(state,action){
      state.category = action.payload
    },
    setCategoryInfoId(state,action){
      state.categoryInfoId = action.payload
    },
    setCity(state,action){
      state.city = action.payload
    },
    setRooms(state,action){
      state.Rooms = action.payload
    },
    setFilterAll(state,action){
      state.filterAll={
        rayon:action.payload[0],
        rooms:action.payload[1],
        priceMin:action.payload[2],
        priceMax:action.payload[3],
        sleepPlaces:action.payload[4],
        metro:action.payload[5],
        inputCheckboxInfo:action.payload[6],
        city:action.payload[7]
      }
    },
    setCityRayonHomePage(state,action){
      state.cityRayon={
        city:action.payload[0],
        rayon:action.payload[1],
        length:action.payload[2]
      }
    },
    setSort(state,action){
      state.sort = action.payload
    },
    clearFilter(state){
      state.filterAll=initialState.filterAll
    }
  }
  }  
)
export const {setCategoryId,setRooms,setCategoryInfoId,setCityRayonHomePage,setSort,setFilterAll,setCity,clearFilter} = FilterSlice.actions

export default FilterSlice.reducer;