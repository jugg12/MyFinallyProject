import { Field, Form, Formik } from "formik";
import { cityIn } from 'lvovich';
import React,{ useEffect, useState } from "react";
import { ToastContainer } from 'react-toastify';
import { useSelector,useDispatch } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "../../axios";
import ClickCheckbox from "../Functions/ClickCheckBox";
import ArendaRoom from "../Catalog/ArendaInfo/ArendaRoom";
import "./Homepage.css";
import {defaultClickDropDown, FilterFromHomePage, MouseLeaveMouseEnterList } from "../Functions/Homepagejs";
import img8 from "../../img/footer/11.svg";
import img5 from "../../img/footer/7.svg";
import img6 from "../../img/footer/9.svg";
import img1 from "../../img/section2/1.svg";
import img2 from "../../img/section2/2.svg";
import img3 from "../../img/section2/3.svg";
import img4 from "../../img/section2/4.svg";
import MapSelect from "../MapPage/mapSelect";
import Modal from "../Modules/module";
import {advertisementItem, ArendaCardProduct,cities,NewsItem} from "../../interfaces";
import InputMask from 'react-input-mask';
import { notifyConfirm,notifyErrorAddAdvertisement,notifyErrorAuthorization,notifyErrorCity } from "../Toasts/ToastsContent";
import {setCategoryId,setCategoryInfoId,setCity,setFilterAll,clearFilter, setRooms, setSort} from "../../store/slices/FilterSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import { validationSchemaAdvertisements } from "../../ValidationSchema";
import { FileObjectAdvertisementFromAdvertisement, OwnerImgAdvertisementFromAdvertisement } from "../Functions/btnChooseFile";
import OptionsClick from "../Functions/OptionsClick";
import { downLoadImgAdvertisements, downLoadImgOwner, handlePriceMax, handlePriceMin } from "../HandlersOnChanges/handleOnChange";
import NewsHomePage from "../Skeletons/newsItemsHomePage";
import uniqid from 'uniqid';

