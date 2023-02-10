import React,{useState,useEffect} from "react";
import { ToastContainer } from 'react-toastify';
import {Link,NavLink,useNavigate} from "react-router-dom";
import "./Header.css";
import {defaultClickDropDown, MouseLeaveMouseEnterList, UserInfoClick } from "../Functions/Homepagejs";
import axios from "../../axios";
import {Formik,Form,Field} from "formik";
import { cityIn } from 'lvovich';
import ClickCheckbox from "../Functions/ClickCheckBox";
import InputMask from 'react-input-mask';
import Modal from "../Modules/module";
import { useDispatch, useSelector } from "react-redux";
import { notifySuccess, notifyErrorAuthorization, notifySuccessEditing, notifyErrorAddAdvertisement } from "../Toasts/ToastsContent";
import { setRooms } from "../../store/slices/FilterSlice";
import { advertisementItem, cities } from "../../interfaces";
import { validationSchemaAdvertisements } from "../../ValidationSchema";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination,Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { incrementAdvertisement, setLength } from "../../store/actions/advertisementAction";
import { FileObjectAdvertisement, OwnerImgAdvertisement, UserImg } from "../Functions/btnChooseFile";
import { setLengthFavourites } from "../../store/actions/favouritesAction";
import { downLoadImgAdvertisements, downLoadImgOwner, downLoadImgUser } from "../HandlersOnChanges/handleOnChange";
import UserSkeleton from "../Skeletons/userSkeleton";
import uniqid from 'uniqid';
import ScrollHeader from "../Functions/ScrollHeader";
import burgerMenu from "../Functions/BurgerMenuClick";


