import { setIdItem, setIdItemChange } from "../../store/actions/advertisementAction";

export function clickDeleteAdvertisement (value,dispatch){ //Клик на удаление
  const deleteInfoConfirm = confirm("Вы уверены, что хотите удалить данное объявление?");
  if(deleteInfoConfirm===true){
    dispatch(setIdItem(value));
  }
}

export function clickChangeAdvertisement(value,dispatch,setModalAdvertisements){ //Клик на изменение
    dispatch(setIdItemChange(value));
    setModalAdvertisements(true);
  }