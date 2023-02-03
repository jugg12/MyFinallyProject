import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { advertisementItemRedux } from "../../interfaces";

const initialState:advertisementItemRedux = {
  id:null,
  city:"",
  sent:null,
  rooms:"",
  people:"",
  square:null,
  metro:"",
  rayon:"",
  FIO:"",
  number:"",
  mail:"",
  viber:"",
  whatsUp:"",
  workMail:"",
  dopInfo:{
    sleepPlaces:"",
    checkBoxInfo:""
  },
  description:"",
  idItem:null,
  idItemChange:null,
  length:0,
}

const advertisementAction=createSlice({
  name:"advertisement",
  initialState,
  reducers:{
    changeInfo(state,action){
      state.city=action.payload[0];
      state.sent=action.payload[1];
      state.rooms=action.payload[2];
      state.people=action.payload[3];
      state.square=action.payload[4];
      state.metro=action.payload[5];
      state.rayon=action.payload[6];
      state.FIO=action.payload[7];
      state.number=action.payload[8];
      state.mail=action.payload[9];
      state.viber=action.payload[10];
      state.whatsUp=action.payload[11];
      state.workMail=action.payload[12];
      state.dopInfo=action.payload[13];
      state.description=action.payload[14];
    },
    setLength(state,action){
      state.length = action.payload;
    },
    incrementAdvertisement(state,action){
      state.length = action.payload+1
    },
    decrementAdvertisement(state,action){
      state.length = action.payload-1
    },
    setIdItem(state,action){
      state.idItem=action.payload;
    },
    setIdItemChange(state,action){
      state.idItemChange = action.payload;
    }
  }
})

export const {changeInfo,setLength,incrementAdvertisement,setIdItem,setIdItemChange,decrementAdvertisement} = advertisementAction.actions;

export default advertisementAction.reducer;