export default function Homepage(){
  const [arendaLength,setArendaLength]=useState<number>();
  const [arendaLength2,setArendaLength2]=useState<number>();
  const [arendaLength3,setArendaLength3]=useState<number>();
  const [arendaLength4,setArendaLength4]=useState<number>();
  const [arendaLength5,setArendaLength5]=useState<number>();
  const [arendaLength6,setArendaLength6]=useState<number>();
  const [Cities,setCities]=useState<cities[]>([]);
  const [imgUrl,setImgUrl] = useState<any>("");
  const [imgUrl2,setImgUrl2] = useState<any>("");
  const [Rayon,setRayon] = useState<any>([]);
  const [advertisement,setadvertisement] = useState<advertisementItem[]>([]);
  const [currentPage] = useState<number>(1);
  const [news,setNews]=useState<NewsItem[]>([]);
  const [data2,setData2]=useState<boolean>(true);
  const [priceMin, setpriceMin] = useState<number>(null);
  const [priceMax, setpriceMax] = useState<number>(null);
  const [Loading,setLoading] = useState<boolean>(true);
  const navigate=useNavigate();
  const [NewsPerPage]=useState<number>(5);
  const[mapInfoModal,setMapInfoModal] = useState<boolean>(false);
  const[modalAdvertisements,setModalAdvertisements] = useState<boolean>(false);
  let LastIndex = currentPage*NewsPerPage;
  let FirstIndex= LastIndex-NewsPerPage;
  let currentPer=news.slice(FirstIndex,LastIndex);
  let id = localStorage.getItem("id");
  let login=localStorage.getItem("login");
  const [Arenda,setArenda] = useState<ArendaCardProduct[]>([]);
  const filterrooms = document.getElementById("ListFilter");
  const filtersleepPlaces = document.getElementById("FiltersleepPlaces");
  const filterRayon = document.getElementById("FilterRayon");
  const filterMetro = document.getElementById("FilterMetro2");
  const inputCheckboxInfo = document.getElementById("checkboxInputValue");
  const inputCity = document.getElementById("#inputCity");
  const fileReader = new FileReader();
  const fileReader2 = new FileReader();
  const checkboxInputValue_module = document.getElementById("checkboxInputValue_module");
  const FiltersleepPlacesDop = document.getElementById("FiltersleepPlacesDop");
  
  if(document.querySelector(".head")){
    document.querySelector(".head").classList.remove("headerHide");
    document.querySelector("header").classList.remove("headerHide");
    document.querySelector("footer").classList.remove ("headerHide");
  }
  // redux info
  const dispatch = useDispatch();
  const filter = useSelector((state:any) => state.filter);
  const filterAll = useSelector((state:any) => state.filter.filterAll);
  // end redux info

  const Show = (value,priceMax,filterrooms,filtersleepPlaces,filterRayon,filterMetro,input)=>{
    if (inputCity.textContent=="Выберите"){
      notifyErrorCity()
    }
    else {
      dispatch(setRooms(""))
      dispatch(setCity(inputCity.textContent));
      const item=[filterRayon,filterrooms,value,priceMax,filtersleepPlaces,filterMetro,input,inputCity.textContent]; 
      dispatch(setFilterAll(item));
      navigate("/catalog/city=?")
    }
  }

  useEffect(()=>{ //Удаление скрола при модальном окне
    if(mapInfoModal==true || modalAdvertisements==true){
     document.body.style.overflow="hidden"
    }
    else if(mapInfoModal==false && modalAdvertisements==false){
      document.body.style.overflow="auto"
    }
  },[mapInfoModal,modalAdvertisements])

  useEffect(() => { //Кол-во предложений в каждом городе
    axios.get(`/ArendaCard?city2=Минск`).then(({data})=>{
      setArendaLength(data.length);
      setArenda(data);
    })
    axios.get(`/ArendaCard?city2=Гомель`).then(({data})=>{
      setArendaLength2(data.length);
      setArenda(data);
    })
    axios.get(`/ArendaCard?city2=Гродно`).then(({data})=>{
      setArendaLength3(data.length);
      setArenda(data);
    })
    axios.get(`/ArendaCard?city2=Могилев`).then(({data})=>{
      setArendaLength4(data.length);
      setArenda(data);
    })
    axios.get(`/ArendaCard?city2=Брест`).then(({data})=>{
      setArendaLength5(data.length);
      setArenda(data);
    })
    axios.get(`/ArendaCard?city2=Витебск`).then(({data})=>{
      setArendaLength6(data.length);
      setArenda(data);
    })
    axios.get(`/NewsCard`).then(({data})=>{
      setNews(data);
      setLoading(false)
    })
    axios.get(`/Cities`).then(({data})=>{
      setCities(data);
    })
    axios.get("/categories?categoria=rayon").then((data) => {
      setRayon(data.data);
    });
    dispatch(setCity("Минск"))
    dispatch(setRooms("Квартиры на сутки"));
    dispatch(setSort("По умолчанию"));
    dispatch(clearFilter(filterAll));
  },[]);
  
  const push = (item) =>{
    navigate(`/news/${item}`);
    window.scrollTo({top:0,behavior:"smooth"});
  }

  const push2 = (item) =>{
    dispatch(setCity(item));
    dispatch(setRooms(""))
    navigate(`/catalog/city=`);
    window.scrollTo({top:0,behavior:"smooth"});
  }

  useEffect(()=>{
    if (login){
      axios.get(`/users?login=${login}`).then((data) => {
        setadvertisement(data.data[0].advertisement);
        setData2(false) 
      });
    }
  },[data2,login])
  
  const addArenda = (value) => {
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
          
          axios.patch(`/users/${id}`, advertisement.length?{
            "advertisement":
              [...advertisement,item]
          }:{
            "advertisement":
              [item]
            }
          ).catch(err => console.error(err));
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
            notifyConfirm();
            dispatch(setCategoryInfoId(1))
      }
  }

  return(
    <>
      <section className="first">
        <div className="conteiner">
          <div className="first__block">
            <div className="block__item">
              <h1 className="innerText">Sdaem.by - у нас живут <span style = {{color:"#FFD54F"}} > ваши объявления</span></h1>
              <div className="all" >
                <div className="block__tabs">
                    <div className={filter.category === 1 ? "tabs tabs__active":"tabs"} onClick={()=>dispatch(setCategoryId(1))} >
                      <p className="select__item" >Квартиры на сутки</p>
                    </div>
                    <div className={filter.category === 2 ? "tabs tabs__active":"tabs"} onClick={()=>{dispatch(setCategoryId(2)); OptionsClick(false)}}>
                      <p className="select__item" >Котеджи и усадьбы</p>
                    </div>
                    <div className={filter.category === 3 ? "tabs tabs__active":"tabs"} onClick={()=>{dispatch(setCategoryId(3)); OptionsClick(false)}}>
                      <p className="select__item">Бани и сауны</p>
                    </div>
                    <div className={filter.category === 4 ? "tabs tabs__active":"tabs"} onClick={()=>{dispatch(setCategoryId(4)); OptionsClick(false)}}>
                      <p className="select__item">Авто напрокат</p>   
                    </div>
                </div>
              </div>
              <div className="select__filter">
                <div className={filter.category===1? "select__filter__item":"select__filter__item__hidden"}>
                  <p className="select__filter__item__css">Город</p>
                    <div className="dropdown">
                      <button className="List" id="#inputCity" onClick={defaultClickDropDown} >Выберите</button >
                      <ul className="List__dropdown">
                        <li className="dropdown__item" key={"Минск"} >Минск</li>
                        <li className="dropdown__item" key={"Гомель"}>Гомель</li>
                        <li className="dropdown__item" key={"Гродно"}>Гродно</li>
                        <li className="dropdown__item" key={"Могилев"}>Могилев</li>
                        <li className="dropdown__item" key={"Брест"}>Брест</li>
                        <li className="dropdown__item" key={"Витебск"}>Витебск</li>
                      </ul>
                      <input type="text" name="select__category" className="drodown__item__hiden" />
                    </div>
                </div>
                <div className={filter.category===1? "select__filter__item":"select__filter__item__hidden"}>
                  <p className="select__filter__item__css">Комнаты</p>
                    <div className="dropdown">
                      <button className="List" id="ListFilter" onClick={defaultClickDropDown}>Выберите</button>
                      <ul className="List__dropdown">
                        <li key={1} className="dropdown__item">1 комната</li>
                        <li key={2} className="dropdown__item">2 комнаты</li>
                        <li key={3} className="dropdown__item">3 комнаты</li>
                        <li key={4} className="dropdown__item">4 комнаты</li>
                        <li key={5} className="dropdown__item">5 комнат</li>
                      </ul>
                      <input type="text" name="select__category" className="drodown__item__hiden" />
                    </div>
                </div>
                <div className={filter.category===1? "select__filter__item":"select__filter__item__hidden"}>
                <p className="select__filter__item__css">Цена за сутки (BYN)</p>
                <div className="filter">
                  <input className="filter__input" id="filter__input1" type="text" placeholder="От" value={priceMin!==0?priceMin:null} onChange={()=>handlePriceMin(event.target,setpriceMin)}/>
                  <p className="filter__text">-</p>
                  <input className="filter__input" id="filter__input2" type="text" placeholder="До" value={priceMax!==0?priceMax:null} onChange={()=>handlePriceMax(event.target,setpriceMax)}/>
                </div>
                </div>
                <div className={filter.category===1? "select__filter__item":"select__filter__item__hidden"}>
                  <div className="raz Options" onClick={()=>OptionsClick(true)}>
                    <p className="select__filter__item__css2">Больше опций</p>
                    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.91109 4.29814C5.91109 2.90551 4.937 1.73697 3.63453 1.4358V0.661897C3.63453 0.296309 3.33822 0 2.97264 0C2.60705 0 2.31074 0.296309 2.31074 0.661897V1.4358C1.00835 1.73689 0.0341797 2.90551 0.0341797 4.29814C0.0341797 5.69077 1.00827 6.85931 2.31074 7.16048V17.3381C2.31074 17.7037 2.60705 18 2.97264 18C3.33822 18 3.63453 17.7037 3.63453 17.3381V7.16048C4.937 6.85931 5.91109 5.69077 5.91109 4.29814ZM1.35805 4.29814C1.35805 3.40781 2.08238 2.68348 2.97271 2.68348C3.86303 2.68348 4.58737 3.40781 4.58737 4.29814C4.58737 5.18846 3.86303 5.9128 2.97271 5.9128C2.08238 5.9128 1.35805 5.18846 1.35805 4.29814Z" fill="#664EF9"/>
                      <path d="M8.66188 8.89222V0.661897C8.66188 0.296309 8.36557 0 7.99998 0C7.63439 0 7.33808 0.296309 7.33808 0.661897V8.89222C6.03569 9.19331 5.06152 10.3619 5.06152 11.7546C5.06152 13.1472 6.03562 14.3157 7.33808 14.6169V17.3381C7.33808 17.7037 7.63439 18 7.99998 18C8.36557 18 8.66188 17.7037 8.66188 17.3381V14.6169C9.96427 14.3158 10.9384 13.1472 10.9384 11.7546C10.9384 10.3619 9.96434 9.19338 8.66188 8.89222ZM6.38539 11.7546C6.38539 10.8642 7.10973 10.1399 8.00005 10.1399C8.89038 10.1399 9.61471 10.8642 9.61471 11.7546C9.61471 12.6449 8.89038 13.3692 8.00005 13.3692C7.10973 13.3692 6.38539 12.6449 6.38539 11.7546Z" fill="#664EF9"/>
                      <path d="M15.9658 7.20151C15.9658 5.80888 14.9917 4.64034 13.6892 4.33918V0.661897C13.6892 0.296309 13.3929 0 13.0273 0C12.6617 0 12.3654 0.296309 12.3654 0.661897V4.33918C11.063 4.64027 10.0889 5.80888 10.0889 7.20151C10.0889 8.59415 11.063 9.76269 12.3654 10.0639V17.3381C12.3654 17.7037 12.6617 18 13.0273 18C13.3929 18 13.6892 17.7037 13.6892 17.3381V10.0639C14.9917 9.76269 15.9658 8.59415 15.9658 7.20151ZM11.4127 7.20151C11.4127 6.31119 12.1371 5.58685 13.0274 5.58685C13.9177 5.58685 14.6421 6.31119 14.6421 7.20151C14.6421 8.09184 13.9177 8.81618 13.0274 8.81618C12.1371 8.81618 11.4127 8.09184 11.4127 7.20151Z" fill="#664EF9"/>
                    </svg>
                  </div>
                </div>
                <div className={filter.category===1? "select__filter__item select__filter__item2":"select__filter__item__hidden"}>
                  <div className="raz" onClick={()=>setMapInfoModal(true)}>
                    <p className="select__filter__item__css2 ">На карте</p>
                    <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.0069 3.11628C9.90811 1.44186 8.09415 0.5 6.05346 0.5C4.0302 0.5 2.21625 1.44186 1.08253 3.11628C-0.0511958 4.75581 -0.312824 6.84884 0.384851 8.68023C0.576711 9.1686 0.873223 9.67442 1.25694 10.1279L5.66973 15.3256C5.77439 15.4302 5.87904 15.5 6.03601 15.5C6.19299 15.5 6.29764 15.4302 6.40229 15.3256L10.8325 10.1279C11.2162 9.67442 11.5302 9.18605 11.7046 8.68023C12.4023 6.84884 12.1407 4.75581 11.0069 3.11628ZM6.05346 9.2907C4.55346 9.2907 3.31508 8.05233 3.31508 6.55233C3.31508 5.05233 4.55346 3.81395 6.05346 3.81395C7.55346 3.81395 8.79183 5.05233 8.79183 6.55233C8.79183 8.05233 7.5709 9.2907 6.05346 9.2907Z" fill="#664EF9"/>
                    </svg>
                  </div>
                </div>
                <div className={filter.category===1? "select__filter__item select__filter__item4":"select__filter__item__hidden"}>
                      <button className="Voyti choose choose3" onClick={()=>Show(priceMin,priceMax,filterrooms.textContent,filtersleepPlaces.textContent,filterRayon.textContent,filterMetro.textContent,(inputCheckboxInfo as HTMLInputElement).value)}>
                        <div className="btnarrow">
                          <p className="t"> Показать</p>
                          <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1.21484 10.75L5.96484 6L1.21484 1.25" stroke="#242424" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                      </div>
                      </button>
                      <button className="Voyti choose choose2" onClick={()=>Show(priceMin,priceMax,filterrooms.textContent,filtersleepPlaces.textContent,filterRayon.textContent,filterMetro.textContent,(inputCheckboxInfo as HTMLInputElement).value)}>
                        <div className="btnarrow">
                          <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1.21484 10.75L5.96484 6L1.21484 1.25" stroke="#242424" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                      </div>
                      </button>
                </div>
                <h1 className={filter.category===1? "Razrabotka__hidden":"Razrabotka"}>В разработке</h1>
              </div>
              <div className="DopOptions">
                <div className="MainOptions">
                  {/* Первое деление */}
                  <div className="DivisionOptions">
                    <p className="titleOptions">Спальные места</p>
                    <div className="dropdown">
                      <button className="List" id = "FiltersleepPlaces" onClick={defaultClickDropDown}>Выберите</button>
                      <ul className="List__dropdown">
                        <li key={"1 место"} className="dropdown__item">1 место</li>
                        <li key={"2 место"} className="dropdown__item">2 места</li>
                        <li key={"3 место"} className="dropdown__item">3 места</li>
                        <li key={"4 место"} className="dropdown__item">4 места</li>
                      </ul>
                      <input type="text" name="select__category"  className="drodown__item__hiden" />
                    </div>
                    <input type="text" id="checkboxInputValue" defaultValue={""} className="drodown__item__hiden" />
                    <div className="checkbox" style={{display:"flex",marginBottom:"10px",marginTop:"30px"}}>
                      <input type="checkbox" value={"Газовая плита"} id="checkbox1" onChange={() => ClickCheckbox(1)} className="checkBoxOptions"/> 
                      <label htmlFor="checkbox1" className="textCheckboxOptions">Газовая плита</label>
                    </div>
                    <div className="" style={{display:"flex",marginBottom:"10px"}}>
                      <input type="checkbox" value={"Духовка"} id="checkbox2" onChange={() => ClickCheckbox(2)} className="checkBoxOptions"/> 
                      <label htmlFor="checkbox2" className="textCheckboxOptions">Духовка</label>
                    </div>
                    <div className="" style={{display:"flex",marginBottom:"10px"}}>
                      <input type="checkbox" value={"Кофеварка"} id="checkbox3" onChange={() => ClickCheckbox(3)} className="checkBoxOptions"/> 
                      <label htmlFor="checkbox3" className="textCheckboxOptions">Кофеварка</label>
                    </div>
                    <div className="" style={{display:"flex",marginBottom:"10px"}}>
                      <input type="checkbox" value={"Микроволновая печь"} id="checkbox4" onChange={() => ClickCheckbox(4)} className="checkBoxOptions"/> 
                      <label htmlFor="checkbox4" className="textCheckboxOptions">Микроволновая печь </label>
                    </div>
                    <div className="" style={{display:"flex",marginBottom:"10px"}}>
                      <input type="checkbox" value={"Посуда"} id="checkbox5" onChange={() => ClickCheckbox(5)} className="checkBoxOptions"/> 
                      <label htmlFor="checkbox5" className="textCheckboxOptions">Посуда </label>
                    </div>
                    <div className="" style={{display:"flex",marginBottom:"10px"}}>
                      <input type="checkbox" value={"Посудомоечная машина"} id="checkbox6" onChange={() => ClickCheckbox(6)} className="checkBoxOptions"/> 
                      <label htmlFor="checkbox6" className="textCheckboxOptions">Посудомоечная машина </label>
                    </div>
                  </div>
                {/* Второе деление */}
                  <div className="DivisionOptions">
                    <p className="titleOptions">Район</p>
                    <div className="dropdown">
                      <button className="List" id="FilterRayon" onClick={defaultClickDropDown}>Выберите</button>
                      <ul className="List__dropdown">     
                        <>
                        {
                            Rayon.map((item)=>{
                              return(
                              <li key = {"dropdown__item"+item.value} className="dropdown__item">{(item.value).substring(0,(item.value).indexOf(" ",0))}</li>
                              )
                            })
                        } 
                        </>
                      </ul>
                      <input type="text" name="select__category" value="" className="drodown__item__hiden" />
                    </div>
                    <div className="checkbox" style={{display:"flex",marginBottom:"10px",marginTop:"30px"}}>
                      <input type="checkbox" value={"Газовая плита"} id="checkbox7" onChange={() => ClickCheckbox(7)} className="checkBoxOptions"/> 
                      <label htmlFor="checkbox7" className="textCheckboxOptions">Газовая плита</label>
                    </div>
                    <div className="" style={{display:"flex",marginBottom:"10px"}}>
                      <input type="checkbox" value={"Духовка"} id="checkbox8" onChange={() => ClickCheckbox(8)} className="checkBoxOptions"/> 
                      <label htmlFor="checkbox8" className="textCheckboxOptions">Духовка</label>
                    </div>
                    <div className="" style={{display:"flex",marginBottom:"10px"}}>
                      <input type="checkbox" value={"Кофеварка"} id="checkbox9" onChange={() => ClickCheckbox(9)} className="checkBoxOptions"/> 
                      <label htmlFor="checkbox9" className="textCheckboxOptions">Кофеварка</label>
                    </div>
                    <div className="" style={{display:"flex",marginBottom:"10px"}}>
                      <input type="checkbox" value={"Микроволновая печь"} id="checkbox10" onChange={() => ClickCheckbox(10)} className="checkBoxOptions"/> 
                      <label htmlFor="checkbox10" className="textCheckboxOptions">Микроволновая печь </label>
                    </div>
                    <div className="" style={{display:"flex",marginBottom:"10px"}}>
                      <input type="checkbox" value={"Посуда"} id="checkbox11" onChange={() => ClickCheckbox(11)} className="checkBoxOptions"/> 
                      <label htmlFor="checkbox11" className="textCheckboxOptions">Посуда </label>
                    </div>
                    <div className="" style={{display:"flex",marginBottom:"10px"}}>
                      <input type="checkbox" value={"Посудомоечная машина"} id="checkbox12" onChange={() => ClickCheckbox(12)} className="checkBoxOptions"/> 
                      <label htmlFor="checkbox12" className="textCheckboxOptions">Посудомоечная машина </label>
                    </div>
                  </div>
                  {/* Третие делене */}
                  <div className="DivisionOptions">
                    <p className="titleOptions">Метро</p>
                    <div className="dropdown">
                      <button className="List" id = "FilterMetro2" onClick={defaultClickDropDown}>Выберите</button>
                      <ul className="List__dropdown">
                        <li key={"Грушевка"} className="dropdown__item">Грушевка</li>
                      </ul>
                      <input type="text" name="select__category"  className="drodown__item__hiden" />
                    </div>
                    <div className="checkbox" style={{display:"flex",marginBottom:"10px",marginTop:"30px"}}>
                      <input type="checkbox" value={"Газовая плита"} id="checkbox13" onChange={() => ClickCheckbox(13)} className="checkBoxOptions"/> 
                      <label htmlFor="checkbox13" className="textCheckboxOptions">Газовая плита</label>
                    </div>
                    <div className="" style={{display:"flex",marginBottom:"10px"}}>
                      <input type="checkbox" value={"Духовка"} id="checkbox14" onChange={() => ClickCheckbox(14)} className="checkBoxOptions"/> 
                      <label htmlFor="checkbox14" className="textCheckboxOptions">Духовка</label>
                    </div>
                    <div className="" style={{display:"flex",marginBottom:"10px"}}>
                      <input type="checkbox" value={"Кофеварка"} id="checkbox15" onChange={() => ClickCheckbox(15)} className="checkBoxOptions"/> 
                      <label htmlFor="checkbox15" className="textCheckboxOptions">Кофеварка</label>
                    </div>
                    <div className="" style={{display:"flex",marginBottom:"10px"}}>
                      <input type="checkbox" value={"Микроволновая печь"} id="checkbox16" onChange={() => ClickCheckbox(16)} className="checkBoxOptions"/> 
                      <label htmlFor="checkbox16" className="textCheckboxOptions">Микроволновая печь </label>
                    </div>
                    <div className="" style={{display:"flex",marginBottom:"10px"}}>
                      <input type="checkbox" value={"Посуда"} id="checkbox17" onChange={() => ClickCheckbox(17)} className="checkBoxOptions"/> 
                      <label htmlFor="checkbox17" className="textCheckboxOptions">Посуда </label>
                    </div>
                    <div className="" style={{display:"flex",marginBottom:"10px"}}>
                      <input type="checkbox" value={"Посудомоечная машина"} id="checkbox18" onChange={() => ClickCheckbox(18)} className="checkBoxOptions"/> 
                      <label htmlFor="checkbox18" className="textCheckboxOptions">Посудомоечная машина </label>
                    </div>
                  </div>
                {/* Четвертое деление */}
                  <div className="DivisionOptions">
                  <div className="dropdown" style={{visibility: "hidden"}}>
                            <p className="titleOptions">Метро</p>
                              <div className="dropdown">
                                <button className="List" type="button">Выберите</button>
                                <input type="text" name="select__category"  className="drodown__item__hiden" />
                              </div>
                              </div>
                    <div className="checkbox" style={{display:"flex",marginBottom:"10px",marginTop:"30px"}}>
                        <input type="checkbox" value={"Газовая плита"} id="checkbox19" onChange={() => ClickCheckbox(19)} className="checkBoxOptions"/> 
                        <label htmlFor="checkbox19" className="textCheckboxOptions">Газовая плита</label>
                      </div>
                      <div className="" style={{display:"flex",marginBottom:"10px"}}>
                        <input type="checkbox" value={"Духовка"} id="checkbox20" onChange={() => ClickCheckbox(20)} className="checkBoxOptions"/> 
                        <label htmlFor="checkbox20" className="textCheckboxOptions">Духовка</label>
                      </div>
                      <div className="" style={{display:"flex",marginBottom:"10px"}}>
                        <input type="checkbox" value={"Кофеварка"} id="checkbox21" onChange={() => ClickCheckbox(21)} className="checkBoxOptions"/> 
                        <label htmlFor="checkbox21" className="textCheckboxOptions">Кофеварка</label>
                      </div>
                      <div className="" style={{display:"flex",marginBottom:"10px"}}>
                        <input type="checkbox" value={"Микроволновая печь"} id="checkbox22" onChange={() => ClickCheckbox(22)} className="checkBoxOptions"/> 
                        <label htmlFor="checkbox22" className="textCheckboxOptions">Микроволновая печь </label>
                      </div>
                      <div className="" style={{display:"flex",marginBottom:"10px"}}>
                        <input type="checkbox" value={"Посуда"} id="checkbox23" onChange={() => ClickCheckbox(23)} className="checkBoxOptions"/> 
                        <label htmlFor="checkbox23" className="textCheckboxOptions">Посуда </label>
                      </div>
                      <div className="" style={{display:"flex",marginBottom:"10px"}}>
                        <input type="checkbox" value={"Посудомоечная машина"} id="checkbox24" onChange={() => ClickCheckbox(24)} className="checkBoxOptions"/> 
                        <label htmlFor="checkbox24" className="textCheckboxOptions">Посудомоечная машина </label>
                      </div>
                  </div>
                {/* Пятое деление */}
                  <div className="DivisionOptions">
                  <div className="dropdown" style={{visibility: "hidden"}}>
                            <p className="titleOptions">Метро</p>
                              <div className="dropdown">
                                <button className="List" type="button">Выберите</button>
                              </div>
                              </div>
                    <div className="checkbox" style={{display:"flex",marginBottom:"10px",marginTop:"30px"}}>
                        <input type="checkbox" value={"Газовая плита"} id="checkbox25" onChange={() => ClickCheckbox(25)} className="checkBoxOptions"/> 
                        <label htmlFor="checkbox25" className="textCheckboxOptions">Газовая плита</label>
                      </div>
                      <div className="" style={{display:"flex",marginBottom:"10px"}}>
                        <input type="checkbox" value={"Духовка"} id="checkbox26" onChange={() => ClickCheckbox(26)} className="checkBoxOptions"/> 
                        <label htmlFor="checkbox26" className="textCheckboxOptions">Духовка</label>
                      </div>
                      <div className="" style={{display:"flex",marginBottom:"10px"}}>
                        <input type="checkbox" value={"Кофеварка"} id="checkbox27" onChange={() => ClickCheckbox(27)} className="checkBoxOptions"/> 
                        <label htmlFor="checkbox27" className="textCheckboxOptions">Кофеварка</label>
                      </div>
                      <div className="" style={{display:"flex",marginBottom:"10px"}}>
                        <input type="checkbox" value={"Микроволновая печь"} id="checkbox28" onChange={() => ClickCheckbox(28)} className="checkBoxOptions"/> 
                        <label htmlFor="checkbox28" className="textCheckboxOptions">Микроволновая печь </label>
                      </div>
                      <div className="" style={{display:"flex",marginBottom:"10px"}}>
                        <input type="checkbox" value={"Посуда"} id="checkbox29" onChange={() => ClickCheckbox(29)} className="checkBoxOptions"/> 
                        <label htmlFor="checkbox29" className="textCheckboxOptions">Посуда </label>
                      </div>
                      <div className="" style={{display:"flex",marginBottom:"10px"}}>
                        <input type="checkbox" value={"Посудомоечная машина"} id="checkbox30" onChange={() => ClickCheckbox(30)} className="checkBoxOptions"/> 
                        <label htmlFor="checkbox30" className="textCheckboxOptions">Посудомоечная машина </label>
                      </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </section>

    {/* section 2 */}

      <section className="second">
        <div className="second__block">
          <div className="conteiner">
              <div className="second__block__Division">
                <div className="pervoe__Division">
                  <div className="second__block__item1">
                      <img src={img1} className="img" alt="" />
                      <div className="pos">
                      <p className="sec__inner__text">Снять квартиру</p>
                      <h2 className="sec__sec__text">Квартиры на сутки</h2>
                        <div className="btns">
                          <>
                            {
                              Cities.map((item) => {
                                return(
                                <button className="city" key={item.city+item.id+"2"} onClick={()=>push2(`${item.city}`)}>{item.city}</button>
                                )
                              })  
                            }
                          </>
                        </div>
                      </div>
                  </div>
                  <div className="second__block__item2">
                    <img src={img2} className="img" alt="" />
                      <div className="pos">
                        <p className="sec__inner__text">Снять коттедж на праздник</p>
                        <h2 className="sec__sec__text">Коттеджи и усадьбы</h2>
                        <Link to="123"><button className="arrow"><svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 14.2656L7.57143 7.6942L0.999999 1.12277" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg></button></Link>
                      </div>             
                  </div>
                  <div className="second__block__item3">
                    <img src={img3} className="img" alt="" />
                      <div className="pos">
                        <p className="sec__inner__text">Попариться в бане с друзьями</p>
                        <h2 className="sec__sec__text">Бани и сауны</h2>
                        <Link to="123">
                          <button className="arrow">
                            <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 14.2656L7.57143 7.6942L0.999999 1.12277" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </Link>
                      </div>             
                  </div>
                  <div className="second__block__item4">
                    <img src={img4} className="img" alt="" />
                      <div className="pos">
                        <p className="sec__inner__text">Если срочно нужна машина</p>
                        <h2 className="sec__sec__text">Авто на прокат</h2>
                        <Link to="123"><button className="arrow arrow2"><svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 14.2656L7.57143 7.6942L0.999999 1.12277" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg></button></Link>
                      </div>             
                  </div>
                </div>
                <div className="vtoroe__Division">
                  <h2 className="vtoroe__Division__inner">Квартиры</h2>
                  <div className="vtoroe__Division__info">
                    <Link to="/catalog/city=" className="vtoroe__Division__links" onClick={()=>{dispatch(setCity("Минск")); dispatch(setRooms("")); window.scrollTo({top:0,behavior:"smooth"})}}>Квартиры в Минске</Link>
                    <p className="vtoroe__Division__sec__text">{arendaLength}</p>
                  </div>
                  <div className="vtoroe__Division__info">
                    <Link to="/catalog/city=" className="vtoroe__Division__links" onClick={()=>{dispatch(setCity("Гомель")); dispatch(setRooms("")); window.scrollTo({top:0,behavior:"smooth"})}}>Квартиры в Гомеле</Link>
                    <p className="vtoroe__Division__sec__text">{arendaLength2}</p>
                  </div>
                  <div className="vtoroe__Division__info">
                    <Link to="/catalog/city=" className="vtoroe__Division__links" onClick={()=>{dispatch(setCity("Гродно")); dispatch(setRooms("")); window.scrollTo({top:0,behavior:"smooth"})}}>Квартиры в Гродно</Link>
                    <p className="vtoroe__Division__sec__text">{arendaLength3}</p>
                  </div>
                  <div className="vtoroe__Division__info">
                    <Link to="/catalog/city=" className="vtoroe__Division__links" onClick={()=>{dispatch(setCity("Могилев")); dispatch(setRooms("")); window.scrollTo({top:0,behavior:"smooth"})}}>Квартиры в Могилеве</Link>
                    <p className="vtoroe__Division__sec__text">{arendaLength4}</p>
                  </div>
                  <div className="vtoroe__Division__info">
                    <Link to="/catalog/city=" className="vtoroe__Division__links"onClick={()=>{dispatch(setCity("Брест")); dispatch(setRooms("")); window.scrollTo({top:0,behavior:"smooth"})}}>Квартиры в Бресте</Link>
                    <p className="vtoroe__Division__sec__text">{arendaLength5}</p>
                  </div>
                  <div className="vtoroe__Division__info">
                    <Link to="/catalog/city=" className="vtoroe__Division__links"onClick={()=>{dispatch(setCity("Витебск")); dispatch(setRooms("")); window.scrollTo({top:0,behavior:"smooth"})}}>Квартиры в Витебске</Link>
                    <p className="vtoroe__Division__sec__text">{arendaLength6}</p>
                  </div>

                  <h2 className="vtoroe__Division__inner">Коттеджи и усадьбы</h2>
                  <div className="vtoroe__Division__info">
                    <Link to="123" className="vtoroe__Division__links">Аггроусадьбы</Link>
                    <p className="vtoroe__Division__sec__text">110</p>
                  </div>
                  <div className="vtoroe__Division__info">
                    <Link to="123" className="vtoroe__Division__links">Коттеджи</Link>
                    <p className="vtoroe__Division__sec__text">110</p>
                  </div>
                  <div className="vtoroe__Division__info">
                    <Link to="123" className="vtoroe__Division__links">Загородный комплекс</Link>
                    <p className="vtoroe__Division__sec__text">110</p>
                  </div>
                  <div className="vtoroe__Division__info">
                    <Link to="123" className="vtoroe__Division__links">База отдыха</Link>
                    <p className="vtoroe__Division__sec__text">110</p>
                  </div>
                  <div className="vtoroe__Division__info">
                    <Link to="123" className="vtoroe__Division__links">
                      <div className="" style={{border:"1px solid #F5BC03",borderRight:"0",borderLeft:"0",borderTop:"0"}} onMouseEnter={()=>MouseLeaveMouseEnterList("")} onMouseLeave={()=>MouseLeaveMouseEnterList("")}>
                        <div className="dropdown4">
                          <span style={{marginRight:"5.5px",paddingBottom:"3px"}}>Еще</span>
                            <svg style={{marginBottom:"1px"}} width="6" height="4" viewBox="0 0 6 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M0.5 0.75L3 3.25L5.5 0.75" stroke="#FEB700" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <ul className="List__dropdown__custom">     
                              <li key = {"Элемент 1"} className="dropdown__item">Элемент 1</li>
                              <li key = {"Элемент 2"} className="dropdown__item">Элемент 2</li>
                              <li key = {"Элемент 3"} className="dropdown__item">Элемент 3</li>
                            </ul>
                            <input type="text" name="select__category" value="" className="drodown__item__hiden" />
                        </div>
                      </div>
                    </Link>
                    <p className="vtoroe__Division__sec__text"></p>
                  </div>

                  <h2 className="vtoroe__Division__inner">Популярные направления</h2>
                  <div className="vtoroe__Division__info">
                    <Link to="123" className="vtoroe__Division__links">Коттеджи и усадьбы на о. Брасласких </Link>
                    <p className="vtoroe__Division__sec__text"></p>
                  </div>
                  <div className="vtoroe__Division__info">
                    <Link to="123" className="vtoroe__Division__links vtoroe__Division__links2 ">Коттеджи и усадьбы (жилье) на Нарочи</Link>
                    <p className="vtoroe__Division__sec__text"></p>
                  </div>
                  <div className="vtoroe__Division__info">
                    <Link to="123" className="vtoroe__Division__links">Коттеджи и усадьбы (жилье) у воды,
                    на берегу, на озере</Link>
                    <p className="vtoroe__Division__sec__text"></p>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </section>
      
      
    {/* section 3 */}

      <section key = {"section1"} className="third" style={{height:"970px",
                                 marginBottom:"90px"}}>
        <div className="third__block">
          <img src={img5} alt="" />
          <div className="conteiner"></div>
        </div>
        <div className="third__block">
          <div className="conteiner">
            <div className="card__list">
              <div className="Card">
                  <div className="ColRowHome conteiner" style={{position:"absolute"}}>
                    <div className="cards" style={{display:"flex",justifyContent:"space-between"}}>
                      <Row>
                        <Col className="Col" style={{overflow:"hidden"}}>
                          <ArendaRoom/>
                        </Col>
                      </Row>
                    </div>
                   
                    <div className="predlojenia">
                      <div className="total__predlojenie">
                        <h1 className="kol-vo__predlojeniy">{filter.cityRayon.length} <span style ={{color:"#664EF9"}}>+</span></h1>
                        <p className="dopkol-vo__predlojeniy">Предложений в {cityIn(filter.cityRayon.city)}</p>
                      </div>
                      <div className="btn__predlojenie">
                      <Link to={`/catalog/city=`} style={{textDecoration:"none"}}>
                        <button className="btndob btnpredl" onClick={()=>{window.scrollTo({top:0,behavior:"smooth"}); dispatch(setCity(filter.cityRayon.city));  dispatch(setRooms("")); window.scrollTo({top:0,behavior:"smooth"})}}>Посмотреть все</button>
                      </Link>
                      </div>
                    </div>
                  
                  </div> 
              </div>
            </div>
            <div className="Division__third__block">
              <div className="pervoe__Division__third__block">
                <p className="info__pervogo__delenia">Квартиры на сутки</p>
                <h1 className="dopinfo__pervogo__delenia">Аренда квартир в {cityIn(filter.cityRayon.city)}</h1>
              </div>
              <div className="select_metro">
                      <div className="dropdown">
                        <button className="List Listmetro" onClick={()=>FilterFromHomePage(dispatch,navigate)}>{filter.cityRayon.city?filter.cityRayon.city:"Выберите"}</button>
                        <ul className="List__dropdown">
                          <li className="dropdown__item" key={"Минск"}>Минск</li>
                          <li className="dropdown__item" key={"Гомель"}>Гомель</li>
                          <li className="dropdown__item" key={"Гродно"}>Гродно</li>
                          <li className="dropdown__item" key={"Могилев"}>Могилев</li>
                          <li className="dropdown__item" key={"Брест"}>Брест</li>
                          <li className="dropdown__item" key={"Витебск"}>Витебск</li>
                        </ul>
                        <input type="text" name="select__category" defaultValue={filter.cityRayon.city} id="cityInput" className="drodown__item__hiden" />
                      </div>
                      <div className="dropdown" style={{marginLeft:"30px"}}>
                        <button className="List Listmetro" onClick={()=>FilterFromHomePage(dispatch,navigate)}>{filter.cityRayon.rayon!==""?filter.cityRayon.rayon:"Выберите"}</button>
                        <ul className="List__dropdown">
                        <>
                        {
                            Rayon.map((item)=>{
                              return(
                              <li key={"dropdown__item"+item.value+"1"} className="dropdown__item">{(item.value).substring(0,(item.value).indexOf(" ",0))}</li>
                              )
                            })
                        } 
                        </>
                        </ul>
                        <input type="text" name="select__category" id="cityInput2"  className="drodown__item__hiden" />
                      </div>
                </div>
                 <div className="vtoroe__Division__third__block">
              </div>
            </div>
          </div>
        </div>

      </section>

      <section className="forth">
          <div className="Forma formaforth">
            <div className="fort__block">
              <div className="conteiner">
                <h1 className="forth__inner__text">Поиск квартир на карте</h1>
                <h2 className="forth__sec__text">Ищите квартиры на сутки в центре города, возле парка или в живописном районе</h2>
                <NavLink to = "/map">
                  <button className="Voyti btnopen">
                    <div className="btnopen__class">
                      <svg className="mapicon" width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.462 2.71394C10.3632 1.03952 8.54923 0.0976563 6.50853 0.0976562C4.48528 0.0976562 2.67132 1.03952 1.5376 2.71394C0.403882 4.35347 0.142254 6.44649 0.839929 8.27789C1.03179 8.76626 1.3283 9.27207 1.71202 9.72556L6.12481 14.9232C6.22946 15.0279 6.33412 15.0977 6.49109 15.0977C6.64807 15.0977 6.75272 15.0279 6.85737 14.9232L11.2876 9.72556C11.6713 9.27207 11.9853 8.7837 12.1597 8.27789C12.8574 6.44649 12.5957 4.35347 11.462 2.71394ZM6.50853 8.88835C5.00853 8.88835 3.77016 7.64998 3.77016 6.14998C3.77016 4.64998 5.00853 3.41161 6.50853 3.41161C8.00853 3.41161 9.24691 4.64998 9.24691 6.14998C9.24691 7.64998 8.02598 8.88835 6.50853 8.88835Z" fill="url(#paint0_linear_2831_1715)"/>
                        <defs>
                        <linearGradient id="paint0_linear_2831_1715" x1="0.455078" y1="0.847657" x2="14.7623" y2="4.16693" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FFD54F"/>
                        <stop offset="1" stopColor="#FEC100"/>
                        </linearGradient>
                        </defs>
                      </svg>
                      <p className="btntext">Открыть карту</p>
                    </div>
                  </button>
                </NavLink>
              </div>
            </div>
            <div className="tochki__forth">
            <img src={img6} alt="" />
            </div>
          </div>
          <div className="item__info__Division">
            <div className="conteiner">
              <div className="Division__flex">
                <div className="item__info__forth">
                  <div className="infoicon">
                    <svg width="139" height="139" viewBox="0 0 139 139" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_d_2831_1742)">
                    <circle cx="69.2593" cy="58.6362" r="49.2593" fill="white"/>
                    </g>
                    <g clipPath="url(#clip0_2831_1742)">
                    <path d="M84.922 65.9641L93.4843 57.4915C96.6822 54.2936 102.833 58.3282 99.5098 62.2373L89.1419 74.4352C88.736 74.9125 88.2696 75.3357 87.7551 75.6936C86.0838 76.7617 84.0933 77.1176 82.132 77.1176H66.7462C65.6335 77.1176 64.5213 77.182 63.416 77.3104L58.9909 77.8075L49.8125 68.9008C49.8125 68.9008 55.0192 59.0682 65.233 61.8943C67.1432 62.4232 69.1198 62.675 71.1019 62.675H81.2136C85.9738 62.675 86.0114 70.2385 81.1739 70.2385H72.3713" fill="white"/>
                    <path d="M52.9617 89.3978L61.6935 80.4395C61.696 80.4371 61.696 80.4331 61.6935 80.4306L46.8772 66.0525C46.8747 66.05 46.8707 66.0505 46.8683 66.0525L38.0542 75.203L52.9617 89.3978Z" fill="#FFD54F" fillOpacity="0.4"/>
                    <path d="M48.5318 39.3267C45.7641 39.5889 43.5986 41.9194 43.5986 44.756V50.5629C43.5986 51.5656 44.4115 52.379 45.4147 52.379H57.8673C58.8704 52.379 59.6833 51.5656 59.6833 50.5629V44.756C59.6833 41.9174 57.5149 39.5849 54.7437 39.3262" fill="#FFD54F"/>
                    <path d="M57.7343 34.0666C57.7343 37.432 55.0062 40.1601 51.6408 40.1601C48.2754 40.1601 45.5474 37.432 45.5474 34.0666C45.5474 30.7012 48.2754 27.9727 51.6408 27.9727C55.0062 27.9727 57.7343 30.7012 57.7343 34.0666Z" fill="white"/>
                    <path d="M64.6167 39.3267C61.8491 39.5889 59.6831 41.9194 59.6831 44.756V50.5629C59.6831 51.5656 60.4965 52.379 61.4996 52.379H73.9522C74.9554 52.379 75.7683 51.5656 75.7683 50.5629V44.756C75.7683 41.9174 73.5993 39.5849 70.8287 39.3262" fill="url(#paint0_linear_2831_1742)"/>
                    <path d="M73.8192 34.0666C73.8192 37.432 71.0912 40.1601 67.7258 40.1601C64.3604 40.1601 61.6318 37.432 61.6318 34.0666C61.6318 30.7012 64.3604 27.9727 67.7258 27.9727C71.0912 27.9727 73.8192 30.7012 73.8192 34.0666Z" fill="white"/>
                    <path d="M80.7017 39.3267C77.9335 39.5889 75.7681 41.9194 75.7681 44.756V50.5629C75.7681 51.5656 76.5814 52.379 77.5841 52.379H90.0367C91.0399 52.379 91.8532 51.5656 91.8532 50.5629V44.756C91.8532 41.9174 89.6843 39.5849 86.9131 39.3262" fill="#FFD54F"/>
                    <path d="M89.9047 34.0666C89.9047 37.432 87.1762 40.1601 83.8107 40.1601C80.4453 40.1601 77.7173 37.432 77.7173 34.0666C77.7173 30.7012 80.4453 27.9727 83.8107 27.9727C87.1762 27.9727 89.9047 30.7012 89.9047 34.0666Z" fill="white"/>
                    <path d="M100.206 56.5515C99.2339 55.6544 97.911 55.1003 96.5767 55.0309C95.0615 54.9526 93.642 55.4928 92.5848 56.5505L85.3613 63.6982C85.2185 63.4509 85.0554 63.2175 84.8725 63.0009C83.9839 61.9456 82.6843 61.3647 81.2137 61.3647H71.1016C69.1948 61.3647 67.3347 61.1174 65.5731 60.6302C60.9805 59.3599 56.593 60.2877 52.8841 63.3151C51.3759 64.5463 50.2756 65.8855 49.5797 66.8619L47.7666 65.1024C47.5282 64.8709 47.205 64.7396 46.8725 64.7396C46.8695 64.7396 46.867 64.7396 46.864 64.7396C46.5196 64.7421 46.1865 64.8853 45.9476 65.1331L37.1335 74.2832C36.8976 74.5281 36.7692 74.8572 36.7767 75.1972C36.7841 75.5377 36.9264 75.8609 37.1727 76.0953L52.0802 90.2901C52.3275 90.5255 52.6447 90.643 52.9615 90.643C53.294 90.643 53.6266 90.5136 53.8769 90.2569L62.6087 81.2986C62.8471 81.0537 62.9794 80.7192 62.973 80.3772C62.9665 80.0402 62.8253 79.715 62.5834 79.4801L61.8231 78.7426L63.5633 78.5468C64.616 78.4243 65.6866 78.3624 66.7463 78.3624H82.1316C84.6317 78.3624 86.755 77.8157 88.4432 76.7372C88.4571 76.7283 88.4709 76.7188 88.4848 76.7094C89.0895 76.2891 89.6382 75.791 90.115 75.2294L100.483 63.0321C102.257 60.9449 102.146 58.3403 100.206 56.5515ZM52.9282 87.5685L39.866 75.1308L46.9027 67.8255L59.8886 80.4272L52.9282 87.5685ZM98.5355 61.3766L88.1676 73.5745C87.8385 73.9616 87.4613 74.3055 87.0455 74.597C85.7781 75.3994 84.1251 75.8068 82.1316 75.8068H66.7458C65.5885 75.8068 64.4183 75.8748 63.2728 76.0081L59.4475 76.4373L51.4378 68.6646C51.9945 67.8394 53.018 66.5056 54.5004 65.2952C57.5823 62.7793 61.0786 62.0383 64.8916 63.0936C66.8752 63.6422 68.9643 63.9208 71.1016 63.9208H81.2137C83.0297 63.9208 83.5145 65.494 83.5145 66.4233C83.5145 67.1023 83.2964 67.7487 82.9162 68.1967C82.5039 68.682 81.9175 68.9278 81.1735 68.9278H72.3709C71.6651 68.9278 71.0931 69.5003 71.0931 70.2061C71.0931 70.9119 71.6651 71.4838 72.3709 71.4838H81.1735C82.6595 71.4838 83.97 70.9039 84.8641 69.8512C85.6081 68.9759 86.0324 67.825 86.068 66.5948L94.3874 58.3626C95.5765 57.1736 97.4342 57.472 98.4735 58.4305C99.0108 58.9262 99.7335 59.9675 98.5355 61.3766Z" fill="url(#paint1_linear_2831_1742)"/>
                    <path d="M68.3856 69.8654C68.2245 69.1779 67.5371 68.7522 66.8496 68.9128C66.1626 69.0739 65.7359 69.7613 65.8975 70.4488L65.9094 70.5008C66.0476 71.0896 66.5725 71.4872 67.1524 71.4872C67.2491 71.4872 67.3472 71.4762 67.4454 71.4534C68.1328 71.2924 68.5591 70.6044 68.398 69.9174L68.3856 69.8654Z" fill="url(#paint2_linear_2831_1742)"/>
                    <path d="M45.4146 53.6252H57.8672C58.5452 53.6252 59.1727 53.4051 59.6832 53.0334C60.1938 53.4051 60.8212 53.6252 61.4993 53.6252H73.9524C74.6304 53.6252 75.2579 53.4051 75.7684 53.0334C76.2789 53.4051 76.9064 53.6252 77.5844 53.6252H90.037C91.743 53.6252 93.1308 52.2369 93.1308 50.5309V44.7239C93.1308 42.1158 91.6712 39.8502 89.4864 38.7325C90.5451 37.4558 91.1825 35.8182 91.1825 34.0338C91.1825 29.9691 87.8755 26.6621 83.8107 26.6621C79.746 26.6621 76.439 29.9691 76.439 34.0338C76.439 35.8182 77.0764 37.4563 78.1351 38.7325C77.1909 39.2163 76.3825 39.9147 75.7684 40.7617C75.1543 39.9142 74.3459 39.2158 73.4012 38.7325C74.4599 37.4563 75.0973 35.8182 75.0973 34.0338C75.0973 29.9691 71.7904 26.6621 67.7256 26.6621C63.6608 26.6621 60.3539 29.9691 60.3539 34.0338C60.3539 35.8182 60.9917 37.4563 62.0504 38.733C61.1057 39.2163 60.2973 39.9147 59.6832 40.7622C59.0691 39.9147 58.2607 39.2163 57.316 38.7325C58.3747 37.4563 59.0121 35.8182 59.0121 34.0343C59.0121 29.9691 55.7052 26.6621 51.6404 26.6621C47.5761 26.6621 44.2692 29.9691 44.2692 34.0343C44.2692 35.8182 44.9066 37.4563 45.9653 38.733C43.7805 39.8507 42.3203 42.1168 42.3203 44.7244V50.5309C42.3203 52.2369 43.7086 53.6252 45.4146 53.6252ZM83.8112 29.2181C86.4664 29.2181 88.6269 31.3782 88.6269 34.0338C88.6269 36.689 86.4664 38.8495 83.8112 38.8495C81.1556 38.8495 78.9956 36.6895 78.9956 34.0338C78.9951 31.3782 81.1556 29.2181 83.8112 29.2181ZM80.4909 40.6125C81.4896 41.1186 82.6172 41.4056 83.8107 41.4056C85.0047 41.4056 86.1323 41.1186 87.1306 40.6125C89.1166 40.9585 90.5753 42.67 90.5753 44.7239V50.5309C90.5753 50.8278 90.3339 51.0691 90.037 51.0691H77.5844C77.2881 51.0691 77.0467 50.8278 77.0467 50.5309V44.7239C77.0462 42.6704 78.5054 40.9585 80.4909 40.6125ZM67.7261 29.2181C70.3812 29.2181 72.5418 31.3782 72.5418 34.0338C72.5418 36.689 70.3812 38.8495 67.7261 38.8495C65.0704 38.8495 62.9104 36.6895 62.9104 34.0338C62.9104 31.3782 65.0704 29.2181 67.7261 29.2181ZM64.4062 40.6125C65.4045 41.1186 66.5321 41.4056 67.7261 41.4056C68.9201 41.4056 70.0472 41.1186 71.0459 40.6125C73.0315 40.9585 74.4906 42.67 74.4906 44.7239V50.5309C74.4906 50.8278 74.2493 51.0691 73.9524 51.0691H61.4998C61.2029 51.0691 60.9615 50.8278 60.9615 50.5309V44.7239C60.9615 42.6704 62.4207 40.9585 64.4062 40.6125ZM51.6409 29.2181C54.2961 29.2181 56.4566 31.3782 56.4566 34.0338C56.4566 36.689 54.2961 38.8495 51.6409 38.8495C48.9857 38.8495 46.8252 36.689 46.8252 34.0338C46.8252 31.3782 48.9857 29.2181 51.6409 29.2181ZM44.8764 44.7239C44.8764 42.6704 46.3355 40.9585 48.3211 40.6125C49.3198 41.1186 50.4469 41.4056 51.6409 41.4056C52.8349 41.4056 53.962 41.1186 54.9607 40.6125C56.9468 40.9585 58.4055 42.67 58.4055 44.7239V50.5309C58.4055 50.8278 58.1641 51.0691 57.8672 51.0691H45.4146C45.1177 51.0691 44.8764 50.8278 44.8764 50.5309V44.7239Z" fill="url(#paint3_linear_2831_1742)"/>
                    </g>
                    <defs>
                    <filter id="filter0_d_2831_1742" x="0" y="0.376953" width="138.519" height="138.518" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="11"/>
                    <feGaussianBlur stdDeviation="10"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0.498056 0 0 0 0 0.606283 0 0 0 0 0.733333 0 0 0 0.16 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2831_1742"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2831_1742" result="shape"/>
                    </filter>
                    <linearGradient id="paint0_linear_2831_1742" x1="59.6831" y1="39.9788" x2="77.5015" y2="46.2995" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFD54F"/>
                    <stop offset="1" stopColor="#FEC100"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_2831_1742" x1="36.7764" y1="72.8332" x2="98.1652" y2="72.8332" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9D94FF"/>
                    <stop offset="1" stopColor="#6B50E9"/>
                    </linearGradient>
                    <linearGradient id="paint2_linear_2831_1742" x1="65.8633" y1="70.183" x2="68.2906" y2="70.183" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9D94FF"/>
                    <stop offset="1" stopColor="#6B50E9"/>
                    </linearGradient>
                    <linearGradient id="paint3_linear_2831_1742" x1="42.3203" y1="40.1436" x2="90.3339" y2="40.1436" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9D94FF"/>
                    <stop offset="1" stopColor="#6B50E9"/>
                    </linearGradient>
                    <clipPath id="clip0_2831_1742">
                    <rect width="64.9651" height="64.9651" fill="white" transform="translate(36.7764 26.1543)"/>
                    </clipPath>
                    </defs>
                    </svg>
                    <h1 className="info__forth__inner__text">Начните привлекать клиентов бесплатно!</h1>
                  </div>
                    <h2 className="info__foth__sec__text" style={{marginBottom:"49px"}}>Пройдя простую регистрацию на сайте у Вас появится личный кабинет, в котором возможно <b>бесплатно создавать и публиковать</b> объявления на сайте. </h2>
                    <button className="Voyti razmestitbtn" onClick={()=>{login && window.innerWidth>1300?setModalAdvertisements(true):window.innerWidth<1300 && !login?notifyErrorAuthorization():notifyErrorAddAdvertisement()}}>+ Разместить объявление</button>
                </div>

                <div className="item__info__forth">
                  <div className="infoicon">
                    <svg width="139" height="139" viewBox="0 0 139 139" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_d_2831_1762)">
                    <circle cx="69.2593" cy="58.6362" r="49.2593" fill="white"/>
                    </g>
                    <g clipPath="url(#clip0_2831_1762)">
                    <rect x="68.9424" y="33.6328" width="25.4375" height="11.5" fill="#B8C4FF"/>
                    <path d="M91.3838 31.5078H72.2939C69.677 31.5078 67.5479 33.637 67.5479 36.2539V42.582C67.5479 45.199 69.677 47.3281 72.2939 47.3281H80.2041V50.5977H72.2939C69.677 50.5977 67.5479 52.7264 67.5479 55.3433V61.6715C67.5479 64.2888 69.677 66.4176 72.2939 66.4176H80.2041V69.6871H72.2939C69.677 69.6871 67.5479 71.8162 67.5479 74.4332V80.7613C67.5479 83.3783 69.677 85.5074 72.2939 85.5074H91.3838C94.0007 85.5074 96.1299 83.3783 96.1299 80.7613V74.4332C96.1299 71.8162 94.0007 69.6871 91.3838 69.6871H83.3682V66.4176H91.3838C94.0007 66.4176 96.1299 64.2888 96.1299 61.6715V55.3433C96.1299 52.7264 94.0007 50.5977 91.3838 50.5977H83.3682V47.3281H91.3838C94.0007 47.3281 96.1299 45.199 96.1299 42.582V36.2539C96.1299 33.637 94.0007 31.5078 91.3838 31.5078ZM92.9658 74.4332V80.7613C92.9658 81.6339 92.256 82.3433 91.3838 82.3433H72.2939C71.4214 82.3433 70.7119 81.6339 70.7119 80.7613V74.4332C70.7119 73.561 71.4214 72.8512 72.2939 72.8512H91.3838C92.256 72.8512 92.9658 73.561 92.9658 74.4332ZM92.9658 55.3433V61.6715C92.9658 62.5441 92.256 63.2535 91.3838 63.2535H72.2939C71.4214 63.2535 70.7119 62.5441 70.7119 61.6715V55.3433C70.7119 54.4712 71.4214 53.7617 72.2939 53.7617H91.3838C92.256 53.7617 92.9658 54.4712 92.9658 55.3433ZM92.9658 42.582C92.9658 43.4542 92.256 44.1641 91.3838 44.1641H72.2939C71.4214 44.1641 70.7119 43.4542 70.7119 42.582V36.2539C70.7119 35.3813 71.4214 34.6719 72.2939 34.6719H91.3838C92.256 34.6719 92.9658 35.3813 92.9658 36.2539V42.582Z" fill="url(#paint0_linear_2831_1762)"/>
                    <path d="M50.1455 79.1797C51.0193 79.1797 51.7275 78.4715 51.7275 77.5977C51.7275 76.7242 51.0193 76.0156 50.1455 76.0156C47.5158 76.0156 45.2939 73.8424 45.2939 71.2695C45.2939 70.3961 44.5857 69.6875 43.7119 69.6875C42.8381 69.6875 42.1299 70.3961 42.1299 71.2695C42.1299 75.642 45.7723 79.1797 50.1455 79.1797Z" fill="#FEC100"/>
                    <path d="M43.7119 66.418C44.5857 66.418 45.2939 65.7098 45.2939 64.8359V58.5078C45.2939 57.6344 44.5857 56.9258 43.7119 56.9258C42.8381 56.9258 42.1299 57.6344 42.1299 58.5078V64.8359C42.1299 65.7098 42.8381 66.418 43.7119 66.418Z" fill="#FEC100"/>
                    <path d="M43.7119 53.7621C44.5857 53.7621 45.2939 53.0535 45.2939 52.1801V45.7465C45.2939 43.1737 47.5158 41.0004 50.1455 41.0004H57.5765L52.432 44.4298C51.7049 44.9147 51.5084 45.8969 51.9933 46.6236C52.4802 47.3545 53.4637 47.5448 54.1871 47.0624L63.6793 40.7347C64.1193 40.4409 64.3838 39.947 64.3838 39.418C64.3838 38.889 64.1193 38.395 63.6793 38.1017L54.1871 31.7736C53.4599 31.2891 52.4778 31.4856 51.9933 32.2123C51.5084 32.9395 51.7049 33.9217 52.432 34.4061L57.5765 37.8359H50.1455C45.7731 37.8359 42.1299 41.3729 42.1299 45.7461V52.1797C42.1299 53.0535 42.8381 53.7621 43.7119 53.7621Z" fill="#FEC100"/>
                    <path d="M56.4736 76.0156C55.5998 76.0156 54.8916 76.7242 54.8916 77.5977C54.8916 78.4715 55.5998 79.1797 56.4736 79.1797H62.8018C63.6756 79.1797 64.3838 78.4715 64.3838 77.5977C64.3838 76.7242 63.6756 76.0156 62.8018 76.0156H56.4736Z" fill="#FEC100"/>
                    <path d="M88.2197 37.8359H75.458C74.5842 37.8359 73.876 38.5441 73.876 39.418C73.876 40.2914 74.5842 41 75.458 41H88.2197C89.0931 41 89.8018 40.2914 89.8018 39.418C89.8018 38.5441 89.0931 37.8359 88.2197 37.8359Z" fill="url(#paint1_linear_2831_1762)"/>
                    <path d="M73.876 58.5078C73.876 59.3816 74.5842 60.0898 75.458 60.0898H88.2197C89.0931 60.0898 89.8018 59.3816 89.8018 58.5078C89.8018 57.6344 89.0931 56.9258 88.2197 56.9258H75.458C74.5842 56.9258 73.876 57.6344 73.876 58.5078Z" fill="url(#paint2_linear_2831_1762)"/>
                    <path d="M73.876 77.5977C73.876 78.4715 74.5842 79.1797 75.458 79.1797H88.2197C89.0931 79.1797 89.8018 78.4715 89.8018 77.5977C89.8018 76.7242 89.0931 76.0156 88.2197 76.0156H75.458C74.5842 76.0156 73.876 76.7238 73.876 77.5977Z" fill="url(#paint3_linear_2831_1762)"/>
                    </g>
                    <defs>
                    <filter id="filter0_d_2831_1762" x="0" y="0.376953" width="138.519" height="138.518" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="11"/>
                    <feGaussianBlur stdDeviation="10"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0.498056 0 0 0 0 0.606283 0 0 0 0 0.733333 0 0 0 0.16 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2831_1762"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2831_1762" result="shape"/>
                    </filter>
                    <linearGradient id="paint0_linear_2831_1762" x1="67.5479" y1="58.5076" x2="94.5566" y2="58.5076" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9D94FF"/>
                    <stop offset="1" stopColor="#6B50E9"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_2831_1762" x1="73.876" y1="39.418" x2="88.9251" y2="39.418" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9D94FF"/>
                    <stop offset="1" stopColor="#6B50E9"/>
                    </linearGradient>
                    <linearGradient id="paint2_linear_2831_1762" x1="73.876" y1="58.5078" x2="88.9251" y2="58.5078" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9D94FF"/>
                    <stop offset="1" stopColor="#6B50E9"/>
                    </linearGradient>
                    <linearGradient id="paint3_linear_2831_1762" x1="73.876" y1="77.5977" x2="88.9251" y2="77.5977" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9D94FF"/>
                    <stop offset="1" stopColor="#6B50E9"/>
                    </linearGradient>
                    <clipPath id="clip0_2831_1762">
                    <rect width="54" height="54" fill="white" transform="translate(42.1299 31.5078)"/>
                    </clipPath>
                    </defs>
                    </svg>
                    <h1 className="info__forth__inner__text">Поднимайте объявления</h1>
                  </div>
                    <h2 className="info__foth__sec__text">Вы в любое время можете <b>поднимать</b> объявления <b>вверх первой страницы</b> каталога, они разместятся сразу после платных объявлений до тех пор, пока другой пользователь не повторит процедуру.</h2>
                    <button className="Voyti razmestitbtn">
                      <div className="btnarrow">
                        <p className="t">Узнать стоимость услуги </p>
                        <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.5 11.8027L6.5 6.80273L1.5 1.80273" stroke="#242424" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div> 
                    </button>
                </div>

                <div className="item__info__forth">       
                    <h1 className="info__forth__intro__text">Приоритет Gold </h1>
                    <h2 className="info__foth__sec__text info__foth__sec__text2">Приоритетное размещение <b>Gold</b> позволяет <b>закрепить ваше объявление</b> в верхней части каталога!</h2>
                   
                    <h2 className="info__foth__sec__text">Gold объявления <b>перемещаются 
                    каждые 5 мин</b> на 1 позицию, что делает размещение одинаковым для всех.</h2>
                    <button className="btndob razmestitbtn">
                      <div className="btnarrow">
                        <p className="t">Еще о тарифе Gold</p>
                        <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.23535 11.8027L6.23535 6.80273L1.23535 1.80273" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div> 
                    </button>

                </div>
              </div>
            </div>
          </div>
      </section>

      <section className="fivth">
        <div className="tochkilast">
          <div className="conteiner">
            <img className="imglast" src={img5} alt="" />
          </div>
        </div>
        <div className="fivth__block">
          
          <div className="conteiner">
            <div className="twoparts">
              <div className="firstpart">
                <h1 className="info__pervogo__delenia info__pervogo__delenia2">ЧТО ТАКОЕ SDAEM.BY</h1>
                <h2 className="dopinfo__pervogo__delenia dopinfo__pervogo__delenia2">Квартира на сутки в Минске</h2>
                <div className="Division__fivth">
                  <div className="Division1 Division1Home">
                    <img className="Division1img" src={img8} alt="" />
                    <div className="Divisiontochki">
                      <img src={img5} alt="" />
                    </div>
                    
                  </div>

                  <div className="Division2_1">
                    <p className="Division2__text"> <b>Нужна квартира на сутки в Минске?</b></p>
                    <p className="Division2__text">На веб-сайте sdaem.by вас ждет масса выгодных предложений. Каталог насчитывает <b>более 500 квартир</b>. Благодаря удобной навигации вы быстро найдете подходящий вариант.</p>
                    <p className="Division2__text">В каталоге представлены комфортабельные однокомнатные квартиры на сутки и квартиры с большим количеством комнат в разных районах города, с различной степенью удобства от дешевых до VIP с джакузи.</p>
                  </div>
                </div>
                <p className="Division__text">Чтобы снять квартиру на сутки в Минске, вам достаточно определиться с выбором и связаться с владельцем для уточнения условий аренды и заключить договор. Заметим, на сайте представлены исключительно квартиры на сутки без посредников, что избавляет посетителей от необходимости взаимодействовать с агентствами, тратя свое время и деньги. Также пользователи сайта могут совершенно бесплатно размещать объявления о готовности сдать квартиру на сутки.    </p>
              </div>
                {
                Loading?
                  <div className="" style={{width:"400px"}}>
                    <NewsHomePage key={"NewsHomePageInfo"+Loading}/>
                  </div>
                  :
                <div className="secondpart" key={"secondpartInfo"+Loading}>
                  <h1 className="intro">Новости</h1>
                  {
                    currentPer.map((item)=>(
                      <>
                        <button className="news" key={"news"+item.id} onClick={()=>push(item.id)}>
                          <div className="newstextsecClass">
                            <p className="newstextintro">{item.title}</p>
                            <p className="newstextsec">{item.data}</p>
                          </div>
                        </button>
                      </>
                    ))
                  }
                  <Link to="/news">
                    <button className="hoverBtnVse" style={{background:"none",border:"none",cursor:"pointer",marginTop:"32px"}}>
                    <div className="btnarrow">
                        <p className="t">Посмотреть все</p>
                        <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path className="zalivkaStrelka" d="M1 11L6 6L1 1" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </button>
                  </Link>
              </div>
            }
            </div>
          </div>
        </div>
      </section>
      
      <Modal active={mapInfoModal} setActive={setMapInfoModal}>
        {
          <>
              <div className="exit" style={{top:"-1.5em"}}>
                <svg onClick={()=>setMapInfoModal(false)} height="30" viewBox="0 0 512 512" width="30  " xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                  <path d="M255.997,460.351c112.685,0,204.355-91.668,204.355-204.348S368.682,51.648,255.997,51.648  c-112.68,0-204.348,91.676-204.348,204.355S143.317,460.351,255.997,460.351z M255.997,83.888  c94.906,0,172.123,77.209,172.123,172.115c0,94.898-77.217,172.117-172.123,172.117c-94.9,0-172.108-77.219-172.108-172.117  C83.888,161.097,161.096,83.888,255.997,83.888z"/>
                  <path d="M172.077,341.508c3.586,3.523,8.25,5.27,12.903,5.27c4.776,0,9.54-1.84,13.151-5.512l57.865-58.973l57.878,58.973  c3.609,3.672,8.375,5.512,13.146,5.512c4.658,0,9.316-1.746,12.902-5.27c7.264-7.125,7.369-18.793,0.242-26.051l-58.357-59.453  l58.357-59.461c7.127-7.258,7.021-18.92-0.242-26.047c-7.252-7.123-18.914-7.018-26.049,0.24l-57.878,58.971l-57.865-58.971  c-7.135-7.264-18.797-7.363-26.055-0.24c-7.258,7.127-7.369,18.789-0.236,26.047l58.351,59.461l-58.351,59.453  C164.708,322.715,164.819,334.383,172.077,341.508z"/>
                </svg>
              </div>
              <section className="firstMap">
              <div className="FirstMapConteiner">
                <div className="conteiner">
                  <div className="FirstMapConteinerOf">
                    <div className="textFirstMap">
                    <h1>Расположение объявлений на карте</h1>
                    </div>
                    <div className="mapConteiner">
                      <MapSelect/>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        }
      </Modal>

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
                          <div className={(filter.categoryInfoId === 1 && (values.city!=="" && values.total!=="" && values.rooms!=="" && values.linkViber!=="" && values.linkWats!=="" && values.linkMail!=="" && values.mail!=="" && values.metro!=="" && values.name!=="" && values.number!=="" && values.square!=="" && values.rayon!=="" && values.sent!=="" && (!errors.sent) && (!errors.square) && (!errors.mail) && (!errors.linkMail) && (imgUrl && imgUrl2)))? "tabs tabs__active":(filter.categoryInfoId === 1 && (values.city=="" || values.total=="" || values.rooms=="" || values.linkViber=="" || values.linkWats=="" || values.linkMail=="" || values.mail=="" || values.metro=="" || values.name=="" || values.number=="" || values.square=="" || values.rayon=="" || values.sent=="" || (errors.sent) || (errors.square) || (errors.mail) || (errors.linkMail) || (!imgUrl || !imgUrl2)))?"tabs tabs__active tabs__error__active":(filter.categoryInfoId !== 1 && (values.city=="" || values.total=="" || values.rooms=="" || values.linkViber=="" || values.linkWats=="" || values.linkMail=="" || values.mail=="" || values.metro=="" || values.name=="" || values.number=="" || values.square=="" || values.rayon=="" || values.sent=="" || (errors.sent) || (errors.square) || (errors.mail) || (errors.linkMail) || (!imgUrl || !imgUrl2))?"tabs tabs__error":"tabs" )} onClick={()=>dispatch(setCategoryInfoId(1))} >
                              <p className="select__item" >Основная информация*</p>
                            </div>
                            <div className={filter.categoryInfoId === 2 ? "tabs tabs__active":"tabs"} onClick={()=>dispatch(setCategoryInfoId(2)) }>
                              <p className="select__item" >Дополнительная информация</p>
                            </div>
                            <div className={(filter.categoryInfoId === 3 && values.description!=="") ? "tabs tabs__active":(filter.categoryInfoId===3 && values.description=="")?"tabs tabs__active tabs__error__active":(filter.categoryInfoId!==3 && values.description=="")?"tabs tabs__error":"tabs"} onClick={()=>dispatch(setCategoryInfoId(3))}>
                              <p className="select__item" >Описание Вашего объявления*</p>
                            </div>
                          </div>  
                          
                          <div className={filter.categoryInfoId===1?"DivisionAdvertisement":"DivisionAdvertisementNone"} style={{marginBottom:"15px"}}>
                            <div className="partOneAdvertisement" style={{marginRight:"15px"}}>
                              <h2 style={{fontSize:"22px"}}>Фото Вашего объекта</h2>
                              {
                                (imgUrl)?
                                  <Swiper pagination={{clickable:true}} navigation={{enabled:true}} modules={[Pagination,Navigation]} className="IconImgAdvertisement">
                                    {
                                      imgUrl.map((imgItem)=>(
                                        <SwiperSlide>
                                          <img style={{width:"250px",height:"250px"}} key={"imgUrlHome"+imgItem} src={imgItem} />
                                        </SwiperSlide>
                                      ))
                                    }
                                  </Swiper>
                                :<img className={"IconImgAdvertisement imgerror"} src={"https://cdn.dribbble.com/users/2657768/screenshots/6413526/404_43.gif"} alt="" /> 
                              }
                                <button onClick={OwnerImgAdvertisementFromAdvertisement} className="Voyti choose" style={{marginTop:"10px"}} type="button">Выберите файл</button>
                              <Field id="file-input4" type="file" accept="image/*,.png,.jpg,.gif,.web," onChange={()=>downLoadImgAdvertisements(event.target,fileReader,imgUrl,setImgUrl)} value={values.url} style={{display:"none"}} />
                            </div>
                            <div className="partTwoAdvertisement" style={{display:"flex"}}>
                              <div className="InformObject" style={{marginRight:"40px"}}>
                                <h2 style={{marginRight:"17px",marginBottom:"20px",textAlign:"center",fontSize:"16px"}}>Информация об объекте</h2>
                                <div className="LOGIN">
                                    <input className={((touched.city && errors.city)||(values.city===""))? "login__error cityArenda":"login cityArenda"} onChange={handleChange} onBlur={handleBlur} name = "city" type="text" value={values.city} placeholder="Город"/>
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
                            <button onClick={FileObjectAdvertisementFromAdvertisement} type="button" style={{marginTop:"10px"}} className="Voyti choose">Выберите файл</button>
                            <Field id="file-input5" type="file" accept="image/*,.png,.jpg,.gif,.web," value={values.imageOwner} onChange={()=>downLoadImgOwner(event.target,fileReader2,setImgUrl2)} style={{display:"none"}} />
                          </div>
                        </div>
                        <div className={filter.categoryInfoId===2?"DopInfo":"DopInfoNone"}>
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
                                  <li key={"Грушевка"} className="dropdown__item">Грушевка</li>
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
                        <div className={filter.categoryInfoId===3?"DopInfo":"DopInfoNone"}>
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
  )
}