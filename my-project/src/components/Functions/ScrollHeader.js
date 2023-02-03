 export default function ScrollHeader(lengthFavourites,heart){
  //  Появление шапки
  window.onscroll=() => {
    const header = document.querySelector("header");
    const menu = document.querySelector(".head");
    if (header){
      if(window.pageYOffset>45 && window.innerWidth<1151){
        menu.classList.add("fixed");
      }
      else{
        menu.classList.remove("fixed");
      }

      if(window.pageYOffset > 95){
        header.classList.add("UpNav__fixed");
      }
      else{
        header.classList.remove("UpNav__fixed");
      }
      
      if(lengthFavourites>0 && heart!==null) { //Пульсация сердца
        heart.classList.add("pulse");
      }
      else if(lengthFavourites==0 && heart!==null){
        heart.classList.remove("pulse");
      }
    }
  }
}