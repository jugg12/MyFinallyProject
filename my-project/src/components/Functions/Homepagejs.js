import { cityIn } from 'lvovich';
import { clearFilter, setCity, setCityRayonHomePage, setRooms, setSort } from '../../store/slices/FilterSlice';
import qs from "qs";

export function defaultClickDropDown(){ // Кастомный выпадающий список
  document.querySelectorAll(".dropdown").forEach(function(dropdownWrapper){
    const listitemclick=dropdownWrapper.querySelectorAll(".dropdown__item");
    const btn = dropdownWrapper.querySelector(".List");
    const btnclick = dropdownWrapper.querySelector(".List__dropdown");
    const input =  dropdownWrapper.querySelector(".drodown__item__hiden");
    
    if(btnclick!==null){
      btnclick.classList.toggle("visible");
    } 
    listitemclick.forEach(function(listitem){
      listitem.addEventListener("click",(e)=>{
        e.stopPropagation();
        btn.innerText=listitem.innerText ;
        btnclick.classList.remove("visible");
        input.value=btn.textContent;
      })
    })
    document.addEventListener('click',(e)=>{
      if(e.target !== btn && btnclick!==null){
        btnclick.classList.remove("visible");
      }
    })
  })
}

/////////////////////////////////////////////////////////////////////////////////////

export function MouseLeaveMouseEnterList(dispatch,filterFromHome){ // Наведение на блок для выпадающего списка
  document.querySelectorAll(".dropdown4").forEach(function(dropdownWrapper){
    const listitemclick=dropdownWrapper.querySelectorAll(".dropdown__item");
    const items = dropdownWrapper.querySelector(".Items");
    const btnclickForMore = dropdownWrapper.querySelector(".List__dropdown__custom");
    const rooms = document.querySelector(".rooms");
    const btnclickForRooms = dropdownWrapper.querySelector(".List__dropdown");
    
    if(dispatch){
      if (btnclickForRooms!==null){
        btnclickForRooms.classList.add("visible");
      }
      listitemclick.forEach(function(listitem){
        listitem.addEventListener("click",(e)=>{
          rooms.textContent=`Квартиры в ${cityIn(listitem.id)}`;
          dispatch(setCity(listitem.id));
          dispatch(setRooms(""));
          
          dispatch(clearFilter(filterFromHome));
          btnclickForRooms.classList.remove("visible");
        })
      })
      dropdownWrapper.addEventListener('mouseleave',(e)=>{
        if(btnclickForRooms!==null && (e.target!==items || e.target!==dropdownWrapper)){
          btnclickForRooms.classList.remove("visible");
        }
      })
    }
    else{
      if(btnclickForMore!==null){
        btnclickForMore.classList.toggle("List__dropdown__custom__visible");
        listitemclick.forEach(function(listitem){
          listitem.addEventListener("click",()=>{ //Клик на элемент в листе
            btnclickForMore.classList.remove("List__dropdown__custom__visible");
          })
        })
      }
    }
  })  
}

/////////////////////////////////////////////////////////////////////////////////////

export function FilterFromHomePage(dispatch,navigate){ // Фильтр на главной странице по городу и району
  document.querySelectorAll(".dropdown").forEach(function(dropdownWrapper){
    const listitemclick=dropdownWrapper.querySelectorAll(".dropdown__item");
    const btn = dropdownWrapper.querySelector(".List");
    const btnclick = dropdownWrapper.querySelector(".List__dropdown");
    const input =  dropdownWrapper.querySelector(".drodown__item__hiden");
    const input2 =  document.getElementById("cityInput");
    const input3 =  document.getElementById("cityInput2");
    const dopinfo__pervogo__delenia = document.querySelector(".dopinfo__pervogo__delenia");
    const dopkol_vo__predlojeniy = document.querySelector(".dopkol-vo__predlojeniy");
    
    if(btnclick!==null){
      btnclick.classList.toggle("visible");
    }
    listitemclick.forEach(function(listitem){
      listitem.addEventListener("click",(e)=>{
        e.stopPropagation();
        btn.textContent=listitem.textContent ;
        btnclick.classList.remove("visible");
        input.value=btn.textContent;
        if (input3!==null){
          if (input3 .value=="")
          {
            dopinfo__pervogo__delenia.textContent = `Аренда квартир в ${cityIn(input2.value)}`;
            dopkol_vo__predlojeniy.textContent=`Предложений в ${cityIn(input2.value)}`;
            const item = [input2.value,input3.value]
            dispatch(setCityRayonHomePage(item));
            const queryString = (qs.stringify({
              cityFilter:item[0],
            }))
            navigate(`?${queryString}`)
          }
          else {
            const item = [input2.value,input3.value];
            dopinfo__pervogo__delenia.textContent = `Аренда квартир в ${cityIn(input2.value)} в ${cityIn(input3.value)} районе`;
            dopkol_vo__predlojeniy.textContent=`Предложений в ${cityIn(input2.value)}`;
            dispatch(setCityRayonHomePage(item))
            const queryString = (qs.stringify({
              cityFilter:item[0],
              rayonFilter:item[1]
            }))
            navigate(`?${queryString}`)
          }
        }
      })
    })
    document.addEventListener('click',(e)=>{
      if(e.target !== btn && btnclick!==null){
        btnclick.classList.remove("visible");
      }
    })
  })
 }

/////////////////////////////////////////////////////////////////////////////////////

export function UserInfoClick(login,setModalActive,navigate){ // Нажатие на поле информации о пользователе(Выйти,редактирование,объявления)
  document.querySelectorAll(".dropdown2").forEach(function(dropdownWrapper){
    const listitemclick=dropdownWrapper.querySelectorAll(".dropdown__item");
    const btn = dropdownWrapper.querySelector(".List");
    const btnclick = dropdownWrapper.querySelector(".List__dropdown");
    btnclick.classList.toggle("visible");
    listitemclick.forEach(function(listitem){
      listitem.addEventListener("click",(e)=>{
        if(listitem.textContent=="Выйти"){
          login=null;
          e.stopPropagation();
          localStorage.clear();
          window.location.reload()
          btnclick.classList.remove("visible")}
        else if(listitem.textContent=="Редактировать"){
          setModalActive(true)
        }
        else{
          navigate(`/advertisement`)
        }
      })
    })
    document.addEventListener('click',(e)=>{
      if(e.target !== btn){
        btnclick.classList.remove("visible");
      }
    })
  })
}

/////////////////////////////////////////////////////////////////////////////////////

export function sortInfo(dispatch){ //Сортировка данных на странице "Каталог"
  document.querySelectorAll(".dropdown2").forEach(function(dropdownWrapper){
    const listitemclick=dropdownWrapper.querySelectorAll(".dropdown__item");
    const btn = dropdownWrapper.querySelector(".List");
    const imgSort = dropdownWrapper.querySelectorAll(".imgSort");
    const btnclick = dropdownWrapper.querySelector(".List__dropdown");
    if(btnclick!==null){
      btnclick.classList.toggle("visible");
    }
    listitemclick.forEach(function(listitem){
      listitem.addEventListener("click",(e)=>{
        imgSort.forEach((img)=>{
          img.classList.add("active")
        });
        dispatch(setSort(listitem.textContent));
        btnclick.classList.remove("visible");
      })
    })
    document.addEventListener('click',(e)=>{
      if(e.target !== btn && btnclick!==null){
        btnclick.classList.remove("visible");
      }
    })
  
  })
}






  
  
  
   
      
  
   