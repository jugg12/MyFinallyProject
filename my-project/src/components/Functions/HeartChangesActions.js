import { decrement, increment, setLengthFavourites, setValue, setValueFromFavourites } from "../../store/actions/favouritesAction";
import { notifyDeleteFavourites, notifyErrorAuthorization, notifySuccessFavourites } from "../Toasts/ToastsContent";

export function clickHeartDeleteFromFavourites(valueFromFavourites,lengthFavourites,dispatch){
  const heart= document.getElementById(`heart__svg-${valueFromFavourites}`)
  heart.classList.remove("active");
  dispatch(decrement(lengthFavourites));
  dispatch(setValueFromFavourites(valueFromFavourites))
}

export function clickHeartAddMainCatalog(login,id,value,item,lengthFavourites,favourites,dispatch,axios,setFavourites){
  const heart= document.getElementById(`heart__svg-${value}`);
    if (login){
      if(heart.classList.value=="heart__svg active"){ //Удаление закладки одной
        heart.classList.remove("active");
        dispatch(setValue(value));
        dispatch(decrement(lengthFavourites));
        notifyDeleteFavourites();
      }
      else{
        dispatch(increment(lengthFavourites));
        heart.classList.add("active");
        axios.patch(`/users/${id}`, favourites.length?{
          "favourites":
            [...favourites,item]
        }:{
          "favourites":
            [item]
          }
        ).catch(err => console.error(err));
        notifySuccessFavourites();
      }
    }
    else{
      notifyErrorAuthorization();
    }
}

export function clickHeartAddSecondaryCatalog(login,id,value,item,lengthFavourites,favourites,dispatch,axios,setFavourites){
  const text = document.getElementById(`textHeart-${value}`)
  const heart= document.getElementById(`heart__svg-${value}`)
  if (login){
    axios.get(`/users?login=${login}`).then((data)=>{
      if(heart.classList.value=="heart__svg active"){
        heart.classList.remove("active");
        text.textContent="В закладки";
        dispatch(setValue(value));
        dispatch(decrement(lengthFavourites));
        notifyDeleteFavourites();
      }
      else{
        dispatch(increment(lengthFavourites));
        axios.patch(`/users/${id}`, favourites.length?{
          "favourites":
            [...favourites,item]
        }:{
          "favourites":
            [item]
          }
        ).catch(err => console.error(err))
        heart.classList.add("active");
        text.textContent="Добавлено";
        notifySuccessFavourites();
      }
    })
  }
  else{
    notifyErrorAuthorization();
  }
}