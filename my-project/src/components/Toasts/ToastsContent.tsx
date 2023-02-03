import React from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Успех
export function notifyConfirm(){
  toast.success("Ваше объявление теперь находится на рассмотрении Администрации",{
    position:"top-center",
    closeOnClick:true,
    pauseOnHover:false,
    autoClose:2000,
  });
}

export function notifySuccess(){
  toast.success("Ваше объявление теперь находится на рассмотрении Администрации",{
    position:"top-center",
    closeOnClick:true,
    pauseOnHover:false,
    autoClose:2000,
  });
}

export function notifySuccessEditing(){
  toast.success("Редактирование завершено",{
    position:"top-center",
    closeOnClick:true,
    pauseOnHover:false,
    autoClose:1500,
  });
}

export function notifySuccessFavourites(){
  toast.success("Объявление добавлено в Ваши закладки",{
    position:"top-center",
    closeOnClick:true,
    pauseOnHover:false,
    autoClose:2000,
  });
}
// Доп. информация
export function notifyEditingAdvertisement(){
  toast.info("Ваше объявление изменено",{
    position:"top-center",
    closeOnClick:true,
    pauseOnHover:false,
    autoClose:2000,
  });
}

export function notifyInfoPrice(){
  toast.info("Для поиска, по заданному значению стоимости, необходимо заполнить оба поля ввода.",{
    position:"top-center",
    closeOnClick:true,
    pauseOnHover:false,
    autoClose:3000,
  });
}

// Удаление

export function notifyDeleteFavourites(){
  toast.success("Объявление удалено из Ваших закладок",{
    position:"top-center",
    closeOnClick:true,
    pauseOnHover:false,
    autoClose:2000,
  });
}

export function notifyDeleteAdvertisement(){
  toast.success("Вы успешно удалили данное объявление",{
    position:"top-center",
    closeOnClick:true,
    pauseOnHover:false,
    autoClose:2000,
  });
}

// Ошибки
export function notifyErrorCity(){
  toast.error("Необходимо выбрать город",{
    position:"top-center",
    closeOnClick:true,
    pauseOnHover:false,
    autoClose:2000,
  });
}

export function notifyErrorAuthorization(){
  toast.error("Необходимо авторизоваться",{
    position:"top-center",
    closeOnClick:true,
    pauseOnHover:false,
    autoClose:2000,
  });
}

export function notifyErrorAddAdvertisement(){
  toast.error("Необходимо разрешение экрана > 1300px",{
    position:"top-center",
    closeOnClick:true,
    pauseOnHover:false,
    autoClose:2000,
  });
}