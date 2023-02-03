import React,{useState,useEffect} from "react";
import SecondaryCatalog from "./SecondaryCatalog/secondaryCatalog";
import MainCatalog from "./MainCatalog/mainCatalog";
import {useNavigate,Link, NavLink} from "react-router-dom";
import axios from "../../axios";
import "./MainCatalog/pagination.css";
import {defaultClickDropDown, sortInfo } from "../Functions/Homepagejs";
import ClickCheckbox from "../Functions/ClickCheckBox";
import categoriaClick from "../Functions/CategoriaClick";
import ShowSort from "../Functions/Filter";
import {ArendaCardProduct} from "../../interfaces";
import Clear from "../Functions/ClearBtn";
import { cityIn } from 'lvovich';
import { Row } from "react-bootstrap"
import "./catalog.css"
import { useDispatch, useSelector } from "react-redux";
import { clearFilter,setCity,setFilterAll,setRooms,setSort } from "../../store/slices/FilterSlice";
import qs from "qs";
import OptionsClick from "../Functions/OptionsClick";
import { handlePriceMax, handlePriceMin } from "../HandlersOnChanges/handleOnChange";


export default function catalog(){
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const filter = useSelector((state:any) => state.filter.filterAll);
  let sort = useSelector((state:any) => state.filter.sort);
  let city = useSelector((state:any) => state.filter.city);
  const filterFromHome = useSelector((state:any) => state.filter.filterAll);
  const filterRooms = document.getElementById("ListFilter");
  const filterSleepplaces = document.getElementById("filterSleepplaces");
  const filterRayon = document.getElementById("FilterRayon");
  const filterMetro = document.getElementById("FilterMetro2");
  const input = document.getElementById("checkboxInputValue");
  let results;
  let newItem;
  const [category,setCategory]=useState<string>("");
  const [category2,setCategory2]=useState<string>("");
  const [data2,setData2]=useState<boolean>(true);
  const [ToggleState,setToggleState] = useState<number>(2);
  const [Rayon,setRayon] = useState<any>([]);
  const [priceMin, setpriceMin] = useState<any>(filter.priceMin?filter.priceMin:null);
  const [priceMax, setpriceMax] = useState<any>(filter.priceMax?filter.priceMax:null);

  const toggleTab = (index) =>{
    setToggleState(index)
  }

  const [categories,setCategories]=useState<any>([]);
  useEffect(() => {
    axios.get("/categories").then(({data})=>{
      setCategories(data);
    }) ;
    axios.get("/categories?categoria=rayon").then((data) => {
      setRayon(data.data);
    });
    dispatch(setSort("По умолчанию"))
  },[]);

  // Проверка нажатия на кнопку с главной стр(поиск)
  useEffect(()=>{
    if(filterFromHome.city!=="Выберите"){
      const queryString = (qs.stringify({
        city: filterFromHome.city,
        rooms:filterFromHome.rooms,
        priceMin:filterFromHome.priceMin,
        priceMax:filterFromHome.priceMax,
        sleepPlaces:filterFromHome.sleepPlaces,
        Rayon:filterFromHome.rayon,
        metro:filterFromHome.metro,
        inputCheckboxInfo:filterFromHome.inputCheckboxInfo
      }))
      // Проверка чекбоксов
      document.querySelectorAll(".checkBoxOptions").forEach((checkbox)=>{
        let massive = filterFromHome.inputCheckboxInfo.split(",");
        massive.map((massive__item) => {
          if(massive__item==((checkbox as HTMLInputElement).value).replace(/\s/g, '')){
            (checkbox as HTMLInputElement).checked=true;
          }
        })
      })
      navigate(`/catalog/city=?${queryString}`)
    }
  },[])
  
  // Кнопка "показать"
  const Show = (priceMin,priceMax,filterRooms,filterSleepplaces,filterRayon,filterMetro,input) => {
    const item=[filterRayon,filterRooms,priceMin,priceMax,filterSleepplaces,filterMetro,input,city]; 
    dispatch(setFilterAll(item));
    const queryString = (qs.stringify({
      city: item[7],
      rooms:item[1],
      priceMin:item[2],
      priceMax:item[3],
      sleepPlaces:item[4],  
      Rayon:item[0],
      metro:item[5],
      inputCheckboxInfo:item[6]
    }));
    ShowSort(priceMin,priceMax,category,setCategory,setCategory2,setpriceMin,setpriceMax,axios,setArenda,Arenda,city);
    navigate(`/catalog/city=?${queryString}`)
  }

  // Кнопка Очистить
  const ClearAll = (category,setCategory,setCategory2,priceMin,priceMax,setpriceMin,setpriceMax,axios,setArenda,city) => {
    dispatch(clearFilter(filterFromHome));
    Clear(category,setCategory,setCategory2,priceMin,priceMax,setpriceMin,setpriceMax,axios,setArenda,city,dispatch);
    navigate("/catalog/city=");
  }
  
  const [Arenda,setArenda]=useState<ArendaCardProduct[]>([]);
  useEffect(()=>{
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1));
      const item=[params.Rayon,params.rooms,params.priceMin,params.priceMax,params.sleepPlaces,params.metro,params.inputCheckboxInfo,params.city]; 
      dispatch(setFilterAll(item));
      dispatch(setRooms(""));
      dispatch(setCity(params.city));
      setpriceMax(params.priceMax);
      setpriceMin(params.priceMin);
      const queryString = (qs.stringify({
        city: params.city,
        rooms:params.rooms,
        priceMin:params.priceMin,
        priceMax:params.priceMax,
        sleepPlaces:params.sleepPlaces,
        Rayon:params.Rayon,
        metro:params.metro,
        inputCheckboxInfo:params.inputCheckboxInfo,
      }))
      navigate(`/catalog/city=?${queryString}`) 
      if (category=="" && sort=="По умолчанию"){
        axios.get(`/ArendaCard?city2=${city}`).then(({data})=>{
          setArenda(data);
          ShowSort(params.priceMin,params.priceMax,category,setCategory,setCategory2,setpriceMin,setpriceMax,axios,setArenda,Arenda,city)
          setData2(false);
        })
      }

      else if (category=="недорогие"){
        axios.get(`/ArendaCard?city2=${city}`).then(({data})=>{
          results = data.filter((item)=>item.sent<100);
          setArenda(results);
        })
      }

      else if (category2=="rooms"){
        axios.get(`/ArendaCard?city2=${city}&rooms=${category?category.substring(0,6):""}.`)
        .then(({data})=>{
          setArenda(data);
        })
      }

      else if (category2=="rayon"){
        axios.get(`/ArendaCard?city2=${city}&rayon=${category}`).then(({data})=>{
          setArenda(data);
      })  
      setData2(!data2)
      }
      else if(sort!=="По умолчанию"){
        if(sort=="По комнатам"){
          newItem =(Arenda.sort((a,b)=> a.rooms.substring(0,1) - b.rooms.substring(0,1)))
          setArenda(newItem)
        }
        else if(sort=="По цене"){
          newItem = Arenda.sort((a,b)=> a.sent - b.sent);
          setArenda(newItem);
        }
        else{
          newItem = Arenda.sort((a,b)=> a.square.substring(0,a.square.indexOf(" ",0)) - b.square.substring(0,b.square.indexOf(" ",0)));
          setArenda(newItem)
        }
      }
      else if(category!=="" && sort=="По умолчанию"){
        axios.get(`/ArendaCard?city2=${city}`).then(({data})=>{
          setArenda(data);
        })
      }
    }
    else if(!window.location.search){
      navigate(`/catalog/city=`) 
      if (category=="" && sort=="По умолчанию"){
        axios.get(`/ArendaCard?city2=${city}`).then(({data})=>{
          setArenda(data);
          setData2(false);
        })
      }

      else if (category=="недорогие"){
        axios.get(`/ArendaCard?city2=${city}`).then(({data})=>{
          results = data.filter((item)=>Number(item.sent)<100);
          setArenda(results);
        })
      }

      else if (category2=="rooms"){
        axios.get(`/ArendaCard?city2=${city}&rooms=${category?category.substring(0,6):""}.`)
        .then(({data})=>{
          setArenda(data);
        })
      }

      else if (category2=="rayon"){
        axios.get(`/ArendaCard?city2=${city}&rayon=${category}`).then(({data})=>{
          setArenda(data);
      })  
      setData2(!data2)
      }
      else if(sort!=="По умолчанию" && category==""){
        if(sort=="По комнатам"){
          newItem =(Arenda.sort((a,b)=> a.rooms.substring(0,1) - b.rooms.substring(0,1)))
          setArenda(newItem)
        }
        else if(sort=="По цене"){
          newItem = Arenda.sort((a,b)=> a.sent - b.sent);
          setArenda(newItem);
        }
        else{
          newItem = Arenda.sort((a,b)=> a.square.substring(0,a.square.indexOf(" ",0)) - b.square.substring(0,b.square.indexOf(" ",0)));
          setArenda(newItem);
        }
      }
      else if(category!=="" && sort==="По умолчанию"){
        axios.get(`/ArendaCard?city2=${city}`).then(({data})=>{
          setArenda(data);
        })
      }
    }
      setData2(data2);  
  },[city,category,sort,newItem]);

  return(
    <>
    <section className="firstCatalog">
      <div className="filterInfo">
        <div className="conteiner">
          <div className="Crumbs">
            <nav className="breadcrumbs" style={{display:"flex"}}>
              <Link to="/">
                <div className="HomeLink" style={{marginRight:"7px"}}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.7984 5.36427L6.41443 0.458394C6.17811 0.243027 5.82174 0.243051 5.58552 0.458371L0.201488 5.3643C0.0121833 5.5368 -0.0503478 5.80258 0.0421364 6.04138C0.134644 6.28019 0.359878 6.43448 0.615979 6.43448H1.4759V11.3498C1.4759 11.5447 1.63391 11.7027 1.8288 11.7027H4.7799C4.97478 11.7027 5.1328 11.5447 5.1328 11.3498V8.36537H6.86722V11.3498C6.86722 11.5447 7.02523 11.7027 7.22011 11.7027H10.1711C10.366 11.7027 10.524 11.5447 10.524 11.3498V6.43448H11.3841C11.6401 6.43448 11.8654 6.28016 11.9579 6.04138C12.0503 5.80256 11.9877 5.5368 11.7984 5.36427Z" fill="#4E64F9"/>
                  </svg>
                </div>
              </Link>
              <Link to={`/catalog/city=`} style={{textDecoration:"none"}}>
                <div className="catalogLink">
                  <p className="LinkText">Квартиры в {cityIn(city?city:"Минск")}</p>
                </div>
              </Link>
            </nav>
          </div>
        
          <div className="allCatalog">
            <div className="textFilterInfo">
              <div className="ArendaInnerText">
                <h1 className="ArendaInnerTextH1">
                    Аренда квартир на сутки в {cityIn(city?city:"Минск")}
                </h1>
              </div>
              <div className="ArendaSecText">
                <h2>Рекомендуем посмотреть</h2>
              </div>
              <div className="categories" style={{justifyContent:"flex-start"}}>
                {
                  categories.map((item)=>{
                    return(
                      <div className="categoriesBtn" id={`${item.id}`} onClick={()=>{categoriaClick(item.id,item.categoria,category,setCategory,setCategory2,setpriceMin,setpriceMax,city);navigate("/catalog/city=")}}>
                        <span className="textcategoriabtn">{item.value}</span>
                        <svg id={`${item.id}`} className="xHidden" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.91628 5.00007L9.81017 1.10608C10.0636 0.852787 10.0636 0.443255 9.81017 0.189966C9.55688 -0.0633221 9.14735 -0.0633221 8.89406 0.189966L5.00005 4.08396L1.10617 0.189966C0.852759 -0.0633221 0.443344 -0.0633221 0.190056 0.189966C-0.0633519 0.443255 -0.0633519 0.852787 0.190056 1.10608L4.08394 5.00007L0.190056 8.89407C-0.0633519 9.14736 -0.0633519 9.55689 0.190056 9.81018C0.316285 9.93653 0.482257 10 0.648111 10C0.813965 10 0.979819 9.93653 1.10617 9.81018L5.00005 5.91618L8.89406 9.81018C9.0204 9.93653 9.18626 10 9.35211 10C9.51797 10 9.68382 9.93653 9.81017 9.81018C10.0636 9.55689 10.0636 9.14736 9.81017 8.89407L5.91628 5.00007Z" fill="#664EF9"/>
                        </svg>
                        </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="secondCatalog">
      <div className="SecondCatalogMain">
        <div className="conteiner">
          <div className="allitemsselectcatalog">
            <div className=" select__filter__item3">
              <p className="select__filter__item__css select__filter__item__css3">Комнаты</p>
                <div className="dropdown">
                  <button className="List" id="ListFilter" onClick={defaultClickDropDown}>{filter.rooms!=="Выберите"?filter.rooms:"Выберите"}</button>
                  <ul className="List__dropdown">
                    <li className="dropdown__item">1 комната</li>
                    <li className="dropdown__item">2 комнаты</li>
                    <li className="dropdown__item">3 комнаты</li>
                    <li className="dropdown__item">4 комнаты</li>
                    <li className="dropdown__item">5 комнат</li>
                  </ul>
                  <input type="text" name="select__category" value="" className="drodown__item__hiden" />
                </div>
            </div>
            <svg className="lineDivision" width="2" height="81" viewBox="0 0 2 81" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.1" d="M1 0L1 81" stroke="#664EF9"/>
            </svg>
            <div className=" select__filter__item3">  
              <p className="select__filter__item__css select__filter__item__css3">Цена за сутки (BYN)</p>
              <div className="filter">
                <input  className="filter__input" id="filter__input1" type="text" placeholder="От" value={priceMin} onChange={()=>handlePriceMin(event.target,setpriceMin)}/>
                <p className="filter__text">-</p>
                <input className="filter__input" id="filter__input2" type="text" placeholder="До" value={priceMax} onChange={()=>handlePriceMax(event.target,setpriceMax)}/>
              </div>
            </div>
            <svg className="lineDivision" width="2" height="81" viewBox="0 0 2 81" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.1" d="M1 0L1 81" stroke="#664EF9"/>
            </svg>
            <div className=" select__filter__item3">
              <div className="raz Options OptionsCatalog" onClick={()=>OptionsClick(true)}>
                <p className="select__filter__item__css2" style={{marginRight:"10px"}}>Больше опций</p>
                <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.91109 4.29814C5.91109 2.90551 4.937 1.73697 3.63453 1.4358V0.661897C3.63453 0.296309 3.33822 0 2.97264 0C2.60705 0 2.31074 0.296309 2.31074 0.661897V1.4358C1.00835 1.73689 0.0341797 2.90551 0.0341797 4.29814C0.0341797 5.69077 1.00827 6.85931 2.31074 7.16048V17.3381C2.31074 17.7037 2.60705 18 2.97264 18C3.33822 18 3.63453 17.7037 3.63453 17.3381V7.16048C4.937 6.85931 5.91109 5.69077 5.91109 4.29814ZM1.35805 4.29814C1.35805 3.40781 2.08238 2.68348 2.97271 2.68348C3.86303 2.68348 4.58737 3.40781 4.58737 4.29814C4.58737 5.18846 3.86303 5.9128 2.97271 5.9128C2.08238 5.9128 1.35805 5.18846 1.35805 4.29814Z" fill="#664EF9"/>
                  <path d="M8.66188 8.89222V0.661897C8.66188 0.296309 8.36557 0 7.99998 0C7.63439 0 7.33808 0.296309 7.33808 0.661897V8.89222C6.03569 9.19331 5.06152 10.3619 5.06152 11.7546C5.06152 13.1472 6.03562 14.3157 7.33808 14.6169V17.3381C7.33808 17.7037 7.63439 18 7.99998 18C8.36557 18 8.66188 17.7037 8.66188 17.3381V14.6169C9.96427 14.3158 10.9384 13.1472 10.9384 11.7546C10.9384 10.3619 9.96434 9.19338 8.66188 8.89222ZM6.38539 11.7546C6.38539 10.8642 7.10973 10.1399 8.00005 10.1399C8.89038 10.1399 9.61471 10.8642 9.61471 11.7546C9.61471 12.6449 8.89038 13.3692 8.00005 13.3692C7.10973 13.3692 6.38539 12.6449 6.38539 11.7546Z" fill="#664EF9"/>
                  <path d="M15.9658 7.20151C15.9658 5.80888 14.9917 4.64034 13.6892 4.33918V0.661897C13.6892 0.296309 13.3929 0 13.0273 0C12.6617 0 12.3654 0.296309 12.3654 0.661897V4.33918C11.063 4.64027 10.0889 5.80888 10.0889 7.20151C10.0889 8.59415 11.063 9.76269 12.3654 10.0639V17.3381C12.3654 17.7037 12.6617 18 13.0273 18C13.3929 18 13.6892 17.7037 13.6892 17.3381V10.0639C14.9917 9.76269 15.9658 8.59415 15.9658 7.20151ZM11.4127 7.20151C11.4127 6.31119 12.1371 5.58685 13.0274 5.58685C13.9177 5.58685 14.6421 6.31119 14.6421 7.20151C14.6421 8.09184 13.9177 8.81618 13.0274 8.81618C12.1371 8.81618 11.4127 8.09184 11.4127 7.20151Z" fill="#664EF9"/>
                </svg>
              </div>
            </div>
            <svg className="lineDivision" width="2" height="81" viewBox="0 0 2 81" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.1" d="M1 0L1 81" stroke="#664EF9"/>
            </svg>
            <div className=" select__filter__item2">
              <button className="clearAll" onClick={()=>{ClearAll(category,setCategory,setCategory2,priceMin,priceMax,setpriceMin,setpriceMax,axios,setArenda,city)}}>Очистить</button>
            </div>
            <div className="DivisionBtns">
              <button className="Show" onClick={()=>Show(priceMin,priceMax,filterRooms.textContent,filterSleepplaces.textContent,filterRayon.textContent,filterMetro.textContent,(input as HTMLInputElement).value)}>
                <div className="btnarrow">
                  <p className="t" style={{marginRight:"10px"}}> Показать объекты</p>
                  <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.125 14.25L11.875 9.5L7.125 4.75" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
              <button className="Show2" onClick={()=>Show(priceMin,priceMax,filterRooms.textContent,filterSleepplaces.textContent,filterRayon.textContent,filterMetro.textContent,(input as HTMLInputElement).value)}>
                <div className="btnarrow">
                  <p className="t" style={{marginRight:"10px"}}>Отфильтровать</p>
                  <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.125 14.25L11.875 9.5L7.125 4.75" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="DopOptions" style={{display:"flex"}}>
        <div className="MainOptions" style={{maxWidth:"1308px"}}>
          {/* Первое деление */}
          <div className="DivisionOptions">
            <p className="titleOptions">Спальные места</p>
            <div className="dropdown">
              <button className="List" id="filterSleepplaces" onClick={defaultClickDropDown}>{filter.sleepPlaces!=="Выберите"?filter.sleepPlaces:"Выберите"}</button>
              <ul className="List__dropdown">
                <li className="dropdown__item">1 место</li>
                <li className="dropdown__item">2 места</li>
                <li className="dropdown__item">3 места</li>
                <li className="dropdown__item">4 места</li>
              </ul>
              <input type="text" name="select__category" value="" className="drodown__item__hiden" />
            </div>
            <input type="text" id="checkboxInputValue" name="select__category" value={filterFromHome.inputCheckboxInfo!==""?filterFromHome.inputCheckboxInfo:""} className="drodown__item__hiden" />
            <div className="checkbox" style={{display:"flex",marginBottom:"10px",marginTop:"30px"}}>
              <input type="checkbox" value={"Газовая плита"} id="checkbox1" onChange={() => ClickCheckbox(1)} className="checkBoxOptions" /> 
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
              <button className="List" id="FilterRayon" onClick={defaultClickDropDown}>{filter.rayon!=="Выберите"?filter.rayon:"Выберите"}</button>
              <ul className="List__dropdown">     
                <>
                {
                    Rayon.map((item)=>{
                      return(
                      <li className="dropdown__item">{item.value?((item.value).substring(0,(item.value).indexOf(" ",0))):""}</li>
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
              <button className="List" id="FilterMetro2" onClick={defaultClickDropDown}>{filter.metro!=="Выберите"?filter.metro:"Выберите"}</button>
              <ul className="List__dropdown">
                <li className="dropdown__item">Грушевка</li>
              </ul>
              <input type="text" name="select__category" value="" className="drodown__item__hiden" />
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
                  <input type="text" name="select__category"  className="drodown__item__hiden" />
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
                <input type="checkbox" value={"Посудомоечная машина"} id="checkbox30" onChange={() => ClickCheckbox(30)}className="checkBoxOptions"/> 
                <label htmlFor="checkbox30" className="textCheckboxOptions">Посудомоечная машина </label>
              </div>
          </div>
        </div>
      </div>
    </section>

    <section className="thirdCatalog">
      <div className="thirdOsnovnoe">
        <div className="conteiner">
          <div className="DivisionThirdCatalog">
            <div className="dropdown2">
            <svg className="SvgSort" width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_2831_2828)">
                  <g opacity="0.6">
                  <path className="imgSort" d="M7.32328 6.74139H11.4807C11.5823 6.74139 11.6647 6.65952 11.6647 6.55807V4.37278C11.6647 4.27148 11.5826 4.18945 11.4807 4.18945H7.32328C7.22199 4.18945 7.13965 4.27133 7.13965 4.37278V6.55822C7.13965 6.65952 7.22183 6.74139 7.32328 6.74139Z" fill="#7A7F86"/>
                  <path className="imgSort" d="M7.32328 3.07178H9.67264C9.77393 3.07178 9.85627 2.9896 9.85627 2.88815V0.703167C9.85627 0.601561 9.77424 0.519531 9.67264 0.519531H7.32328C7.22199 0.519531 7.13965 0.601406 7.13965 0.703167V2.88815C7.13965 2.9896 7.22183 3.07178 7.32328 3.07178Z" fill="#7A7F86"/>
                  <path className="imgSort" d="M7.32328 11.1105H13.0685C13.1696 11.1105 13.252 11.0287 13.252 10.9272V8.74223C13.252 8.64093 13.1699 8.55859 13.0685 8.55859H7.32328C7.22199 8.55859 7.13965 8.64078 7.13965 8.74223V10.9272C7.13965 11.0285 7.22183 11.1105 7.32328 11.1105Z" fill="#7A7F86"/>
                  <path className="imgSort" d="M14.6558 12.9297H7.32328C7.22199 12.9297 7.13965 13.0114 7.13965 13.1135V15.2981C7.13965 15.3994 7.22183 15.4818 7.32328 15.4818H14.656C14.7573 15.4818 14.8394 15.3996 14.8394 15.2981V13.1132C14.8393 13.0114 14.7574 12.9297 14.6558 12.9297Z" fill="#7A7F86"/>
                  <path className="imgSort" d="M6.08742 10.6908H4.84283V0.81072C4.84283 0.639047 4.70363 0.5 4.53211 0.5H2.02615C1.85464 0.5 1.71543 0.639047 1.71543 0.81072V10.6908H0.471C0.351218 10.6908 0.24231 10.7597 0.190731 10.8676C0.138996 10.9755 0.153755 11.1033 0.228639 11.1965L3.03692 15.3841C3.09596 15.4577 3.18498 15.5 3.27913 15.5C3.37328 15.5 3.46215 15.4577 3.52118 15.3841L6.32947 11.1965C6.40435 11.1032 6.41927 10.9755 6.36753 10.8676C6.31595 10.7598 6.2072 10.6908 6.08742 10.6908Z" fill="#7A7F86"/>
                  </g>
                  </g>
                  <defs>
                  <clipPath id="clip0_2831_2828">
                  <rect width="15" height="15" fill="white" transform="translate(0 0.5)"/>
                  </clipPath>
                  </defs>
              </svg>
                <button className="List List2" id = "SortirovkaBtn" onClick={()=>sortInfo(dispatch)}>
                  {sort}
                </button>
              <ul style={{marginLeft:"25px"}} className="List__dropdown" id="List__dropdown">
                <li className="dropdown__item">По умолчанию</li>
                <li className="dropdown__item">По комнатам</li>
                <li className="dropdown__item">По цене</li>
                <li className="dropdown__item">По площади</li>
              </ul>
              <input type="text" name="select__category" className="drodown__item__hiden" />
            </div>

            <div className="secondDivisionThirdblockCatalog">
              <button className={ToggleState === 1 ? "spisok__active":"spisok"} onClick={()=>{toggleTab(1)}}>
                <div style={{display:"flex", alignItems:"center"}}>
                  <svg style={{marginRight:"10px"}}width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect className="changeFillCatalog" y="0.5" width="14.5036" height="3.22302" rx="1" fill="#7A7F86"/>
                    <rect className="changeFillCatalog" y="11.2773" width="14.5036" height="3.22302" rx="1" fill="#7A7F86"/>
                    <rect className="changeFillCatalog" y="5.88867" width="14.5036" height="3.22302" rx="1" fill="#7A7F86"/>
                  </svg>
                  <p>Список</p> 
                </div>
              </button>
              <button className={ToggleState === 2 ? "Plitki__active":"Plitki"} onClick={()=>{toggleTab(2)}}>
                <div style={{display:"flex", alignItems:"center"}}>
                  <svg style={{marginRight:"10px"}} width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect className="changeFillCatalogPlitki" x="0.00390625" width="5.44444" height="5.44444" rx="1" fill="#664EF9"/>
                    <rect className="changeFillCatalogPlitki" x="0.00390625" y="8.55469" width="5.44444" height="5.44444" rx="1" fill="#664EF9"/>
                    <rect className="changeFillCatalogPlitki" x="8.55957" width="5.44444" height="5.44444" rx="1" fill="#664EF9"/>
                    <rect className="changeFillCatalogPlitki" x="8.55957" y="8.55469" width="5.44444" height="5.44444" rx="1" fill="#664EF9"/>
                  </svg>
                  <p>Плитки</p> 
                </div>
              </button>
              <NavLink to = "/map">
                <button className="NaKarte">
                  <div style={{display:"flex", alignItems:"center"}}>
                    <svg style={{marginRight:"10px"}}width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.2731 2.44186C9.24757 0.87907 7.55454 0 5.64989 0C3.76152 0 2.0685 0.87907 1.01036 2.44186C-0.0477828 3.97209 -0.291969 5.92558 0.359194 7.63488C0.538264 8.0907 0.815008 8.56279 1.17315 8.98605L5.29175 13.8372C5.38943 13.9349 5.4871 14 5.63361 14C5.78012 14 5.8778 13.9349 5.97547 13.8372L10.1104 8.98605C10.4685 8.56279 10.7615 8.10698 10.9243 7.63488C11.5755 5.92558 11.3313 3.97209 10.2731 2.44186ZM5.64989 8.20465C4.24989 8.20465 3.09408 7.04884 3.09408 5.64884C3.09408 4.24884 4.24989 3.09302 5.64989 3.09302C7.04989 3.09302 8.2057 4.24884 8.2057 5.64884C8.2057 7.04884 7.06617 8.20465 5.64989 8.20465Z" fill="#664EF9"/>
                    </svg>
                    <p className="ShowMap">Показать на карте</p>
                  </div>
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="CardsCatalog">
      <div className="AllCards">
        <div className="conteiner">
          <div className="SetkaCards">
            <h1 className="Naideno" style={{marginBottom:"40px"}}>Найдено {Arenda.length} результатов</h1>
            <Row className="Row" style={ToggleState==2?{display:"flex", flexWrap:"wrap",justifyContent:"space-between"}:{}}>
            {
              Arenda.length?
                (ToggleState==2)?(  
                  <MainCatalog>{Arenda}</MainCatalog>
                  ):<SecondaryCatalog>{Arenda}</SecondaryCatalog>
              :<h4 style={{marginBottom:"100px",textAlign:"center"}}>Значений не найдено</h4>
            }
            </Row> 
          </div>
        </div>
      </div>
    </section>

    <div className="Forma formaCatalog">
      <div className="conteiner">
        <div className="INFOALL">
          <div style={{display:"flex",justifyContent:"center"}}>
            <h1 className="InfoForma">Показать найденные квартиры на карте</h1>
          </div>
          <div style={{display:"flex",justifyContent:"center"}}>
            <p className="InfoSecForma">Ищите новостройки рядом с работой,
            парком или родственниками</p>
          </div>
          <div style={{display:"flex",justifyContent:"center"}}>
            <NavLink to="/map">
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
      </div>
    </div>
    
    </>
  )
}