const Header = () => {
  const[modalUserChange,setModalUserChange] = useState<boolean>(false);
  const[modalAdvertisements,setModalAdvertisements] = useState<boolean>(false);
  const navigate=useNavigate();
  let login=localStorage.getItem("login");
  let id = localStorage.getItem("id");
  const [Login,setLogin]=useState<boolean>(true);
  const [imgUrl,setImgUrl] = useState <any>();
  const [imgUrl2,setImgUrl2] = useState <any>();
  const [imgUrlUser,setimgUrlUser] = useState <any>();
  const [favourites,setFavourites] = useState<number>(null);
  const [Loading,setLoading] = useState<any>(true);
  const [userImg,setUserImg] = useState<any>();
  const [advertisement,setadvertisement] = useState<advertisementItem[]>([]);
  const fileReader = new FileReader();
  const fileReader2 = new FileReader();
  const fileReader3 = new FileReader();
  const checkboxInputValue_module = document.getElementById("checkboxInputValue_module");
  const FiltersleepPlacesDop = document.getElementById("FiltersleepPlacesDop");
  const dispatch = useDispatch();
  let city = useSelector((state:any) => state.filter.city);
  let filterFromHome = useSelector((state:any) => state.filter.filterAll);
  const rooms = useSelector((state:any) => state.filter.Rooms);
  const LengthAdvertisements = useSelector((state:any) => state.advertisementAction.length)
  const lengthFavourites = useSelector((state:any) => state.favouritesAction.length);
  const [ToggleState,setToggleState] = useState<number>(1);
  const heart = document.querySelector(".item3");
  const toggleTab = (index) =>{
    setToggleState(index)
  }
  ScrollHeader(lengthFavourites,heart)
  useEffect(()=>{ // данные закладк
    if(login){
      axios.get(`/users?login=${login}`).then((data) => {
        setFavourites(data.data[0].favourites.length);
        setLoading(false);
      });
    }
  },[login])

  useEffect(() => { // данные объявлений
    if(login){
      axios.get(`/users?login=${login}`).then((data) => {
        setadvertisement(data.data[0].advertisement);
        dispatch(setLength(data.data[0].advertisement.length));
      });
    }
  },[login,LengthAdvertisements]);

  useEffect(() => {
    if (login){
      dispatch(setLengthFavourites(favourites));
    }
  },[login,favourites]);

  useEffect(()=>{
    if (login){
      axios.get(`/users?login=${login}`).then((data) => {
        setUserImg(data.data[0].url);
      });
    }
  },[login])

  useEffect(() => {
    if(lengthFavourites>0 && heart!==null) {
      heart.classList.add("pulse");
    }
    else if(lengthFavourites==0 && heart!==null){
      heart.classList.remove("pulse");
    }
  },[lengthFavourites,login,favourites])

  function validateLogin(value){
    axios.get(`/users?login=${value}`).then((res)=>{
    if(res.data.length===0){
      setLogin(true)
    }
    else if (res.data.length!==0){
      setLogin(false) 
    }
  }) 
}

  useEffect(()=>{
    if(modalUserChange==true || modalAdvertisements==true){
      document.body.style.overflow="hidden"
     }
     else if(modalUserChange==false && modalAdvertisements==false){
       document.body.style.overflow="auto"
     }
  },[modalUserChange,modalAdvertisements])

  const changeUser = (value) =>{ // Изменения пользователя
    setLoading(true);
    axios.patch(`/users/${id}`, {
      login:`${value.login}`,
      url:`${imgUrlUser?imgUrlUser:userImg}`
  }).then(()=>{setLoading(false)})
    localStorage.setItem('login',value.login);
    login=value.login;
    if(imgUrlUser){
      setUserImg(imgUrlUser)
    }
    setModalUserChange(false);
    notifySuccessEditing();
  }


   const [Cities,setCities]=useState<cities[]>([]);
   useEffect(()=>{
    axios.get(`/Cities`).then(({data})=>{
      setCities(data);
    })
   },[]);
  
   const addArenda = (value) => { //Добавление объявления
    const choose = confirm("Вы уверены, что введенные Вами данные верны и хотите разместь Ваше объявление?\n(при нажатии на `нет`, Вы cможете изменить введенные Вами данные)");
    if(choose==true){
          const item = {
            "id": uniqid(),
            "city" : value.city,  
            "sent" : value.sent,
            "rooms":value.rooms,
            "square":value.square,
            "metro":value.metro,
            "rayon":value.rayon,
            "description":value.description,
            "url":imgUrl,
            "imageOwner":imgUrl2,
            "name":value.name,
            "number":value.number,
            "mail":value.mail,
            "linkViber":value.linkViber,
            "linkWats":value.linkWats,
            "linkMail":value.linkMail,
            "options":[
              {
                "name":((checkboxInputValue_module as HTMLInputElement).value!=="")?
                          (checkboxInputValue_module as HTMLInputElement).value.split(",")
                      :[],
                "sleepPlaces":FiltersleepPlacesDop.textContent!=="Выберите"? FiltersleepPlacesDop.textContent:""
              }
            ],
            "total":value.total,
            "check":"На рассмотрении",
          }
          axios.patch(`/users/${id}`, advertisement?{
            "advertisement":
              [...advertisement,item]
          }:{
            "advertisement":
              [item]
            }
          ).catch(err => console.error(err));
          notifySuccess();
          dispatch(incrementAdvertisement(LengthAdvertisements));
          value.city="";
          value.sent="";
          value.rooms="";
          value.square="";
          value.metro="";
          value.rayon="";
          value.description="";
          setImgUrl("");
          setImgUrl2("");
          value.name="";
          value.number="";
          value.mail="";
          value.linkViber="";
          value.linkWats="";
          value.linkMail="";
          (checkboxInputValue_module as HTMLInputElement).value="";
          FiltersleepPlacesDop.textContent="Выберите";
          value.total="";
          setModalAdvertisements(false);
          setToggleState(1);
          document.querySelectorAll(".checkBoxOptions2").forEach((item)=>{
            (item as HTMLInputElement).checked=false;
          })
      }
   } 
  return(
    <>
    <header>
       <nav>
          <div className="conteiner">
            <div className="UpNav">
              <div className="leftpart" style={{display:"flex",alignItems:"center"}}>
                <NavLink to="/" className="item" onClick={()=>{window.scrollTo({top:0,behavior:"smooth"});  dispatch(setRooms("Квартиры на сутки"))}}>Главная</NavLink>
                <NavLink to="/news"className="item" onClick={()=>{window.scrollTo({top:0,behavior:"smooth"});  dispatch(setRooms("Квартиры на сутки"))}}>Новости</NavLink>
                <NavLink to="/123"className="item" onClick={()=>{window.scrollTo({top:0,behavior:"smooth"});  dispatch(setRooms("Квартиры на сутки"))}}>Размещение и тарифы</NavLink>
                <NavLink to="/map"className="item" onClick={()=>{window.scrollTo({top:0,behavior:"smooth"});  dispatch(setRooms("Квартиры на сутки"))}}>
                  <svg style={{marginRight:"5px"}} width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.43757 1.74419C6.70501 0.627907 5.49571 0 4.13525 0C2.78641 0 1.57711 0.627907 0.821293 1.74419C0.0654788 2.83721 -0.10894 4.23256 0.356176 5.45349C0.484083 5.77907 0.681758 6.11628 0.937572 6.4186L3.87943 9.88372C3.9492 9.95349 4.01897 10 4.12362 10C4.22827 10 4.29804 9.95349 4.3678 9.88372L7.32129 6.4186C7.57711 6.11628 7.78641 5.7907 7.90269 5.45349C8.3678 4.23256 8.19339 2.83721 7.43757 1.74419ZM4.13525 5.86047C3.13525 5.86047 2.30966 5.03488 2.30966 4.03488C2.30966 3.03488 3.13525 2.2093 4.13525 2.2093C5.13525 2.2093 5.96083 3.03488 5.96083 4.03488C5.96083 5.03488 5.14687 5.86047 4.13525 5.86047Z" fill="#8291A3"/>
                  </svg>
                  Объявления на карте
                </NavLink>
                <NavLink to="/contacts"className="item" onClick={()=>{window.scrollTo({top:0,behavior:"smooth"});  dispatch(setRooms("Квартиры на сутки"))}}>Контакты</NavLink>
              </div>
              <div className="rightpart">
                  <NavLink to="/favourites"className="item item3" onClick={()=>{window.scrollTo({top:0,behavior:"smooth"});  dispatch(setRooms("Квартиры на сутки"))}}>
                    <span>Закладки</span>
                    <svg className="icon" xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 0 24 24" fill="none" width="16px">
                      <path d="M0 0h24v24H0z" fill="none"/>
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#8291A3"/>
                    </svg>
                  </NavLink>
                {
                  (login)!==null?
                    <div className="UserLink">
                      <div className="dropdown2">
                        <button className="List" onClick={()=>UserInfoClick(login,setModalUserChange,navigate)} style={{padding:"0px 69px 0px 12px",margin:"1px 0px",border:"none",width:"116px",boxShadow:"none"}}>
                          <div style={{display:"flex",alignItems:"center",boxSizing:"border-box",position:"absolute",marginTop:"-15px"} } >
                            {
                              Loading?
                              <>
                              <div className="" style={{display:"flex",marginBottom:"50px",width:"1308px",height:"300px"}}>
                                <UserSkeleton/>
                              </div>
                              </>
                              :<img className="ImgUser" src={userImg} alt="" />
                            }
                            <span className="max">{login}</span>
                          </div>
                        </button >
                        <ul className="List__dropdown userDropdown">
                          <li key={"change5"} className="dropdown__item">Редактировать</li>
                          <li key={"change6"} className="dropdown__item">Мои объявления</li>
                          <li key={"exit"} className="dropdown__item">Выйти</li>
                        </ul>
                        <input type="text" name="select__category" className="drodown__item__hiden" />
                      </div>
                    </div>
                    :<Link to="/signIn"className="item item2" style={{marginBottom:"2px",marginTop:"2px"}} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>Вход и регистрация </Link>
                }
              </div>
            </div>
          </div>
        </nav>
    </header>
    <div className="head">
      <div className="conteiner" >
        <div className="Menu">
          <Link to="/">
            <svg style={{cursor:"pointer"}} className="Logo" width="135" height="19" viewBox="0 0 135 19" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <rect x="0.0996094" width="134" height="19" fill="url(#pattern0)"/>
            <defs>
            <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image0_2831_2326" transform="scale(0.00746269 0.0526316)"/>
            </pattern>
            <image id="image0_2831_2326" width="134" height="19" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIYAAAATCAYAAABV0nVhAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDM5Q0IxQzVDQUI4MTFFN0FBNEJFNEEyRjMzMUI3NTQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDM5Q0IxQzZDQUI4MTFFN0FBNEJFNEEyRjMzMUI3NTQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowMzlDQjFDM0NBQjgxMUU3QUE0QkU0QTJGMzMxQjc1NCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowMzlDQjFDNENBQjgxMUU3QUE0QkU0QTJGMzMxQjc1NCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhiAN3YAAAQ4SURBVHja7FpLbttADJUDX0A9QIEqu3SpHkFZd6UcQT6CfQTrCNYRok269hwhWnZpFegFdASXNChjTJOamUhWijYEBCPOzIgiHx8/8iIS5POX+xQ+8Irpqxav378OTfQh/5Qcj0fx+wUDRAEfa7gS5RwEyAYAUrN9uGfroQfuN3CVcEbrozicvYOPgn3dwf5PA3t89eGCz1Z6nnFvPwOsz+BjP7D+EdYbL2f9/H4M0BnPrBdff1TW/oPgwxbW3Av3EtfeMQfsBkAR0f+eCUBvkYScfIAzth6giAVQoMQjdJhKMvZ3+o567MDBO+u7lWR7WFMwUBSKv1d3VnSEGHpH6WaMrAmMQ5IHOGZuSf8yfQpw9MlewAyGmOTK5h72NdHDi+kZQwIFposN0j5Sd6DTvB+GQPkWYOTEKP8LMIx1tQOMfE6LCmtkxBaZovNp31I48CSQD58sSsei8zmQOhtLuZicnCvMUcH9OpZGEg9jFwTcoPphKmAgMFFvqi9uKsACjywNPA8FDqxvYE0lBP2awCUFZAVs0djAkPL7nlijpmJzEfgsHSu2aqWg60FTebBFZ3VK/ZpyRpZoWRBlZKNUCIp0Bl0k+/Doz5nNMoUtOptllgMP0m/GeqIlAxjfyloSjFg4KxfulShswA1RM6Rj1KaebXThiOwGztl40HnBWLMWjGymBgY4cy0U8Rf6250JsUYH+0ohGKXuqQS26DgwSiFVcMetifbRQasRAJEiLBXmKIlg7EapQ3yAkTg6Lh9pFL1Ttqa7AUNsHXo9KimlHOg+7KC7ANUdRTI668nzgfAG+xu3i9LZhs9PJiyCQ+jbpvCMQBwz4L9HIfwKANBYypVuL9jiDIweHDQ0Wnk+3PaGXUEu1Cu1YviE0tNcYhy6NhMwk6srMUIQJxrrU4oxKts8vPD67rr4BAfgooqc3tcZvIAZKhpDnX5B0cREsZB+bAPlQj3kAnPlWNMFOKjQ2lRMsY4WfKquBG10YLY6taM0x5BYQ21Pr4BBE8hUoO2y70pgDW5+FSIhiDHI6amjws6UwrFwFJYb3vLye4wpnAcYIx343y3bVywsm0iewBphvYH11wc9vIg6LxVnJPZsgXr10IIqtrqAhBQulEitCTjxiJrBxV6Jx7yhc3U4ZAutHXUCg7oLXkhusEgM7FLyWw7VlsqwAx35CgaoyXH5GwyRRsMvlc4UZ0X6mILWBYzC43yjVfee7ejNGCPgxdokOiwpJxqJNZTp2DnvT/AavmHTyFxpbxuP9g07hMT3re0E6WQdyjZz6IUTz6kYI6JWdR8wlGki+Q1eiJR2G2X9BuSqOJKcrQzKZpmEUjDNxhYBPnmaMpVEROXfrLesQ7/HqEa8c+iHVJXg7FxhpTZgUFZE843IOcu+B1t0ffvKp56ji1ule+inhIk92JmJpj9kRtF+wfVHgAEA5QnSPz/jqYUAAAAASUVORK5CYII="/>
            </defs>
            </svg>
          </Link>
          <NavLink to={`/catalog/city=`} onClick={()=>{dispatch(setRooms(""))}} className="Items" style={{padding:0}}>
            <div className="dropdown4" onMouseEnter={()=>MouseLeaveMouseEnterList(dispatch,filterFromHome)}>
              <div className="group Items" style={{marginRight:"0px"}}>
                <p className="rooms">{rooms=="Квартиры на сутки"?rooms:`Квартиры в ${cityIn(city)}`}</p>
                <svg style={{marginLeft:"15px"}}width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.0069 2.61628C9.90811 0.941861 8.09415 0 6.05346 0C4.0302 0 2.21625 0.941861 1.08253 2.61628C-0.0511958 4.25581 -0.312824 6.34884 0.384851 8.18023C0.576711 8.6686 0.873223 9.17442 1.25694 9.62791L5.66973 14.8256C5.77439 14.9302 5.87904 15 6.03601 15C6.19299 15 6.29764 14.9302 6.40229 14.8256L10.8325 9.62791C11.2162 9.17442 11.5302 8.68605 11.7046 8.18023C12.4023 6.34884 12.1407 4.25581 11.0069 2.61628ZM6.05346 8.7907C4.55346 8.7907 3.31508 7.55233 3.31508 6.05233C3.31508 4.55233 4.55346 3.31395 6.05346 3.31395C7.55346 3.31395 8.79183 4.55233 8.79183 6.05233C8.79183 7.55233 7.5709 8.7907 6.05346 8.7907Z" fill="#FFD54F"/>
                </svg>
              </div>
              <ul className="List__dropdown" style={{position:"fixed",marginTop:"0px"}}>
                <>
                {
                  Cities.map((item)=>{
                    return(
                      <div className="Items3"key={item.city+item.id+"1"}>
                          <li key = {item.city+item.id+"2"} className="dropdown__item dropdown__item2" id={item.city}>
                          Квартиры на сутки в {cityIn(item.city)}
                          </li>
                      </div>
                    )
                  })
                }
                </>
              </ul>
            </div>
          </NavLink>
          <NavLink to="123456"className="Items" onClick={()=>{window.scrollTo({top:0,behavior:"smooth"});  dispatch(setRooms("Квартиры на сутки"));}}>Коттеджи и усадьбы</NavLink>
          <NavLink to="1234567"className="Items" onClick={()=>{window.scrollTo({top:0,behavior:"smooth"});  dispatch(setRooms("Квартиры на сутки"));}}>Бани и Сауны</NavLink>
          <NavLink to="12345678"className="Items" onClick={()=>{window.scrollTo({top:0,behavior:"smooth"});  dispatch(setRooms("Квартиры на сутки"));}}>Авто напрокат</NavLink>
          <button className="btndob" onClick={()=>{login && window.innerWidth>1300?setModalAdvertisements(true):window.innerWidth<1300 && login?notifyErrorAddAdvertisement():notifyErrorAuthorization()}}>+ Разместить объявление</button>
          <div className="" style={{position:"relative"}}>
            <div className="hamburger-lines" onClick={()=>burgerMenu()}>
              <span className="line line1"></span>
              <span className="line line2"></span>
              <span className="line line3"></span>
            </div>  
          </div>
        </div>
      </div>
    </div>
    <div className="" style={{position:"relative",display:"flex",justifyContent:"center"}}>
    <div className="burgerMenu__box">
      <div className="UpNav">
        <div className="leftpart" style={{display:"flex",alignItems:"start"}}>
          <div className="itemHoverBurger" onClick={()=>{navigate("/"); burgerMenu()}}>
            <NavLink to="/" className="item" onClick={()=>{window.scrollTo({top:0,behavior:"smooth"});  dispatch(setRooms("Квартиры на сутки"))}}>Главная</NavLink>
          </div>
          <div className="itemHoverBurger" onClick={()=>{navigate("/news"); burgerMenu()}}>
            <NavLink to="/news"className="item" onClick={()=>{window.scrollTo({top:0,behavior:"smooth"});  dispatch(setRooms("Квартиры на сутки"))}}>Новости</NavLink>
          </div>
          <div className="itemHoverBurger" onClick={()=>{navigate("/123"); burgerMenu()}}>
            <NavLink to="/123"className="item" onClick={()=>{window.scrollTo({top:0,behavior:"smooth"});  dispatch(setRooms("Квартиры на сутки"))}}>Размещение и тарифы</NavLink>
          </div>
          <div className="itemHoverBurger" onClick={()=>{navigate("/map"); burgerMenu()}}>
            <NavLink to="/map"className="item" onClick={()=>{window.scrollTo({top:0,behavior:"smooth"});  dispatch(setRooms("Квартиры на сутки"))}}>
              <svg style={{marginRight:"5px"}} width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.43757 1.74419C6.70501 0.627907 5.49571 0 4.13525 0C2.78641 0 1.57711 0.627907 0.821293 1.74419C0.0654788 2.83721 -0.10894 4.23256 0.356176 5.45349C0.484083 5.77907 0.681758 6.11628 0.937572 6.4186L3.87943 9.88372C3.9492 9.95349 4.01897 10 4.12362 10C4.22827 10 4.29804 9.95349 4.3678 9.88372L7.32129 6.4186C7.57711 6.11628 7.78641 5.7907 7.90269 5.45349C8.3678 4.23256 8.19339 2.83721 7.43757 1.74419ZM4.13525 5.86047C3.13525 5.86047 2.30966 5.03488 2.30966 4.03488C2.30966 3.03488 3.13525 2.2093 4.13525 2.2093C5.13525 2.2093 5.96083 3.03488 5.96083 4.03488C5.96083 5.03488 5.14687 5.86047 4.13525 5.86047Z" fill="#8291A3"/>
              </svg>
              Объявления на карте
            </NavLink>
          </div>
          <div className="itemHoverBurger" onClick={()=>{navigate("/contacts"); burgerMenu()}}>
            <NavLink to="/contacts"className="item" onClick={()=>{window.scrollTo({top:0,behavior:"smooth"});  dispatch(setRooms("Квартиры на сутки"))}}>Контакты</NavLink>
          </div>
        </div>
      </div>
      <svg className="lineBox" width="2" height="150" viewBox="0 0 2 150" style={{marginRight:"40px",marginTop:"-15px"}} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path opacity="0.2" d="M1 0L1 150" stroke="#664EF9"/>
      </svg>
      <div className="headSecondBurger">
        <div className="itemHoverBurger" onClick={()=>{navigate("/catalog/city="); burgerMenu()}}>
          <NavLink to={`/catalog/city=`} onClick={()=>{dispatch(setRooms(""))}} className="Items ItemsBurger" style={{padding:0}}>
            <div className="dropdown4" onMouseEnter={()=>MouseLeaveMouseEnterList(dispatch,filterFromHome)}>
              <div className="group Items ItemsBurger" style={{marginRight:"0px"}}>
                <p className="rooms">{rooms=="Квартиры на сутки"?rooms:`Квартиры в ${cityIn(city)}`}</p>
                <svg style={{marginLeft:"15px"}}width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.0069 2.61628C9.90811 0.941861 8.09415 0 6.05346 0C4.0302 0 2.21625 0.941861 1.08253 2.61628C-0.0511958 4.25581 -0.312824 6.34884 0.384851 8.18023C0.576711 8.6686 0.873223 9.17442 1.25694 9.62791L5.66973 14.8256C5.77439 14.9302 5.87904 15 6.03601 15C6.19299 15 6.29764 14.9302 6.40229 14.8256L10.8325 9.62791C11.2162 9.17442 11.5302 8.68605 11.7046 8.18023C12.4023 6.34884 12.1407 4.25581 11.0069 2.61628ZM6.05346 8.7907C4.55346 8.7907 3.31508 7.55233 3.31508 6.05233C3.31508 4.55233 4.55346 3.31395 6.05346 3.31395C7.55346 3.31395 8.79183 4.55233 8.79183 6.05233C8.79183 7.55233 7.5709 8.7907 6.05346 8.7907Z" fill="#FFD54F"/>
                </svg>
              </div>
              <ul className="List__dropdown" style={{position:"fixed",marginTop:"0px"}}>
                <>
                {
                  Cities.map((item)=>{
                    return(
                      <div className="Items3"key={item.city+item.id+"1"}>
                          <li key = {item.city+item.id+"2"} className="dropdown__item dropdown__item2" id={item.city}>
                          Квартиры на сутки в {cityIn(item.city)}
                          </li>
                      </div>
                    )
                  })
                }
                </>
              </ul>
            </div>
          </NavLink>
        </div>
        <div className="itemHoverBurger" onClick={()=>{navigate("123456"); burgerMenu()}}>
          <NavLink to="123456"className="Items ItemsBurger" onClick={()=>{window.scrollTo({top:0,behavior:"smooth"});  dispatch(setRooms("Квартиры на сутки"));}}>Коттеджи и усадьбы</NavLink>
        </div>
        <div className="itemHoverBurger" onClick={()=>{navigate("1234567"); burgerMenu()}}>
          <NavLink to="1234567"className="Items ItemsBurger" onClick={()=>{window.scrollTo({top:0,behavior:"smooth"});  dispatch(setRooms("Квартиры на сутки"));}}>Бани и Сауны</NavLink>
        </div>
        <div className="itemHoverBurger" onClick={()=>{navigate("12345678"); burgerMenu()}}>
          <NavLink to="12345678"className="Items ItemsBurger" onClick={()=>{window.scrollTo({top:0,behavior:"smooth"});  dispatch(setRooms("Квартиры на сутки"));}}>Авто напрокат</NavLink>
        </div>
      </div>
      <div className="rightpart2">
                  <NavLink to="/favourites"className="item item3" onClick={()=>{window.scrollTo({top:0,behavior:"smooth"});  dispatch(setRooms("Квартиры на сутки")); burgerMenu()}}>
                    <span>Закладки</span>
                    <svg className="icon" xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 0 24 24" fill="none" width="16px">
                      <path d="M0 0h24v24H0z" fill="none"/>
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#8291A3"/>
                    </svg>
                  </NavLink>
                {
                  (login)!==null?
                    <div className="UserLink">
                      <div className="dropdown2">
                        <button className="List" onClick={()=>UserInfoClick(login,setModalUserChange,navigate)} style={{padding:"0px 69px 0px 12px",margin:"1px 0px",border:"none",width:"116px",boxShadow:"none"}}>
                          <div style={{display:"flex",alignItems:"center",boxSizing:"border-box",position:"absolute",marginTop:"-15px"} } >
                            {
                              Loading?
                              <>
                              <div className="" style={{display:"flex",marginBottom:"50px",width:"1308px",height:"300px"}}>
                                <UserSkeleton/>
                              </div>
                              </>
                              :<img className="ImgUser" src={userImg} alt="" />
                            }
                            <span className="max">{login}</span>
                          </div>
                        </button >
                        <ul className="List__dropdown">
                          <li key={"change5"} className="dropdown__item">Редактировать</li>
                          <li key={"change6"} className="dropdown__item">Мои объявления</li>
                          <li key={"exit"} className="dropdown__item">Выйти</li>
                        </ul>
                        <input type="text" name="select__category" className="drodown__item__hiden" />
                      </div>
                    </div>
                    :<Link to="/signIn"className="item item2" style={{marginBottom:"2px",marginTop:"2px"}} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>Вход и регистрация </Link>
                }
              </div>
      </div>
    </div>
        {/* forma redactirovania user*/}
        <Modal active={modalUserChange} setActive={setModalUserChange}>
            {
              <>
              <div className="exit" style={{top:"-1.5em"}}>
                <svg onClick={()=>setModalUserChange(false)} height="30" viewBox="0 0 512 512" width="30  " xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                  <path d="M255.997,460.351c112.685,0,204.355-91.668,204.355-204.348S368.682,51.648,255.997,51.648  c-112.68,0-204.348,91.676-204.348,204.355S143.317,460.351,255.997,460.351z M255.997,83.888  c94.906,0,172.123,77.209,172.123,172.115c0,94.898-77.217,172.117-172.123,172.117c-94.9,0-172.108-77.219-172.108-172.117  C83.888,161.097,161.096,83.888,255.997,83.888z"/>
                  <path d="M172.077,341.508c3.586,3.523,8.25,5.27,12.903,5.27c4.776,0,9.54-1.84,13.151-5.512l57.865-58.973l57.878,58.973  c3.609,3.672,8.375,5.512,13.146,5.512c4.658,0,9.316-1.746,12.902-5.27c7.264-7.125,7.369-18.793,0.242-26.051l-58.357-59.453  l58.357-59.461c7.127-7.258,7.021-18.92-0.242-26.047c-7.252-7.123-18.914-7.018-26.049,0.24l-57.878,58.971l-57.865-58.971  c-7.135-7.264-18.797-7.363-26.055-0.24c-7.258,7.127-7.369,18.789-0.236,26.047l58.351,59.461l-58.351,59.453  C164.708,322.715,164.819,334.383,172.077,341.508z"/>
                </svg>
              </div>
              <Formik 
                initialValues={{
                  login:login,
                  urlImg:""}} 
                  validateOnBlur
                  onSubmit={changeUser}>
               {({values,errors,touched,handleChange,handleBlur,isValid,handleSubmit,dirty})=>(
                <Form className="formUser" style={{width:"600px",display:"flex",justifyContent:"center",flexDirection:"column",alignItems:"center"}}>
                  <p className="innerText_Module">Редактирование пользователя</p>
                  <div className="userInfoModal" style={{display:"flex",marginBottom:"25px"}}>
                    <div className="partOneAdvertisement" style={{marginRight:"15px"}}>
                      <h2 className="userImgModal" style={{marginLeft:"67px"}}>Ваше фото</h2>
                      <img style={{borderRadius:"145px"}} className="IconImgAdvertisement"src={imgUrlUser?imgUrlUser:userImg} alt="" />
                        <button style={{marginLeft:"59px",marginTop:"10px"}} onClick={UserImg} className="Voyti choose userBtn" type="button">Выберите файл</button>
                      <Field id="file-input3" type="file" accept="image/*,.png,.jpg,.gif,.web," onChange={()=>downLoadImgUser(event.target,fileReader3,setimgUrlUser)} value={values.urlImg} style={{display:"none"}} />
                    </div>
                    <div className="LOGIN" style={{alignItems:"center"}}>
                      <div style={{marginTop:"-115px",position:"fixed"}}><h2 className="loginUser">Ваш логин</h2></div>
                      <Field className={((touched.login && errors.login)||(values.login===""))? "login__error":"login"} onChange={handleChange} onBlur={handleBlur} name = "login" type="text" validate={validateLogin} value={values.login} placeholder="Логин"/>
                      <svg className={((touched.login && errors.login)||(values.login===""))? "icon__error":"iconHidden"} style={{top:"-15px"}} width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z" fill="#EB5757"/>
                      </svg>
                      <svg className="userOf" style={{marginTop:"-20px"}} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_2831_1547)">
                        <path opacity="0.3" className="user" d="M10.0013 0C7.14418 0 4.80859 2.33559 4.80859 5.19275C4.80859 8.04991 7.14418 10.3855 10.0013 10.3855C12.8585 10.3855 15.1941 8.04991 15.1941 5.19275C15.1941 2.33559 12.8585 0 10.0013 0Z" fill="#664EF9"/>
                        <path opacity="0.3" className="user" d="M18.913 14.536C18.7769 14.1959 18.5955 13.8784 18.3915 13.5836C17.3484 12.0416 15.7384 11.0212 13.9244 10.7718C13.6976 10.7492 13.4482 10.7945 13.2668 10.9305C12.3144 11.6335 11.1806 11.9963 10.0014 11.9963C8.82228 11.9963 7.68851 11.6335 6.73612 10.9305C6.5547 10.7945 6.30526 10.7265 6.07853 10.7718C4.26446 11.0212 2.63183 12.0416 1.61143 13.5836C1.40735 13.8784 1.22592 14.2186 1.0899 14.536C1.02189 14.6721 1.04454 14.8308 1.11256 14.9669C1.29398 15.2843 1.52071 15.6018 1.72479 15.8739C2.04224 16.3048 2.38239 16.6902 2.76789 17.053C3.08534 17.3705 3.44815 17.6653 3.81099 17.9601C5.60236 19.2979 7.75657 20.0009 9.97879 20.0009C12.201 20.0009 14.3552 19.2979 16.1466 17.9601C16.5094 17.688 16.8722 17.3705 17.1897 17.053C17.5525 16.6902 17.9153 16.3047 18.2328 15.8739C18.4595 15.5791 18.6636 15.2843 18.845 14.9669C18.9583 14.8308 18.981 14.672 18.913 14.536Z" fill="#664EF9"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_2831_1547">
                        <rect width="20" height="20" fill="white"/>
                        </clipPath>
                        </defs>
                      </svg>
                    </div>
                  </div>
                <div className={("ErrorEnter" && ((touched.login&&errors.login)||(Login==false)||(values.login=="")))? "ErrorEnter fix":"ErrorEnter"} style={{padding: "9.5px 13px"}}>
                  <div className="">
                    <p className="ErrorEnterText">{((Login==false?"Логин уже занят":"")||((values.login=="")?"Логин не может быть пустым":""))}</p>
                  </div>
                  <div className="">
                    <svg style={{marginLeft:"15px",paddingTop:"5px"}} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 0C4.5 0 0 4.5 0 10C0 15.5 4.5 20 10 20C15.5 20 20 15.5 20 10C20 4.5 15.5 0 10 0ZM10 2C11.1 2 11.9 2.9 11.8 4L11 12H9L8.2 4C8.1 2.9 8.9 2 10 2ZM10 18C8.9 18 8 17.1 8 16C8 14.9 8.9 14 10 14C11.1 14 12 14.9 12 16C12 17.1 11.1 18 10 18Z" fill="white" fillOpacity="0.5"/>
                    </svg>
                  </div>
                </div>
                  <div className="close">
                    <button className="Voyti popupbtn" disabled={((Login==false)||(values.login==""))?isValid:!isValid} onClick={()=>{handleSubmit}} type="submit">Завершить редактирование</button>
                  </div>
                </Form> 
                )}
              </Formik>
              </>
            }
          </Modal>

            {/* forma redactirovania advertisement*/}

          <Modal active={modalAdvertisements} setActive={setModalAdvertisements}>
          {
            login?
            <>
             <h1 style={{textAlign:"center", marginBottom:"15px"}} className="textBreath">Разместите Ваше объявление</h1>
             <section className="FirstObyablenie">
              <div className="infoAdvertisement">
                <div className="conteiner" style={{width:"1150px"}}>
                <div className="exit">
                    <svg onClick={()=>setModalAdvertisements(false)} height="30" viewBox="0 0 512 512" width="30  " xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                      <path d="M255.997,460.351c112.685,0,204.355-91.668,204.355-204.348S368.682,51.648,255.997,51.648  c-112.68,0-204.348,91.676-204.348,204.355S143.317,460.351,255.997,460.351z M255.997,83.888  c94.906,0,172.123,77.209,172.123,172.115c0,94.898-77.217,172.117-172.123,172.117c-94.9,0-172.108-77.219-172.108-172.117  C83.888,161.097,161.096,83.888,255.997,83.888z"/>
                      <path d="M172.077,341.508c3.586,3.523,8.25,5.27,12.903,5.27c4.776,0,9.54-1.84,13.151-5.512l57.865-58.973l57.878,58.973  c3.609,3.672,8.375,5.512,13.146,5.512c4.658,0,9.316-1.746,12.902-5.27c7.264-7.125,7.369-18.793,0.242-26.051l-58.357-59.453  l58.357-59.461c7.127-7.258,7.021-18.92-0.242-26.047c-7.252-7.123-18.914-7.018-26.049,0.24l-57.878,58.971l-57.865-58.971  c-7.135-7.264-18.797-7.363-26.055-0.24c-7.258,7.127-7.369,18.789-0.236,26.047l58.351,59.461l-58.351,59.453  C164.708,322.715,164.819,334.383,172.077,341.508z"/>
                    </svg>
                  </div>
                    <Formik
                      initialValues={{
                        city:"",
                        sent:"",
                        rooms:"",
                        square:"",
                        metro:"",
                        rayon:"",
                        description:"",
                        url:"",
                        imageOwner:"",
                        name:"",
                        number:"",
                        mail:"",
                        linkViber:"",
                        linkWats:"",
                        linkMail:"",
                        options:[
                          {
                          dopnames:"",
                          sleepPlaces:""
                          }
                        ],
                        total:"",
                        check:"На рассмотрении",
                      }} 
                        validateOnBlur
                        validationSchema={validationSchemaAdvertisements}
                        onSubmit={addArenda}>
                        {({values,errors,touched,handleChange,handleBlur,isValid,handleSubmit,dirty})=>(
                        <Form>
                          <div className="block__tabs" style={{justifyContent:"center",marginBottom:"20px"}}>
                          <div className={(ToggleState === 1 && (values.city!=="" && values.total!=="" && values.rooms!=="" && values.linkViber!=="" && values.linkWats!=="" && values.linkMail!=="" && values.mail!=="" && values.metro!=="" && values.name!=="" && values.number!=="" && values.square!=="" && values.rayon!=="" && values.sent!=="" && (!errors.sent) && (!errors.square) && (!errors.mail) && (!errors.linkMail) && (imgUrl && imgUrl2)))? "tabs tabs__active":(ToggleState === 1 && (values.city=="" || values.total=="" || values.rooms=="" || values.linkViber=="" || values.linkWats=="" || values.linkMail=="" || values.mail=="" || values.metro=="" || values.name=="" || values.number=="" || values.square=="" || values.rayon=="" || values.sent=="" || (errors.sent) || (errors.square) || (errors.mail) || (errors.linkMail) || (!imgUrl || !imgUrl2)))?"tabs tabs__active tabs__error__active":(ToggleState !== 1 && (values.city=="" || values.total=="" || values.rooms=="" || values.linkViber=="" || values.linkWats=="" || values.linkMail=="" || values.mail=="" || values.metro=="" || values.name=="" || values.number=="" || values.square=="" || values.rayon=="" || values.sent=="" || (errors.sent) || (errors.square) || (errors.mail) || (errors.linkMail) || (!imgUrl || !imgUrl2))?"tabs tabs__error":"tabs" )} onClick={()=>toggleTab(1)} >
                              <p className="select__item" >Основная информация*</p>
                            </div>
                            <div className={ToggleState === 2 ? "tabs tabs__active":"tabs"} onClick={()=>toggleTab(2)}>
                              <p className="select__item" >Дополнительная информация</p>
                            </div>
                            <div className={(ToggleState === 3 && values.description!=="") ? "tabs tabs__active":(ToggleState===3 && values.description=="")?"tabs tabs__active tabs__error__active":(ToggleState!==3 && values.description=="")?"tabs tabs__error":"tabs"} onClick={()=>toggleTab(3)}>
                              <p className="select__item" >Описание Вашего объявления*</p>
                            </div>
                          </div>  
                          
                          <div className={ToggleState===1?"DivisionAdvertisement":"DivisionAdvertisementNone"} style={{marginBottom:"15px"}}>
                            <div className="partOneAdvertisement" style={{marginRight:"15px"}}>
                              <h2 style={{fontSize:"22px"}}>Фото Вашего объекта</h2>
                              {
                                (imgUrl)?
                                  <Swiper pagination={{clickable:true}} navigation={{enabled:true}} modules={[Pagination,Navigation]} className="IconImgAdvertisement">
                                    {
                                      imgUrl.map((imgItem)=>(
                                        <SwiperSlide>
                                          <img style={{width:"250px",height:"250px"}} key={"imgUrl2{"+imgItem+"}"} src={imgItem} />
                                        </SwiperSlide>
                                      ))
                                    }
                                  </Swiper>
                                :<img className={"IconImgAdvertisement imgerror"} src={"https://cdn.dribbble.com/users/2657768/screenshots/6413526/404_43.gif"} alt="" /> 
                              }
                                <button onClick={FileObjectAdvertisement} style={{marginTop:"10px"}} className="Voyti choose" type="button">Выберите файл</button>
                              <Field id="file-input" type="file" accept="image/*,.png,.jpg,.gif,.web," onChange={()=>downLoadImgAdvertisements(event.target,fileReader,imgUrl,setImgUrl)} value={values.url} style={{display:"none"}} />
                            </div>
                            <div className="partTwoAdvertisement" style={{display:"flex"}}>
                              <div className="InformObject" style={{marginRight:"40px"}}>
                                <h2 style={{marginRight:"17px",marginBottom:"20px",textAlign:"center",fontSize:"16px"}}>Информация об объекте</h2>
                                <div className="LOGIN">
                                    <Field className={((touched.city && errors.city)||(values.city===""))? "login__error cityArenda":"login cityArenda"} onChange={handleChange} onBlur={handleBlur} name = "city" type="text" value={values.city} placeholder="Город"/>
                                    <div className="" style={{position:"relative"}}>
                                      <svg className={((touched.city && errors.city)||(values.city===""))? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z" fill="#EB5757"/>
                                      </svg>
                                    </div>
                                    <svg className="userOf" width="20" height="20" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg">
                                      <path opacity="0.3" className="user" d="M640 240v240c0 17.67-14.33 32-32 32H32c-17.67 0-32-14.33-32-32L0 144c0-26.51 21.49-48 48-48H64V24.01c0-13.25 10.75-23.1 24-23.1S112 10.75 112 24.01v72h64V24.01c0-13.25 10.75-23.1 24-23.1S224 10.75 224 24.01v71.1h64V48.01c0-26.51 21.49-48 48-48l96 .0049c26.51 0 48 21.49 48 48v143.1h112C618.5 192 640 213.5 640 240zM128 172c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.375-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V172zM128 268c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.375-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V268zM128 364c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.375-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V364zM256 172c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.375-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V172zM256 268c0-6.625-5.375-12-12-12h-40C197.4 256 192 261.4 192 268v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V268zM256 364c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.38-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V364zM416 76.01c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.375-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V76.01zM416 172c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.38-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V172zM416 268c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.38-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V268zM576 268c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.375-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V268zM576 364c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.375-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V364z"/>
                                    </svg>
                                </div>

                              <div className="LOGIN">
                                <Field className={((touched.sent && errors.sent)||(values.sent===""))? "login__error cityArenda":"login cityArenda"} onChange={handleChange} onBlur={handleBlur} name = "sent" type="text" value={values.sent} placeholder="Цена(в BYN за сутки)"/>
                                <div className="" style={{position:"relative"}}>
                                  <svg className={((touched.sent && errors.sent)||(values.sent===""))? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="rgb(235, 87, 87)" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z" />
                                  </svg>
                                </div>
                                <svg className="userOf" style={{marginTop:"11px"}} width="25" height="25" viewBox="0 0 512 512" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                  <path opacity="0.3" className="user" d="M256,73.089c-100.864,0-182.911,82.058-182.911,182.917S155.136,438.911,256,438.911  c100.859,0,182.911-82.046,182.911-182.905S356.86,73.089,256,73.089z M256,410.059c-84.951,0-154.06-69.108-154.06-154.054  c0-84.956,69.109-154.065,154.06-154.065c84.951,0,154.06,69.109,154.06,154.065C410.06,340.951,340.951,410.059,256,410.059z"/>
                                  <path opacity="0.3" className="user" d="M227.076,220.157c0-11.572,16.925-13.548,31.606-13.548c13.837,0,32.744,6.485,48.553,14.681l3.098-31.895  c-7.906-4.52-26.247-9.884-44.877-11.005l4.515-32.461H239.77l4.521,32.461c-38.947,3.664-51.651,26.242-51.651,45.154  c0,47.697,88.898,37.547,88.898,66.888c0,11.017-10.434,14.959-28.785,14.959c-24.832,0-43.467-8.74-53.056-17.779l-4.803,35.848  c9.04,5.364,27.375,10.161,49.397,11.294l-4.521,31.329h30.201l-4.515-31.617c45.722-3.954,53.906-28.23,53.906-44.311  C319.363,233.428,227.076,247.532,227.076,220.157z"/>
                                </svg>
                              </div>

                              <div className="LOGIN">
                                <Field className={((touched.rooms && errors.rooms) ||(values.rooms===""))? "login__error cityArenda":"login cityArenda"} onChange={handleChange} onBlur={handleBlur} name = "rooms" type="text" value={values.rooms} placeholder="Комнаты"/>
                                <div className="" style={{position:"relative"}}>
                                  <svg className={((touched.rooms && errors.rooms)||(values.rooms===""))? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="rgb(235, 87, 87)" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z"/>
                                  </svg>
                                </div>
                                <svg className="userOf" style={{marginTop:"11px"}} fill="none" height="25" viewBox="0 0 20 20" width="25" xmlns="http://www.w3.org/2000/svg">
                                  <path opacity="0.3" className="user" d="M12.485 9.99976C12.485 10.414 12.1492 10.7498 11.735 10.7498C11.3208 10.7498 10.985 10.414 10.985 9.99976C10.985 9.58554 11.3208 9.24976 11.735 9.24976C12.1492 9.24976 12.485 9.58554 12.485 9.99976Z"/>
                                  <path opacity="0.3" className="user" d="M9.60274 2.01206C9.4551 1.98045 9.30109 2.01724 9.18368 2.11217C9.06627 2.2071 8.99805 2.35 8.99805 2.50098L8.99867 17.4986L8.99805 17.501C8.99805 17.652 9.0663 17.7949 9.18374 17.8898C9.30119 17.9848 9.45525 18.0215 9.6029 17.9899L16.6023 16.4886C16.8328 16.4392 16.9975 16.2355 16.9975 15.9998V3.99976C16.9975 3.76396 16.8328 3.56021 16.6022 3.51084L9.60274 2.01206ZM9.99805 16.8824V3.11938L15.9975 4.40403V15.5956L9.99805 16.8824Z"/>
                                  <path opacity="0.3" className="user" d="M7.99988 16.9974V15.9974H3.99805V4.00208H7.99988V3.00208H3.49805C3.2219 3.00208 2.99805 3.22593 2.99805 3.50208V16.4974C2.99805 16.7735 3.2219 16.9974 3.49805 16.9974H7.99988Z"/>
                                </svg>
                              </div>

                              <div className="LOGIN">
                                <Field className={((touched.total && errors.total)||(values.total===""))? "login__error cityArenda":"login cityArenda"} onChange={handleChange} onBlur={handleBlur} name = "total" type="text" value={values.total} placeholder="Кол-во людей"/>
                                <div className="" style={{position:"relative"}}>
                                  <svg className={((touched.total && errors.total)||(values.total===""))? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="rgb(235, 87, 87)" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z" fill="#EB5757"/>
                                  </svg>
                                </div>
                                <svg className="userOf" style={{marginTop:"11px"}} fill="none" height="25" width="25" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                  <path opacity="0.3" className="user" d="M289,327a5.23,5.23,0,0,0-5.24,5.24v62.68a5.24,5.24,0,1,0,10.48,0V332.25A5.23,5.23,0,0,0,289,327Z"/>
                                  <path opacity="0.3" className="user" d="M223.35,327a5.23,5.23,0,0,0-5.24,5.24v62.68a5.24,5.24,0,0,0,10.48,0V332.25A5.23,5.23,0,0,0,223.35,327Z"/>
                                  <path opacity="0.3" className="user" d="M398.85,283.06a5.24,5.24,0,0,0-5.24,5.25v50.14a5.24,5.24,0,0,0,10.48,0V288.31A5.24,5.24,0,0,0,398.85,283.06Z"/>
                                  <path opacity="0.3" className="user" d="M346.32,283.06a5.24,5.24,0,0,0-5.24,5.25v50.14a5.24,5.24,0,0,0,10.48,0V288.31A5.24,5.24,0,0,0,346.32,283.06Z"/>
                                  <path opacity="0.3" className="user" d="M166.06,283.06a5.24,5.24,0,0,0-5.24,5.25v50.14a5.24,5.24,0,0,0,10.48,0V288.31A5.24,5.24,0,0,0,166.06,283.06Z"/>
                                  <path opacity="0.3" className="user" d="M113.53,283.06a5.25,5.25,0,0,0-5.25,5.25v50.14a5.25,5.25,0,0,0,10.49,0V288.31A5.24,5.24,0,0,0,113.53,283.06Z"/>
                                  <path opacity="0.3" className="user" d="M461.82,157.16h-.34a27.62,27.62,0,0,0,6.29-17.42,27.92,27.92,0,0,0-55.83,0,27.61,27.61,0,0,0,6.28,17.42h-.33a24.69,24.69,0,0,0-24.67,24.66v27.69A32.64,32.64,0,0,0,357.54,206V181.82a24.68,24.68,0,0,0-24.65-24.66h-.35a27.62,27.62,0,0,0,6.29-17.42,27.91,27.91,0,1,0-55.82,0,27.61,27.61,0,0,0,6.28,17.42H289a24.68,24.68,0,0,0-24.66,24.66v45a40.73,40.73,0,0,0-8.09-.81,40.16,40.16,0,0,0-18,4.41V181.82a24.68,24.68,0,0,0-24.66-24.66h-.34a27.61,27.61,0,0,0,6.28-17.42,27.91,27.91,0,1,0-55.82,0,27.62,27.62,0,0,0,6.29,17.42h-.34a24.69,24.69,0,0,0-24.67,24.66v20.92a31.31,31.31,0,0,0-26.12,7.1v-28a24.69,24.69,0,0,0-24.67-24.66h-.33a27.61,27.61,0,0,0,6.28-17.42,27.92,27.92,0,0,0-55.83,0,27.62,27.62,0,0,0,6.29,17.42h-.34a24.69,24.69,0,0,0-24.66,24.66v40a5.24,5.24,0,0,0,10.48,0v-40a14.19,14.19,0,0,1,14.18-14.17H94.11a14.19,14.19,0,0,1,14.19,14.17v40a5.11,5.11,0,0,0,.33,1.66,33.07,33.07,0,0,0,6.91,35.37h-3.2a29.55,29.55,0,0,0-29.52,29.52v50a5.24,5.24,0,1,0,10.48,0v-50a19.05,19.05,0,0,1,19-19h54.92a19,19,0,0,1,19,19V394.93a5.25,5.25,0,0,0,10.49,0V332.37a25.13,25.13,0,0,1,25.1-25.09h68.64a25.13,25.13,0,0,1,25.1,25.09v62.56a5.25,5.25,0,0,0,10.49,0V288.41a19,19,0,0,1,19-19h54.92a19,19,0,0,1,19,19v50a5.24,5.24,0,0,0,10.48,0v-50a29.55,29.55,0,0,0-29.51-29.52h-3.2a33.4,33.4,0,0,0,6.67-36.15,5.26,5.26,0,0,0,.17-.88v-40a14.19,14.19,0,0,1,14.19-14.17h43.93A14.19,14.19,0,0,1,476,181.82v40a5.24,5.24,0,1,0,10.48,0v-40A24.69,24.69,0,0,0,461.82,157.16ZM54.72,139.74a17.43,17.43,0,1,1,17.43,17.42A17.45,17.45,0,0,1,54.72,139.74Zm238.77,0a17.43,17.43,0,1,1,17.43,17.42A17.46,17.46,0,0,1,293.49,139.74Zm-7.11,126.88a30.18,30.18,0,1,1-30.18-30.18A30.21,30.21,0,0,1,286.38,266.62ZM174.11,139.74a17.42,17.42,0,1,1,17.42,17.42A17.45,17.45,0,0,1,174.11,139.74Zm-57.4,96.06a23.09,23.09,0,1,1,23.09,23.09A23.12,23.12,0,0,1,116.71,235.8Zm105.17,61a35.49,35.49,0,0,0-25.1,10.39V288.41a29.55,29.55,0,0,0-29.52-29.52h-3.2a33.27,33.27,0,0,0-8.67-52.65V181.82a14.19,14.19,0,0,1,14.18-14.17H213.5a14.18,14.18,0,0,1,14.17,14.17v54a5.2,5.2,0,0,0,.33,1.63,40.28,40.28,0,0,0,1.2,59.36Zm93.74-8.38v18.77a35.49,35.49,0,0,0-25.1-10.39H283.2a40.24,40.24,0,0,0-8.43-66.13V181.82A14.19,14.19,0,0,1,289,167.65h43.94a14.18,14.18,0,0,1,14.17,14.17v32.44a33.08,33.08,0,0,0,1.28,44.63h-3.2A29.55,29.55,0,0,0,315.62,288.41Zm33.89-52.61a23.09,23.09,0,1,1,23.09,23.09A23.12,23.12,0,0,1,349.51,235.8Zm72.91-96.06a17.43,17.43,0,1,1,17.43,17.42A17.46,17.46,0,0,1,422.42,139.74Z"/>
                                </svg>
                              </div>

                              <div className="LOGIN">
                                <Field className={((touched.square && errors.square)||(values.square==""))? "login__error cityArenda":"login cityArenda"} onChange={handleChange} onBlur={handleBlur} name = "square" type="text" value={values.square} placeholder="Площадь объекта"/>
                                <div className="" style={{position:"relative"}}>
                                  <svg className={((touched.square && errors.square)||(values.square==""))? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="rgb(235, 87, 87)" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z"/>
                                  </svg>
                                </div>
                                <svg className="userOf" style={{marginTop:"11px"}} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                                  x="0px" y="0px" fill="none" height="25" width="25" viewBox="0 0 24 24" xmlSpace="preserve">
                                <g>
                                  <path opacity="0.3" className="user" d="M2.6,2.983v18c0,0.221,0.18,0.4,0.4,0.4h18c0.221,0,0.4-0.18,0.4-0.4v-18c0-0.221-0.18-0.399-0.4-0.399H3
                                    C2.779,2.584,2.6,2.763,2.6,2.983z M3.4,3.384H20.6v17.2H3.4V3.384z"/>
                                  <path opacity="0.3" className="user" d="M1,0.584h4c0.221,0,0.4,0.179,0.4,0.399s-0.18,0.4-0.4,0.4H1.4v3.559c0,0.221-0.18,0.399-0.4,0.399S0.6,5.163,0.6,4.942
                                    V0.983C0.6,0.763,0.779,0.584,1,0.584z"/>
                                  <path opacity="0.3" className="user" d="M19,22.617h3.6v-3.56c0-0.221,0.18-0.399,0.4-0.399s0.4,0.179,0.4,0.399v3.959c0,0.221-0.18,0.399-0.4,0.399h-4
                                    c-0.221,0-0.4-0.179-0.4-0.399S18.779,22.617,19,22.617z"/>
                                </g>
                                </svg>
                              </div>

                              <div className="LOGIN">
                                <Field className={((touched.metro && errors.metro)||(values.metro===""))? "login__error cityArenda":"login cityArenda"} onChange={handleChange} onBlur={handleBlur} name = "metro" type="text" value={values.metro} placeholder="Метро(ближайшее)"/>
                                <div className="" style={{position:"relative"}}>
                                  <svg className={((touched.metro && errors.metro)||(values.metro===""))? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="rgb(235, 87, 87)" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z" fill="#EB5757"/>
                                  </svg>
                                </div>
                              <svg className="userOf" style={{marginTop:"11px"}} fill="none" height="25" width="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path opacity="0.3" className="user" d="M8.71,14.29a1.00157,1.00157,0,0,0-1.08984-.21.90087.90087,0,0,0-.54.54,1.00008,1.00008,0,1,0,1.83984,0A1.14718,1.14718,0,0,0,8.71,14.29Zm8,0a1.04669,1.04669,0,0,0-1.41992,0,1.14718,1.14718,0,0,0-.21.33008A.98919.98919,0,0,0,15.29,15.71a1.14718,1.14718,0,0,0,.33008.21.94107.94107,0,0,0,.75976,0,1.16044,1.16044,0,0,0,.33008-.21.98919.98919,0,0,0,.21-1.08984A1.14718,1.14718,0,0,0,16.71,14.29Zm2.59943,4.60528a4.97014,4.97014,0,0,0,1.78436-4.8172l-1.5-8A5.00038,5.00038,0,0,0,14.68066,2H9.31934A5.00038,5.00038,0,0,0,4.40625,6.07812l-1.5,8a4.97014,4.97014,0,0,0,1.78436,4.8172L3.293,20.293A.99989.99989,0,1,0,4.707,21.707l1.86914-1.86914A5.00576,5.00576,0,0,0,7.81934,20h8.36132a5.00576,5.00576,0,0,0,1.24317-.16211L19.293,21.707A.99989.99989,0,0,0,20.707,20.293ZM6.37109,6.44727A3.0021,3.0021,0,0,1,9.31934,4h5.36132a3.0021,3.0021,0,0,1,2.94825,2.44727l.34668,1.84893a7.95514,7.95514,0,0,1-11.95118,0ZM18.48828,16.916A2.9899,2.9899,0,0,1,16.18066,18H7.81934a3.00057,3.00057,0,0,1-2.94825-3.55273l.71106-3.79236a9.95447,9.95447,0,0,0,12.8357,0l.71106,3.79236A2.99028,2.99028,0,0,1,18.48828,16.916Z"/>
                                </svg>
                              </div>

                              <div className="LOGIN">
                                <Field className={((touched.rayon && errors.rayon)||(values.rayon===""))? "login__error cityArenda":"login cityArenda"} onChange={handleChange} onBlur={handleBlur} name = "rayon" type="text" value={values.rayon} placeholder="Район"/>
                                <div className="" style={{position:"relative"}}>
                                  <svg className={((touched.rayon && errors.rayon)||(values.rayon===""))? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="rgb(235, 87, 87)" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z" fill="#EB5757"/>
                                  </svg>
                                </div>
                                <svg className="userOf" width="20" height="20" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg">
                                  <path opacity="0.3" className="user" d="M640 240v240c0 17.67-14.33 32-32 32H32c-17.67 0-32-14.33-32-32L0 144c0-26.51 21.49-48 48-48H64V24.01c0-13.25 10.75-23.1 24-23.1S112 10.75 112 24.01v72h64V24.01c0-13.25 10.75-23.1 24-23.1S224 10.75 224 24.01v71.1h64V48.01c0-26.51 21.49-48 48-48l96 .0049c26.51 0 48 21.49 48 48v143.1h112C618.5 192 640 213.5 640 240zM128 172c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.375-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V172zM128 268c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.375-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V268zM128 364c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.375-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V364zM256 172c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.375-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V172zM256 268c0-6.625-5.375-12-12-12h-40C197.4 256 192 261.4 192 268v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V268zM256 364c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.38-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V364zM416 76.01c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.375-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V76.01zM416 172c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.38-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V172zM416 268c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.38-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V268zM576 268c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.375-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V268zM576 364c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.375-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V364z"/>
                                </svg>
                              </div>
                            </div>
                            <div className="informOwner">
                            <h2 style={{marginRight:"17px",marginBottom:"20px",textAlign:"center",fontSize:"16px"}}>Информация о владельце</h2>
                            <div className="LOGIN">
                                <Field className={((touched.name && errors.name)||(values.name===""))? "login__error cityArenda":"login cityArenda"} onChange={handleChange} onBlur={handleBlur} name = "name" type="text" value={values.name} placeholder="ФИО"/>
                                <div className="" style={{position:"relative"}}>
                                  <svg className={((touched.name && errors.name)||(values.name===""))? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z" fill="#EB5757"/>
                                  </svg>
                                </div>
                                <svg className="userOf" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <g clipPath="url(#clip0_2831_1547)">
                                  <path opacity="0.3" className="user" d="M10.0013 0C7.14418 0 4.80859 2.33559 4.80859 5.19275C4.80859 8.04991 7.14418 10.3855 10.0013 10.3855C12.8585 10.3855 15.1941 8.04991 15.1941 5.19275C15.1941 2.33559 12.8585 0 10.0013 0Z" fill="#664EF9"/>
                                  <path opacity="0.3" className="user" d="M18.913 14.536C18.7769 14.1959 18.5955 13.8784 18.3915 13.5836C17.3484 12.0416 15.7384 11.0212 13.9244 10.7718C13.6976 10.7492 13.4482 10.7945 13.2668 10.9305C12.3144 11.6335 11.1806 11.9963 10.0014 11.9963C8.82228 11.9963 7.68851 11.6335 6.73612 10.9305C6.5547 10.7945 6.30526 10.7265 6.07853 10.7718C4.26446 11.0212 2.63183 12.0416 1.61143 13.5836C1.40735 13.8784 1.22592 14.2186 1.0899 14.536C1.02189 14.6721 1.04454 14.8308 1.11256 14.9669C1.29398 15.2843 1.52071 15.6018 1.72479 15.8739C2.04224 16.3048 2.38239 16.6902 2.76789 17.053C3.08534 17.3705 3.44815 17.6653 3.81099 17.9601C5.60236 19.2979 7.75657 20.0009 9.97879 20.0009C12.201 20.0009 14.3552 19.2979 16.1466 17.9601C16.5094 17.688 16.8722 17.3705 17.1897 17.053C17.5525 16.6902 17.9153 16.3047 18.2328 15.8739C18.4595 15.5791 18.6636 15.2843 18.845 14.9669C18.9583 14.8308 18.981 14.672 18.913 14.536Z" fill="#664EF9"/>
                                  </g>
                                  <defs>
                                  <clipPath id="clip0_2831_1547">
                                  <rect width="20" height="20" fill="white"/>
                                  </clipPath>
                                  </defs>
                                </svg>
                              </div>

                              <div className="LOGIN">
                                <InputMask mask = "+7\ - 999 999 99 99" maskChar="_" className={((touched.number && errors.number)||(values.number===""))? "login__error cityArenda":"login cityArenda"} onChange={handleChange} onBlur={handleBlur} name = "number" type="text" value={values.number} placeholder="Телефон"/>
                                <div className="" style={{position:"relative"}}>
                                  <svg className={((touched.number && errors.number)||(values.number===""))? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z" fill="#EB5757"/>
                                  </svg>
                                </div>

                                <svg className="userOf" height="25"  viewBox="0 0 512 512" width="25" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                  <path opacity="0.3" className="user" d="M415.9,335.5c-14.6-15-56.1-43.1-83.3-43.1c-6.3,0-11.8,1.4-16.3,4.3c-13.3,8.5-23.9,15.1-29,15.1c-2.8,0-5.8-2.5-12.4-8.2  l-1.1-1c-18.3-15.9-22.2-20-29.3-27.4l-1.8-1.9c-1.3-1.3-2.4-2.5-3.5-3.6c-6.2-6.4-10.7-11-26.6-29l-0.7-0.8  c-7.6-8.6-12.6-14.2-12.9-18.3c-0.3-4,3.2-10.5,12.1-22.6c10.8-14.6,11.2-32.6,1.3-53.5c-7.9-16.5-20.8-32.3-32.2-46.2l-1-1.2  c-9.8-12-21.2-18-33.9-18c-14.1,0-25.8,7.6-32,11.6c-0.5,0.3-1,0.7-1.5,1c-13.9,8.8-24,20.9-27.8,33.2c-5.7,18.5-9.5,42.5,17.8,92.4  c23.6,43.2,45,72.2,79,107.1c32,32.8,46.2,43.4,78,66.4c35.4,25.6,69.4,40.3,93.2,40.3c22.1,0,39.5,0,64.3-29.9  C442.3,370.8,431.5,351.6,415.9,335.5z"/>
                                </svg>
                              </div>

                              <div className="MAIL">
                                <Field className={((touched.mail && errors.mail)||(values.mail==="")||(errors.mail))? "login__error cityArenda":"login cityArenda"} onChange={handleChange} onBlur={handleBlur} name = "mail" type="mail" value={values.mail} placeholder="Электронная почта"/>
                                <div className="" style={{position:"relative"}}>
                                  <svg className={((touched.mail && errors.mail)||(values.mail==="")||(errors.mail))? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z" fill="#EB5757"/>
                                  </svg>
                                </div>
                                <svg className="MessOf"width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <g className = "Mess" opacity="0.3" clipPath="url(#clip0_2831_1591)">
                                  <path className="Mess" d="M15.937 15.6252C16.3304 15.6252 16.6713 15.4953 16.961 15.2389L12.003 10.2806C11.8841 10.3658 11.7688 10.4486 11.6598 10.5274C11.2888 10.8008 10.9877 11.0141 10.7564 11.167C10.5252 11.3202 10.2176 11.4763 9.8336 11.6357C9.44935 11.7954 9.09137 11.8749 8.75928 11.8749H8.74956H8.73984C8.40773 11.8749 8.04975 11.7954 7.66552 11.6357C7.2813 11.4763 6.97368 11.3202 6.7427 11.167C6.51149 11.0141 6.21051 10.8008 5.83929 10.5274C5.73584 10.4516 5.62111 10.3684 5.49707 10.2793L0.538086 15.2389C0.827817 15.4953 1.16889 15.6252 1.56223 15.6252H15.937Z" fill="#686868"/>
                                  <path className="Mess" d="M0.986433 7.15831C0.615429 6.91096 0.286427 6.62768 0 6.30859V13.8521L4.36999 9.48213C3.49574 8.87179 2.36932 8.09807 0.986433 7.15831Z" fill="#686868"/>
                                  <path className="Mess" d="M16.524 7.15831C15.1939 8.05861 14.0633 8.83366 13.1323 9.48388L17.5005 13.8523V6.30859C17.2205 6.62126 16.895 6.90436 16.524 7.15831Z" fill="#686868"/>
                                  <path className="Mess" d="M15.9377 1.875H1.56289C1.0614 1.875 0.675839 2.04435 0.405743 2.38269C0.135425 2.72119 0.000488281 3.14452 0.000488281 3.65221C0.000488281 4.0623 0.179557 4.50663 0.537535 4.98535C0.895513 5.46387 1.27643 5.83973 1.6801 6.11313C1.90139 6.26948 2.56874 6.73342 3.68213 7.50479C4.28317 7.92129 4.80585 8.28432 5.25502 8.5976C5.63787 8.86436 5.96805 9.09537 6.24066 9.28709C6.27195 9.30904 6.32117 9.34424 6.38649 9.39095C6.45687 9.4415 6.54592 9.50565 6.65579 9.58498C6.86736 9.738 7.04313 9.86169 7.18312 9.95618C7.32291 10.0507 7.49229 10.1563 7.691 10.2735C7.88954 10.3906 8.07681 10.4786 8.25257 10.5372C8.42837 10.5957 8.5911 10.6251 8.74081 10.6251H8.75054H8.76026C8.90994 10.6251 9.07271 10.5957 9.24854 10.5372C9.42427 10.4786 9.61137 10.3908 9.81008 10.2735C10.0086 10.1563 10.1777 10.0505 10.318 9.95618C10.458 9.86169 10.6337 9.73803 10.8453 9.58498C10.955 9.50565 11.044 9.44147 11.1144 9.39111C11.1798 9.34421 11.229 9.30923 11.2604 9.28709C11.4728 9.13931 11.8038 8.90925 12.2487 8.6003C13.0583 8.03777 14.2507 7.20982 15.8308 6.11313C16.306 5.78121 16.703 5.38066 17.0221 4.91205C17.3406 4.44344 17.5003 3.95189 17.5003 3.43756C17.5003 3.00784 17.3455 2.64014 17.0365 2.33389C16.7272 2.02802 16.3609 1.875 15.9377 1.875Z" fill="#686868"/>
                                  </g>
                                  <defs>
                                  <clipPath id="clip0_2831_1591">
                                  <rect width="17.5" height="17.5" fill="white"/>
                                  </clipPath>
                                  </defs>
                                </svg>
                              </div>

                              <div className="LOGIN">
                                <Field className={((touched.linkViber && errors.linkViber)||(values.linkViber===""))? "login__error cityArenda":"login cityArenda"} onChange={handleChange} onBlur={handleBlur} name = "linkViber" type="text" value={values.linkViber} placeholder="Ваш Viber"/>
                                <div className="" style={{position:"relative"}}>
                                  <svg className={((touched.linkViber && errors.linkViber)||(values.linkViber===""))? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z" fill="#EB5757"/>
                                  </svg>
                                </div>
                                <svg className="userOf" style={{marginTop:"11px",marginLeft:"23px"}} width="20" height="20" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <rect opacity="0.3" className="user" width="36" height="36" rx="18" fill="none"/>
                                    <path d="M17.9024 10.4075C16.6336 10.4247 13.9035 10.633 12.3763 12.0323C11.2426 13.1594 10.8465 14.821 10.8003 16.8788C10.7608 18.9287 10.7146 22.778 14.4255 23.8267V25.4218C14.4255 25.4218 14.4005 26.0611 14.8223 26.1929C15.343 26.3577 15.6396 25.864 16.134 25.3367L17.0567 24.2953C19.5944 24.5062 21.5388 24.0191 21.7629 23.9466C22.277 23.7819 25.1778 23.4121 25.6524 19.5621C26.1401 15.5869 25.4151 13.0823 24.11 11.9486L24.1034 11.9473C23.708 11.5847 22.1261 10.4313 18.5866 10.4181C18.5866 10.4181 18.3256 10.4016 17.9024 10.4075ZM17.9466 11.5261C18.3058 11.5241 18.5266 11.5393 18.5266 11.5393C21.519 11.5458 22.95 12.4489 23.2861 12.752C24.3869 13.6939 24.9524 15.9528 24.5385 19.2721C24.143 22.4887 21.7899 22.693 21.3549 22.8314C21.1703 22.8907 19.4566 23.3126 17.3 23.1741C17.3 23.1741 15.6923 25.1126 15.1914 25.6136C15.1123 25.6993 15.02 25.7256 14.9607 25.7124C14.875 25.6927 14.8487 25.5872 14.8553 25.4422L14.8684 22.7932C11.7237 21.9231 11.9083 18.6394 11.9413 16.9256C11.9808 15.2119 12.3038 13.8067 13.2595 12.8575C14.5494 11.6909 16.8682 11.5327 17.9459 11.5261H17.9466ZM18.1838 13.2398C18.1579 13.2397 18.1322 13.2447 18.1082 13.2546C18.0842 13.2645 18.0624 13.279 18.0441 13.2973C18.0257 13.3156 18.0111 13.3374 18.0012 13.3613C17.9912 13.3853 17.9861 13.4109 17.9861 13.4369C17.9861 13.4893 18.0069 13.5396 18.044 13.5767C18.0811 13.6138 18.1314 13.6346 18.1838 13.6346C18.6739 13.6253 19.1609 13.7131 19.6168 13.8929C20.0727 14.0728 20.4885 14.3412 20.8401 14.6826C21.5586 15.3813 21.9086 16.3173 21.9217 17.5432C21.9217 17.5692 21.9269 17.5949 21.9368 17.6189C21.9467 17.6429 21.9613 17.6647 21.9797 17.6831C21.998 17.7014 22.0198 17.716 22.0438 17.7259C22.0678 17.7359 22.0935 17.741 22.1195 17.741V17.735C22.1719 17.735 22.2222 17.7142 22.2593 17.6771C22.2964 17.64 22.3172 17.5897 22.3172 17.5373C22.3417 16.9608 22.2485 16.3853 22.0434 15.8459C21.8383 15.3065 21.5255 14.8145 21.1242 14.3999C20.3398 13.6353 19.3498 13.2398 18.1832 13.2398H18.1838ZM15.5777 13.6946C15.4375 13.6746 15.2947 13.7025 15.1723 13.7737H15.1644C14.8941 13.9319 14.645 14.1296 14.4077 14.3933C14.2297 14.6042 14.1302 14.8145 14.1039 15.0188C14.0883 15.1386 14.0996 15.2604 14.1368 15.3754L14.15 15.382C14.3531 15.9792 14.6182 16.5536 14.9409 17.0957C15.3592 17.8549 15.8731 18.5573 16.4701 19.1858L16.4899 19.2121L16.5163 19.2319L16.536 19.2517L16.5558 19.2715C17.1867 19.8699 17.891 20.386 18.6518 20.8072C19.5219 21.2818 20.0505 21.5059 20.3669 21.5982V21.6048C20.4591 21.6311 20.5435 21.6443 20.6292 21.6443C20.8993 21.6246 21.155 21.5151 21.3556 21.3332C21.6126 21.1025 21.8169 20.8468 21.9685 20.5765V20.5699C22.1201 20.2865 22.0674 20.0156 21.8499 19.8311C21.4115 19.4476 20.9369 19.1076 20.4328 18.816C20.0966 18.6315 19.7539 18.7435 19.6155 18.9281L19.3189 19.3031C19.1673 19.4877 18.8904 19.4613 18.8904 19.4613L18.8825 19.4679C16.826 18.9406 16.279 16.8584 16.279 16.8584C16.279 16.8584 16.2526 16.575 16.4437 16.43L16.8129 16.1334C16.9908 15.9884 17.1161 15.6456 16.9249 15.3095C16.6337 14.8051 16.2937 14.3304 15.9099 13.8923C15.8264 13.7888 15.7085 13.7186 15.5777 13.6946ZM18.5259 14.2812C18.4735 14.2814 18.4233 14.3024 18.3863 14.3396C18.3493 14.3768 18.3287 14.4272 18.3288 14.4796C18.329 14.5321 18.35 14.5823 18.3872 14.6192C18.4244 14.6562 18.4748 14.6769 18.5272 14.6767C19.1869 14.6881 19.815 14.9607 20.2739 15.4347C20.481 15.6631 20.6401 15.9307 20.742 16.2216C20.8439 16.5126 20.8865 16.821 20.8671 17.1286C20.8673 17.181 20.8882 17.2311 20.9253 17.268C20.9624 17.305 21.0125 17.3257 21.0649 17.3257L21.0715 17.3336C21.0975 17.3336 21.1233 17.3285 21.1473 17.3185C21.1713 17.3085 21.1932 17.2939 21.2115 17.2755C21.2299 17.2571 21.2444 17.2352 21.2543 17.2111C21.2642 17.187 21.2693 17.1613 21.2692 17.1352C21.289 16.3509 21.0451 15.6918 20.5639 15.1644C20.0828 14.6371 19.4105 14.3405 18.5536 14.2812C18.5444 14.2806 18.5351 14.2806 18.5259 14.2812ZM18.8489 15.3483C18.8225 15.3476 18.7961 15.352 18.7714 15.3614C18.7467 15.3708 18.724 15.385 18.7048 15.4031C18.6855 15.4213 18.67 15.443 18.6592 15.4672C18.6484 15.4913 18.6424 15.5173 18.6416 15.5438C18.6408 15.5702 18.6453 15.5966 18.6547 15.6213C18.6641 15.646 18.6782 15.6686 18.6964 15.6879C18.7145 15.7071 18.7363 15.7226 18.7604 15.7335C18.7846 15.7443 18.8106 15.7503 18.837 15.7511C19.4896 15.784 19.8059 16.1136 19.8455 16.7925C19.8472 16.8438 19.8688 16.8924 19.9057 16.9281C19.9426 16.9637 19.9919 16.9837 20.0432 16.9836H20.0498C20.0764 16.9828 20.1025 16.9766 20.1266 16.9655C20.1507 16.9544 20.1724 16.9385 20.1902 16.9188C20.208 16.8991 20.2217 16.876 20.2305 16.8509C20.2392 16.8258 20.2428 16.7992 20.241 16.7727C20.1948 15.8895 19.7137 15.3945 18.8568 15.3483C18.8542 15.3483 18.8515 15.3483 18.8489 15.3483Z" fill="white"/>
                                </svg>
                              </div>

                              <div className="LOGIN">
                                <Field className={((touched.linkWats && errors.linkWats)||(values.linkWats===""))? "login__error cityArenda":"login cityArenda"} onChange={handleChange} onBlur={handleBlur} name = "linkWats" type="text" value={values.linkWats} placeholder="Ваш Watsup"/>
                                <div className="" style={{position:"relative"}}>
                                  <svg className={((touched.linkWats && errors.linkWats)||(values.linkWats===""))? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z" fill="#EB5757"/>
                                  </svg>
                                </div>
                                <svg className="userOf" style={{marginTop:"11px",marginLeft:"23px"}} width="20" height="20" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <rect opacity="0.3" className="user" width="36" height="36" rx="18"/>
                                    <path d="M23.3797 12.5885C22.6794 11.883 21.8458 11.3237 20.9275 10.9431C20.0092 10.5624 19.0244 10.368 18.0303 10.3711C13.8635 10.3711 10.4721 13.7625 10.4721 17.9322C10.4721 19.2645 10.8212 20.5673 11.4821 21.7118L10.4092 25.6306L14.4176 24.5786C15.5258 25.1823 16.7674 25.499 18.0294 25.4999H18.0322C22.199 25.4999 25.5933 22.1085 25.5933 17.9389C25.5958 16.9451 25.4014 15.9607 25.0213 15.0426C24.6412 14.1244 24.0829 13.2906 23.3788 12.5895L23.3797 12.5885ZM18.0322 24.2239C16.906 24.224 15.8005 23.9213 14.8316 23.3474L14.6017 23.2101L12.2231 23.8328L12.8583 21.5143L12.7095 21.2759C12.078 20.2752 11.7442 19.1155 11.7472 17.9322C11.7493 16.2652 12.4126 14.6671 13.5916 13.4886C14.7706 12.3101 16.369 11.6475 18.036 11.6462C19.7136 11.6462 21.2939 12.3024 22.4794 13.4879C23.0644 14.0708 23.5281 14.7638 23.8437 15.527C24.1593 16.2901 24.3206 17.1083 24.3182 17.9341C24.3153 21.4028 21.4961 24.2229 18.0322 24.2229V24.2239ZM21.478 19.5154C21.2901 19.42 20.3602 18.9641 20.1876 18.9012C20.015 18.8382 19.8891 18.8058 19.7613 18.9965C19.6364 19.1844 19.273 19.6107 19.1624 19.7385C19.0518 19.8635 18.9421 19.8816 18.7542 19.7862C18.5663 19.6908 17.955 19.4915 17.234 18.8478C16.6732 18.3471 16.2927 17.7271 16.182 17.5393C16.0714 17.3514 16.1696 17.2474 16.2659 17.1549C16.3527 17.071 16.4538 16.9346 16.5492 16.824C16.6446 16.7133 16.6741 16.6361 16.7371 16.5083C16.8 16.3834 16.7695 16.2727 16.7218 16.1774C16.6741 16.082 16.2955 15.1521 16.141 14.7735C15.9894 14.4034 15.8311 14.4549 15.7147 14.4483C15.6041 14.4425 15.4791 14.4425 15.3542 14.4425C15.2293 14.4425 15.0233 14.4902 14.8506 14.6781C14.678 14.866 14.1888 15.3247 14.1888 16.2546C14.1888 17.1845 14.8649 18.0819 14.9603 18.2097C15.0557 18.3347 16.2927 20.2449 18.1877 21.0623C18.6378 21.2559 18.9898 21.3722 19.2635 21.4619C19.7165 21.6049 20.1275 21.584 20.4528 21.5363C20.8161 21.4829 21.5705 21.0804 21.7288 20.6388C21.8871 20.1973 21.8871 19.8196 21.8395 19.7414C21.7946 19.6575 21.6697 19.6107 21.479 19.5144L21.478 19.5154Z" fill="white"/>
                                </svg>
                              </div>

                              <div className="LOGIN">
                                <Field className={((touched.linkMail && errors.linkMail)||(values.linkMail===""))? "login__error cityArenda":"login cityArenda"} onChange={handleChange} onBlur={handleBlur} name = "linkMail" type="mail" value={values.linkMail} placeholder="Ваша рабочая почта"/>
                                <div className="" style={{position:"relative"}}>
                                  <svg className={((touched.linkMail && errors.linkMail)||(values.linkMail===""))? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z" fill="#EB5757"/>
                                  </svg>
                                </div>
                                <svg className="MessOf"width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <g className = "Mess" opacity="0.3" clipPath="url(#clip0_2831_1591)">
                                  <path className="Mess" d="M15.937 15.6252C16.3304 15.6252 16.6713 15.4953 16.961 15.2389L12.003 10.2806C11.8841 10.3658 11.7688 10.4486 11.6598 10.5274C11.2888 10.8008 10.9877 11.0141 10.7564 11.167C10.5252 11.3202 10.2176 11.4763 9.8336 11.6357C9.44935 11.7954 9.09137 11.8749 8.75928 11.8749H8.74956H8.73984C8.40773 11.8749 8.04975 11.7954 7.66552 11.6357C7.2813 11.4763 6.97368 11.3202 6.7427 11.167C6.51149 11.0141 6.21051 10.8008 5.83929 10.5274C5.73584 10.4516 5.62111 10.3684 5.49707 10.2793L0.538086 15.2389C0.827817 15.4953 1.16889 15.6252 1.56223 15.6252H15.937Z" fill="#686868"/>
                                  <path className="Mess" d="M0.986433 7.15831C0.615429 6.91096 0.286427 6.62768 0 6.30859V13.8521L4.36999 9.48213C3.49574 8.87179 2.36932 8.09807 0.986433 7.15831Z" fill="#686868"/>
                                  <path className="Mess" d="M16.524 7.15831C15.1939 8.05861 14.0633 8.83366 13.1323 9.48388L17.5005 13.8523V6.30859C17.2205 6.62126 16.895 6.90436 16.524 7.15831Z" fill="#686868"/>
                                  <path className="Mess" d="M15.9377 1.875H1.56289C1.0614 1.875 0.675839 2.04435 0.405743 2.38269C0.135425 2.72119 0.000488281 3.14452 0.000488281 3.65221C0.000488281 4.0623 0.179557 4.50663 0.537535 4.98535C0.895513 5.46387 1.27643 5.83973 1.6801 6.11313C1.90139 6.26948 2.56874 6.73342 3.68213 7.50479C4.28317 7.92129 4.80585 8.28432 5.25502 8.5976C5.63787 8.86436 5.96805 9.09537 6.24066 9.28709C6.27195 9.30904 6.32117 9.34424 6.38649 9.39095C6.45687 9.4415 6.54592 9.50565 6.65579 9.58498C6.86736 9.738 7.04313 9.86169 7.18312 9.95618C7.32291 10.0507 7.49229 10.1563 7.691 10.2735C7.88954 10.3906 8.07681 10.4786 8.25257 10.5372C8.42837 10.5957 8.5911 10.6251 8.74081 10.6251H8.75054H8.76026C8.90994 10.6251 9.07271 10.5957 9.24854 10.5372C9.42427 10.4786 9.61137 10.3908 9.81008 10.2735C10.0086 10.1563 10.1777 10.0505 10.318 9.95618C10.458 9.86169 10.6337 9.73803 10.8453 9.58498C10.955 9.50565 11.044 9.44147 11.1144 9.39111C11.1798 9.34421 11.229 9.30923 11.2604 9.28709C11.4728 9.13931 11.8038 8.90925 12.2487 8.6003C13.0583 8.03777 14.2507 7.20982 15.8308 6.11313C16.306 5.78121 16.703 5.38066 17.0221 4.91205C17.3406 4.44344 17.5003 3.95189 17.5003 3.43756C17.5003 3.00784 17.3455 2.64014 17.0365 2.33389C16.7272 2.02802 16.3609 1.875 15.9377 1.875Z" fill="#686868"/>
                                  </g>
                                  <defs>
                                  <clipPath id="clip0_2831_1591">
                                  <rect width="17.5" height="17.5" fill="white"/>
                                  </clipPath>
                                  </defs>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className="partThreeAdvertisement" style={{marginLeft:"15px"}}>
                            <h2 style={{fontSize:"22px"}}>Ваше фото</h2>
                            <img className={imgUrl2?"IconImgAdvertisement":"IconImgAdvertisement imgerror"} src={imgUrl2?imgUrl2:"https://cdn.dribbble.com/users/2657768/screenshots/6413526/404_43.gif"} alt="" />
                            <button onClick={OwnerImgAdvertisement} type="button" style={{marginTop:"10px"}} className="Voyti choose">Выберите файл</button>
                            <Field id="file-input2" type="file" accept="image/*,.png,.jpg,.gif,.web," value={values.imageOwner} onChange={()=>downLoadImgOwner(event.target,fileReader2,setImgUrl2)} style={{display:"none"}} />
                          </div>
                        </div>
                        <div className={ToggleState===2?"DopInfo":"DopInfoNone"}>
                          <div className="MainOptions" style={{marginBottom:"20px"}}>
                            {/* Первое деление */}
                            <div className="DivisionOptions">
                              <p className="titleOptions">Спальные места</p>
                              <div className="dropdown">
                                <button className="List" id="FiltersleepPlacesDop" type="button" onClick={defaultClickDropDown}>Выберите</button>
                                <ul className="List__dropdown">
                                  <li key={"1 место"} className="dropdown__item">1 место</li>
                                  <li key={"2 место"} className="dropdown__item">2 места</li>
                                  <li key={"3 место"} className="dropdown__item">3 места</li>
                                  <li key={"4 место"} className="dropdown__item">4 места</li>
                                </ul>
                                <input type="text" name="select__category" value="" className="drodown__item__hiden" />
                              </div>
                              <input type="text" id="checkboxInputValue_module" className="drodown__item__hiden" />
                              <div className="checkbox" style={{display:"flex",marginBottom:"10px",marginTop:"30px"}}>
                                <input type="checkbox" value={"Газовая плита"} id="checkbox_module1" onChange={() => ClickCheckbox(1)} className="checkBoxOptions2"/> 
                                <label htmlFor="checkbox_module1" className="textCheckboxOptions">Газовая плита</label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Духовка"} id="checkbox_module2" onChange={() => ClickCheckbox(2)} className=" checkBoxOptions2"/> 
                                <label htmlFor="checkbox_module2" className="textCheckboxOptions">Духовка</label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Кофеварка"} id="checkbox_module3" onChange={() => ClickCheckbox(3)} className=" checkBoxOptions2"/> 
                                <label htmlFor="checkbox_module3" className="textCheckboxOptions">Кофеварка</label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Микроволновая печь"} id="checkbox_module4" onChange={() => ClickCheckbox(4)} className=" checkBoxOptions2"/> 
                                <label htmlFor="checkbox_module4" className="textCheckboxOptions">Микроволновая печь </label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Посуда"} id="checkbox_module5" onChange={() => ClickCheckbox(5)} className=" checkBoxOptions2"/> 
                                <label htmlFor="checkbox_module5" className="textCheckboxOptions">Посуда </label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Посудомоечная машина"} id="checkbox_module6" onChange={() => ClickCheckbox(6)} className=" checkBoxOptions2"/> 
                                <label htmlFor="checkbox_module6" className="textCheckboxOptions">Посудомоечная машина </label>
                              </div>
                            </div>
                          {/* Второе деление */}
                            <div className="DivisionOptions">
                              <p className="titleOptions"style={{visibility:"hidden"}}>Район</p>
                              <div className="dropdown">
                                <button style={{visibility:"hidden"}} className="List" type="button">Выберите</button>
                                <input type="text" name="select__category" value="" className="drodown__item__hiden" />
                              </div>
                              <div className="checkbox" style={{display:"flex",marginBottom:"10px",marginTop:"30px"}}>
                                <input type="checkbox" value={"Газовая плита"} id="checkbox_module7" onChange={() => ClickCheckbox(7)} className=" checkBoxOptions2"/> 
                                <label htmlFor="checkbox_module7" className="textCheckboxOptions">Газовая плита</label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Духовка"} id="checkbox_module8" onChange={() => ClickCheckbox(8)} className=" checkBoxOptions2"/> 
                                <label htmlFor="checkbox_module8" className="textCheckboxOptions">Духовка</label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Кофеварка"} id="checkbox_module9" onChange={() => ClickCheckbox(9)} className=" checkBoxOptions2"/> 
                                <label htmlFor="checkbox_module9" className="textCheckboxOptions">Кофеварка</label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Микроволновая печь"} id="checkbox_module10" onChange={() => ClickCheckbox(10)} className=" checkBoxOptions2"/> 
                                <label htmlFor="checkbox_module10" className="textCheckboxOptions">Микроволновая печь </label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Посуда"} id="checkbox_module11" onChange={() => ClickCheckbox(11)} className=" checkBoxOptions2"/> 
                                <label htmlFor="checkbox_module11" className="textCheckboxOptions">Посуда </label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Посудомоечная машина"} id="checkbox_module12" onChange={() => ClickCheckbox(12)} className=" checkBoxOptions2"/> 
                                <label htmlFor="checkbox_module12" className="textCheckboxOptions">Посудомоечная машина </label>
                              </div>
                            </div>
                            {/* Третие делене */}
                            <div className="DivisionOptions">
                              <p className="titleOptions"style={{visibility:"hidden"}}>Район</p>
                              <div className="dropdown">
                                <button style={{visibility:"hidden"}} className="List" type="button">Выберите</button>
                                <input type="text" name="select__category" value="" className="drodown__item__hiden" />
                              </div>
                              <div className="checkbox" style={{display:"flex",marginBottom:"10px",marginTop:"30px"}}>
                                <input type="checkbox" value={"Газовая плита"} id="checkbox_module13" onChange={() => ClickCheckbox(13)} className=" checkBoxOptions2"/> 
                                <label htmlFor="checkbox_module13" className="textCheckboxOptions">Газовая плита</label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Духовка"} id="checkbox_module14" onChange={() => ClickCheckbox(14)} className=" checkBoxOptions2"/> 
                                <label htmlFor="checkbox_module14" className="textCheckboxOptions">Духовка</label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Кофеварка"} id="checkbox_module15" onChange={() => ClickCheckbox(15)} className=" checkBoxOptions2"/> 
                                <label htmlFor="checkbox_module15" className="textCheckboxOptions">Кофеварка</label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Микроволновая печь"} id="checkbox_module16" onChange={() => ClickCheckbox(16)} className=" checkBoxOptions2"/> 
                                <label htmlFor="checkbox_module16" className="textCheckboxOptions">Микроволновая печь </label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Посуда"} id="checkbox_module17" onChange={() => ClickCheckbox(17)} className=" checkBoxOptions2"/> 
                                <label htmlFor="checkbox_module17" className="textCheckboxOptions">Посуда </label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Посудомоечная машина"} id="checkbox_module18" onChange={() => ClickCheckbox(18)} className=" checkBoxOptions2"/> 
                                <label htmlFor="checkbox_module18" className="textCheckboxOptions">Посудомоечная машина </label>
                              </div>
                            </div>
                          {/* Четвертое деление */}
                            <div className="DivisionOptions">
                            <div className="dropdown" style={{visibility: "hidden"}}>
                            <p className="titleOptions">Метро</p>
                              <div className="dropdown">
                                <button className="List" type="button" >Выберите</button>
                                <input type="text" name="select__category"  className="drodown__item__hiden" />
                              </div>
                              </div>
                              <div className="checkbox" style={{display:"flex",marginBottom:"10px",marginTop:"30px"}}>
                                  <input type="checkbox" value={"Газовая плита"} id="checkbox_module19" onChange={() => ClickCheckbox(19)} className=" checkBoxOptions2"/> 
                                  <label htmlFor="checkbox_module19" className="textCheckboxOptions">Газовая плита</label>
                                </div>
                                <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                  <input type="checkbox" value={"Духовка"} id="checkbox_module20" onChange={() => ClickCheckbox(20)} className=" checkBoxOptions2"/> 
                                  <label htmlFor="checkbox_module20" className="textCheckboxOptions">Духовка</label>
                                </div>
                                <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                  <input type="checkbox" value={"Кофеварка"} id="checkbox_module21" onChange={() => ClickCheckbox(21)} className=" checkBoxOptions2"/> 
                                  <label htmlFor="checkbox_module21" className="textCheckboxOptions">Кофеварка</label>
                                </div>
                                <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                  <input type="checkbox" value={"Микроволновая печь"} id="checkbox_module22" onChange={() => ClickCheckbox(22)} className=" checkBoxOptions2"/> 
                                  <label htmlFor="checkbox_module22" className="textCheckboxOptions">Микроволновая печь </label>
                                </div>
                                <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                  <input type="checkbox" value={"Посуда"} id="checkbox_module23" onChange={() => ClickCheckbox(23)} className=" checkBoxOptions2"/> 
                                  <label htmlFor="checkbox_module23" className="textCheckboxOptions">Посуда </label>
                                </div>
                                <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                  <input type="checkbox" value={"Посудомоечная машина"} id="checkbox_module24" onChange={() => ClickCheckbox(24)} className=" checkBoxOptions2"/> 
                                  <label htmlFor="checkbox_module24" className="textCheckboxOptions">Посудомоечная машина </label>
                                </div>
                            </div>
                          {/* Пятое деление */}
                            <div className="DivisionOptions">
                              <div className="dropdown" style={{visibility: "hidden"}}>
                                <p className="titleOptions" >Метро</p>
                                <button className="List" id = "FilterMetro" type="button" onClick={defaultClickDropDown}>Выберите</button>
                                <ul className="List__dropdown">
                                  <li key = {"Грушевка"} className="dropdown__item">Грушевка</li>
                                </ul>
                                <input type="text" name="select__category"  className="drodown__item__hiden" />
                              </div>
                              <div className="checkbox" style={{display:"flex",marginBottom:"10px",marginTop:"30px"}}>
                                  <input type="checkbox" value={"Газовая плита"} id="checkbox_module25" onChange={() => ClickCheckbox(25)} className=" checkBoxOptions2"/> 
                                  <label htmlFor="checkbox_module25" className="textCheckboxOptions">Газовая плита</label>
                                </div>
                                <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                  <input type="checkbox" value={"Духовка"} id="checkbox_module26" onChange={() => ClickCheckbox(26)} className=" checkBoxOptions2"/> 
                                  <label htmlFor="checkbox_module26" className="textCheckboxOptions">Духовка</label>
                                </div>
                                <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                  <input type="checkbox" value={"Кофеварка"} id="checkbox_module27" onChange={() => ClickCheckbox(27)} className=" checkBoxOptions2"/> 
                                  <label htmlFor="checkbox_module27" className="textCheckboxOptions">Кофеварка</label>
                                </div>
                                <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                  <input type="checkbox" value={"Микроволновая печь"} id="checkbox_module28" onChange={() => ClickCheckbox(28)} className=" checkBoxOptions2"/> 
                                  <label htmlFor="checkbox_module28" className="textCheckboxOptions">Микроволновая печь </label>
                                </div>
                                <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                  <input type="checkbox" value={"Посуда"} id="checkbox_module29" onChange={() => ClickCheckbox(29)} className=" checkBoxOptions2"/> 
                                  <label htmlFor="checkbox_module29" className="textCheckboxOptions">Посуда </label>
                                </div>
                                <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                  <input type="checkbox" value={"Посудомоечная машина"} id="checkbox_module30" onChange={() => ClickCheckbox(30)} className=" checkBoxOptions2"/> 
                                  <label htmlFor="checkbox_module30" className="textCheckboxOptions">Посудомоечная машина </label>
                                </div>
                            </div>
                          </div>
                        </div>
                        <div className={ToggleState===3?"DopInfo":"DopInfoNone"}>
                          <div className="Message">
                            <p className="Contacts__text">Описание объявления</p>
                              <textarea name="description" className={(values.description=="")?"TextAreaMes__error":"TextAreaMes"} onChange={handleChange} onBlur={handleBlur} value={values.description} placeholder="Описание" cols={30} rows={10}></textarea>
                          </div>
                        </div>
                        <div className="" style={{display:"flex",justifyContent:"center"}}>
                          <div style={{width:"fit-content",padding:"9px 16px"}} className={("ErrorEnter" && ((touched.sent && errors.sent) || (touched.square && errors.square) || (touched.mail && errors.mail) || (touched.linkMail && errors.linkMail) || (values.city=="" || values.total=="" || values.rooms=="" || values.linkViber=="" || values.linkWats=="" || values.linkMail=="" || values.mail=="" || values.metro=="" || values.name=="" || values.number=="" || values.square=="" || values.rayon=="" || values.sent=="" || !imgUrl || !imgUrl2 || values.description=="")))? "ErrorEnter fix":"ErrorEnter"}>
                              <p className="ErrorEnterText">Не все поля заполнены</p>
                              <div className="">
                              <svg style={{marginLeft:"15px",paddingTop:"5px"}} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 0C4.5 0 0 4.5 0 10C0 15.5 4.5 20 10 20C15.5 20 20 15.5 20 10C20 4.5 15.5 0 10 0ZM10 2C11.1 2 11.9 2.9 11.8 4L11 12H9L8.2 4C8.1 2.9 8.9 2 10 2ZM10 18C8.9 18 8 17.1 8 16C8 14.9 8.9 14 10 14C11.1 14 12 14.9 12 16C12 17.1 11.1 18 10 18Z" fill="white" fillOpacity="0.5"/>
                              </svg>
                            </div>
                            </div>
                        </div>
                        <div className="" style={{display:"flex",justifyContent:"center"}}>
                          <button className="Voyti choose" type="submit" disabled={(values.city=="" || (errors.mail) || (errors.sent) || (errors.square) || (errors.linkMail) || values.total=="" || values.rooms=="" || values.linkViber=="" || values.linkWats=="" || values.linkMail=="" || values.mail=="" || values.metro=="" || values.name=="" || values.number=="" || values.square=="" || values.rayon=="" || values.sent=="" || imgUrl || imgUrl2 || values.description=="")?!isValid:isValid}  onClick={()=>{handleSubmit}}>Разместить объявление</button>
                        </div>
                        </Form>
                      )}
                    </Formik>
                </div>
              </div>
             </section>
          </>
          :<></>
        }
      </Modal>
      <ToastContainer/>
      </>
  );
}
export default Header