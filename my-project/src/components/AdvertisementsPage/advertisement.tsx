import React, { useState, useEffect} from "react";
import { ToastContainer} from 'react-toastify';
import img from "../../img/Loading/Logo512.png";
import "./advertisement.css";
import { Link,useNavigate } from "react-router-dom";
import { Card,Button,Col,Row } from "react-bootstrap";
import axios from "../../axios";
import btnclick from "../Functions/clickbtnContacts";
import ReactPaginate from "react-paginate";
import CardSkeleton from "../Skeletons/advertisementSkeleton";
import { defaultClickDropDown } from "../Functions/Homepagejs";
import Modal from "../Modules/module";
import ClickCheckbox from "../Functions/ClickCheckBox";
import InputMask from 'react-input-mask';
import { Form, Formik,Field } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { decrementAdvertisement, incrementAdvertisement, setIdItem, setIdItemChange, setLength } from "../../store/actions/advertisementAction"; 
import { setCity, setRooms } from "../../store/slices/FilterSlice";
import { notifyEditingAdvertisement, notifyDeleteAdvertisement, notifyErrorAuthorization, notifyErrorAddAdvertisement } from "../Toasts/ToastsContent";
import { advertisementItem } from "../../interfaces";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination,Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FileObjectAdvertisementFromAdvertisement, OwnerImgAdvertisementFromAdvertisement } from "../Functions/btnChooseFile";
import { downLoadImgAdvertisements, downLoadImgOwner, handleCityInfo, handleDescriptionInfo, handleDopNamesInfo, handleLinkMailInfo, handleLinkViberInfo, handleLinkWhatsInfo, handleMailInfo, handleMetroInfo, handleNameInfo, handleNumberInfo, handleRayonInfo, handleRoomsInfo, handleSentInfo, handleSleepPlaces, handleSquareInfo, handleTotalInfo } from "../HandlersOnChanges/handleOnChange";
import { clickChangeAdvertisement, clickDeleteAdvertisement } from "../Functions/clickChange";

export default function advertisement() {
  const navigate=useNavigate();
  const login = localStorage.getItem("login");
  const [advertisementChange, setadvertisementChange] = useState<advertisementItem[]>([]);
  const id = localStorage.getItem("id");
  const [currentPage,setCurrentPage] = useState<advertisementItem[]>([]);
  const [CatalogPerPage,setCatalogPerPage]= useState<number>(6)
  const [itemOffset,setItemOffset] = useState<number>(0)
  const [pageCount,setCountPage]= useState<number>(0)
  const[modalAdvertisements,setModalAdvertisements] = useState<boolean>(false);
  const [itemInfo,setItemInfo] = useState<advertisementItem>();
  const [imgUrl,setImgUrl] = useState <any>();
  const [imgUrl2,setImgUrl2] = useState <any>();
  const fileReader = new FileReader();
  const fileReader2 = new FileReader();
  const [idInfo,setIdInfo] = useState<number>(null);
  const [cityInfo,setCityInfo] = useState<string>(null);
  const [sentInfo,setSentInfo] = useState<any>(null);
  const [roomsInfo,setroomsInfo] = useState<string>(null);
  const [totalInfo,settotalInfo] = useState<string>(null);
  const [squareInfo,setsquareInfo] = useState<any>(null);
  const [metroInfo,setMetroInfo] = useState<string>(null);
  const [rayonInfo,setRayonInfo] = useState<string>(null);
  const [descriptionInfo,setdescriptionInfo] = useState<string>(null);
  const [urlInfo,setUrlInfo] = useState<any>();
  const [imageOwnerInfo,setImageOwnerInfo] = useState<string>(null);
  const [nameInfo,setNameInfo] = useState<string>(null);
  const [numberInfo,setNumberInfo] = useState<string>(null);
  const [mailInfo,setMailInfo] = useState<string>(null);
  const [linkViberInfo,setLinkViberInfo] = useState<string>(null);
  const [linkMailInfo,setLinkMailInfo] = useState<string>(null);
  const [linkWatsInfo,setLinkWatsInfo] = useState<string>(null);
  const [dopNames,setDopNames] = useState<string[]>(null);
  const [sleepPlaces,setsleepPlaces] = useState<string>(null);
  const [Loading,setLoading]=useState<boolean>(true);
  const [LoadingInfo,setLoadingInfo]=useState<boolean>(true);
  const [ToggleState,setToggleState] = useState<number>(1);
  
  const checkboxInputValue_moduleChange = document.getElementById("checkboxInputValue_moduleChange");
  const FiltersleepPlacesDopAdverts = document.getElementById("FiltersleepPlacesDopAdverts");
  let CloneInfo = [];
  const dispatch = useDispatch();
  const idItem = useSelector((state:any)=>state.advertisementAction.idItem);
  const idItemChange = useSelector((state:any) => state.advertisementAction.idItemChange);
  const LengthAdvertisements = useSelector((state:any) => state.advertisementAction.length);
  const push = (item) =>{
    navigate(`/advertisement/test/${item}`)
  }

  useEffect(()=>{ // Получение данных редакс
    dispatch(setIdItem(null));
    dispatch(setIdItemChange(null))
    dispatch(setCity("Минск"));
    dispatch(setRooms("Квартиры на сутки"));
  },[]);

  useEffect(()=>{ // Фиксация изменений в объявлениях
    if (login){
      axios.get(`/users?login=${login}`).then((data) => { 
        setadvertisementChange(data.data[0].advertisement);
        setLoading(false);
      })
    }
  },[LengthAdvertisements]);

  useEffect(()=>{
    if(modalAdvertisements==true){
      document.body.style.overflow="hidden";
    }
    else{
      document.body.style.overflow="auto";
    }
  },[modalAdvertisements])

  const toggleTab = (index) =>{ // Изменение таба
    setToggleState(index)
  }

  const handlepageclick = (e) =>{
    const newOffset = (e.selected*CatalogPerPage)%advertisementChange.length;
    setItemOffset(newOffset);
    window.scrollTo({top:100,behavior:"smooth"});
  }

  useEffect(()=>{ // Удаление объекта
    if(login){
      for (let i = 0; i < advertisementChange.length; i++) {
        if(advertisementChange[i].id==idItem){
          advertisementChange.splice(i,1);
          notifyDeleteAdvertisement();
          dispatch(decrementAdvertisement(LengthAdvertisements))
          axios.patch(`/users/${id}`,{"advertisement":advertisementChange});
        }
      };
    };
  },[idItem])

  useEffect(() => { // Получение информации
    if (login){
      axios.get(`/users?login=${login}`).then((data) => {
        for (let i = 0; i < data.data[0].advertisement.length; i++) {
          if(data.data[0].advertisement[i].id==idItemChange){
            setItemInfo(data.data[0].advertisement[i]);
          }
        }
      })
    }
  },[idItemChange]);

  useEffect(() => { // Получение полей карточки и автоматическое заполнение
    if (login){
    setLoadingInfo(true);
    axios.get(`/users?login=${login}`).then((data) => {
      for (let i = 0; i < data.data[0].advertisement.length; i++) {
        if(data.data[0].advertisement[i].id==idItemChange && itemInfo!==undefined){
            setIdInfo(itemInfo.id)
            setCityInfo(itemInfo.city);
            setSentInfo(itemInfo.sent);
            setroomsInfo(itemInfo.rooms);
            settotalInfo(itemInfo.total);
            setsquareInfo(itemInfo.square);
            setMetroInfo(itemInfo.metro);
            setRayonInfo(itemInfo.rayon);
            setdescriptionInfo(itemInfo.description);
            setUrlInfo(itemInfo.url);
            setImageOwnerInfo(itemInfo.imageOwner);
            setNameInfo(itemInfo.name);
            setNumberInfo(itemInfo.number);
            setMailInfo(itemInfo.mail);
            setLinkViberInfo(itemInfo.linkViber);
            setLinkMailInfo(itemInfo.linkMail);
            setLinkWatsInfo(itemInfo.linkWats);
            setDopNames(itemInfo.options[0].name);
            setsleepPlaces(itemInfo.options[0].sleepPlaces);
            setImgUrl("");
            setImgUrl2("");
            CloneInfo = [];
            setLoadingInfo(false);
        }
      }
    });
  }
  },[idItemChange,itemInfo]);
  
  useEffect(()=>{
    // Проверка чекбоксов
    document.querySelectorAll(".checkBoxOptions3").forEach((checkbox)=>{
      dopNames.map((massive__item) => {
        if(massive__item==((checkbox as HTMLInputElement).value).replace(/\s/g, '')){
          (checkbox as HTMLInputElement).checked=true;
        }
      })
    })
  },[dopNames])

  const ChangeInfoAdvertisement = () => { // Обновление данных
    const choose = confirm("Вы уверены, что хотите изменить Ваше объявление?\n(при нажатии на `нет`, Вы cможете изменить введенные Вами данные)");
    if(choose==true){
      const itemAdvertisement = {
        "id":idInfo,
        "city":cityInfo,  
        "sent":sentInfo,
        "rooms":roomsInfo,
        "square":squareInfo,
        "metro":metroInfo,
        "rayon":rayonInfo,
        "description":descriptionInfo,
        "url":imgUrl?imgUrl:urlInfo,
        "imageOwner":imgUrl2?imgUrl2:imageOwnerInfo,
        "name":nameInfo,
        "number":numberInfo,
        "mail":mailInfo,
        "linkViber":linkViberInfo,
        "linkWats":linkWatsInfo,
        "linkMail":linkMailInfo,
        "options":[
          {
            "name":((checkboxInputValue_moduleChange as HTMLInputElement).value!=="")?
            (checkboxInputValue_moduleChange as HTMLInputElement).value.split(",")
                  :[],
            "sleepPlaces":(FiltersleepPlacesDopAdverts.textContent!=="Выберите"?FiltersleepPlacesDopAdverts.textContent:"")
          }
        ],
        "total":totalInfo,
        "check":"На рассмотрении",
      }
      
      advertisementChange.map((itemClone)=>{
        if(`${itemClone.id}` == `${itemAdvertisement.id}`){
          itemClone=itemAdvertisement;
          CloneInfo.push(itemClone)
        }
        else{
          CloneInfo.push(itemClone)
        }
      });
     
      axios.patch(`/users/${id}`,{
        "advertisement":CloneInfo
      });
      setModalAdvertisements(false);
      notifyEditingAdvertisement();    
      dispatch(incrementAdvertisement(LengthAdvertisements));   
   }
  }

  useEffect(()=>{ // Данные на странице
    const endoffset=itemOffset+CatalogPerPage;
    setCurrentPage(advertisementChange.slice(itemOffset,endoffset));
    setCountPage(Math.ceil(advertisementChange.length/CatalogPerPage));
  },[itemOffset,CatalogPerPage,advertisementChange])

  return (
    <>
      <section className="firstCatalog">
        <div className="filterInfo">
          <div className="conteiner">
            <div className="Crumbs">
              <nav className="breadcrumbs" style={{ display: "flex" }}>
                <Link to="/">
                  <div className="HomeLink" style={{ marginRight: "7px" }}>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.7984 5.36427L6.41443 0.458394C6.17811 0.243027 5.82174 0.243051 5.58552 0.458371L0.201488 5.3643C0.0121833 5.5368 -0.0503478 5.80258 0.0421364 6.04138C0.134644 6.28019 0.359878 6.43448 0.615979 6.43448H1.4759V11.3498C1.4759 11.5447 1.63391 11.7027 1.8288 11.7027H4.7799C4.97478 11.7027 5.1328 11.5447 5.1328 11.3498V8.36537H6.86722V11.3498C6.86722 11.5447 7.02523 11.7027 7.22011 11.7027H10.1711C10.366 11.7027 10.524 11.5447 10.524 11.3498V6.43448H11.3841C11.6401 6.43448 11.8654 6.28016 11.9579 6.04138C12.0503 5.80256 11.9877 5.5368 11.7984 5.36427Z"
                        fill="#4E64F9"
                      />
                    </svg>
                  </div>
                </Link>
                <Link to="/advertisement" style={{ textDecoration: "none" }}>
                  <div className="catalogLink">
                    <p className="LinkText">Мои объявления</p>
                  </div>
                </Link>
              </nav>
            </div>

            <div className="allCatalog">
              <div className="textFilterInfo">
                <div className="ArendaInnerText">
                  <h1 className="ArendaInnerTextH1">Ваши объявления</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="SecondFavourites" style={{marginTop:"50px"}}>
        <div className="CardsFavourites">
          <div className="conteiner">
            <div className="FavouritesMain" style={advertisementChange.length==0?{justifyContent:"center"}:{justifyContent:"space-between"}}>
              {
              Loading?
              <div className="" style={{display:"flex",width:"1378px",flexDirection:"column"}}>
                <div className="" style={{display:"flex",marginBottom:"50px"}}>
                  <CardSkeleton style={{marginRight:"50px"}}/>
                  <CardSkeleton style={{marginRight:"50px"}}/>
                  <CardSkeleton/>
                </div>
                <div className="">
                  <CardSkeleton style={{marginRight:"50px"}}/>
                  <CardSkeleton style={{marginRight:"50px"}}/>
                  <CardSkeleton/>
                </div>
              </div>:advertisementChange.length ? (
                currentPage.map((item) => {
                  return (
                    <Col key={item.id}>
                      <Card className="card__style" style={{width:"406px",height:"535px"}}>
                        <div className="ListInformContacts">  
                          <div className="CardMain">
                            <div className="Gold check" style={{width:"406px",height:"500px"}}>
                              <div className="colorCheck">
                                {
                                item.check==="На рассмотрении"?
                                <p className="Rassmotrenie">{item.check}</p>:
                                <p className={item.check=="Добавлено"?"Dobavleno":"Otkaz"}>{item.check}</p>
                                }
                              </div>
                            </div>
                            <Swiper pagination={{clickable:true}} navigation={{enabled:true}} modules={[Pagination,Navigation]} className="imgCard">
                              {
                                item.url.map((itemImg)=>(
                                  <SwiperSlide>
                                      <Card.Img variant="top" src={itemImg} className="imgCard"/>
                                  </SwiperSlide>
                                ))
                              }
                            </Swiper>
                            <Card.Body className="bodyCard" >
                              <Card.Title className="card__title">
                                <div className="firsttitle">
                                  <div className="sumFull">
                                    <div className="sum">{item.sent}.00 BYN</div>
                                    <p className="info__under">за сутки</p>
                                  </div>
                                  <div className="totalPeople">
                                    <div className="iconPeople">
                                      <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M7.001 0.794922C4.85814 0.794922 3.10645 2.54661 3.10645 4.68949C3.10645 6.83236 4.85814 8.58405 7.001 8.58405C9.14387 8.58405 10.8956 6.83236 10.8956 4.68949C10.8956 2.54661 9.14387 0.794922 7.001 0.794922Z" fill="#686868"/>
                                      <path d="M13.6852 11.6969C13.5832 11.4418 13.4471 11.2037 13.2941 10.9826C12.5118 9.82616 11.3043 9.06086 9.94376 8.87378C9.7737 8.85679 9.58663 8.89077 9.45056 8.99282C8.73627 9.52004 7.88595 9.79214 7.00157 9.79214C6.1172 9.79214 5.26687 9.52004 4.55258 8.99282C4.41651 8.89077 4.22944 8.83976 4.05938 8.87378C2.69884 9.06086 1.47436 9.82616 0.709058 10.9826C0.555998 11.2037 0.419931 11.4588 0.317913 11.6969C0.266903 11.799 0.283896 11.918 0.334905 12.0201C0.470972 12.2582 0.641024 12.4963 0.794084 12.7003C1.03217 13.0235 1.28728 13.3126 1.57641 13.5847C1.81449 13.8228 2.0866 14.0439 2.35873 14.265C3.70225 15.2684 5.31791 15.7956 6.98458 15.7956C8.65125 15.7956 10.2669 15.2684 11.6104 14.265C11.8825 14.0609 12.1546 13.8228 12.3927 13.5847C12.6649 13.3126 12.937 13.0235 13.1751 12.7003C13.3451 12.4793 13.4982 12.2582 13.6343 12.0201C13.7192 11.918 13.7362 11.7989 13.6852 11.6969Z" fill="#686868"/>
                                      </svg>
                                    </div>
                                    <div className="">{item.total}</div>
                                  </div>
                                  <div className="totalPeople rooms"><span className="totalRooms">{item.rooms}</span></div>
                                  <div className="totalPeople square">{item.square} м<sup style={{lineHeight:"5px"}}><small>2</small></sup></div>
                                </div>
                                <div className="secondtitle">
                                  <div className="metrorayon">
                                    <div className="metroall">
                                      <div className="iconmetro">
                                      <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M19.6401 15.4773H18.3812L14.4755 4.50977L9.99979 11.1994L5.21594 4.58926L1.61882 15.4773H0.359905L0 16.9373H4.77911L6.65514 11.5998L10.0565 16.2942L10.0769 16.3238L10.0978 16.2942L13.3449 11.5998L15.2209 16.9373H20L19.6401 15.4773Z" fill="#BDBDBD"/>
                                      </svg>
                                      </div>
                                      <div className="metro">{item.metro}</div>
                                    </div>
                                    <div className="rayonall">
                                      <div className="iconrayon">
                                      <svg width="6" height="7" viewBox="0 0 6 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <ellipse cx="2.75" cy="3.20732" rx="2.75" ry="2.84209" fill="#BDBDBD"/>
                                      </svg>
                                      </div>
                                      <div className="rayon">{item.rayon}</div>
                                    </div>
                                  </div>

                                </div>
                              </Card.Title>
                              <Card.Text className="card__text">
                                {item.description}
                              </Card.Text>  
                                <div className="btnContactsMain" style={{marginTop:"80px"}}>
                                <div className="" style={{display:"flex"}}>
                                  <div className="change" title="Изменить объявление" id={`change-${item.id}`} onClick={()=>{login && window.innerWidth>1300?clickChangeAdvertisement(item.id,dispatch,setModalAdvertisements):window.innerWidth<1300 && !login?notifyErrorAuthorization():notifyErrorAddAdvertisement()}}>
                                    <svg className="change__pancil" viewBox="0 0 80 80" width="20" height="20" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                      <title/>
                                      <g id="Layer_2">
                                        <g id="Layer_3">
                                          <polygon className="change__pancilFill" points="61.8,71.8 8.4,71.8 8.4,18.4 35.1,18.4 35.1,15.4 5.4,15.4 5.4,74.8 64.8,74.8 64.8,41.5 61.8,41.5   "/>
                                          <path className="change__pancilFill" d="M22.6,46.2l-2.1,13.1l13.1-2.1l1.3-1.4l0,0l39.8-39.7L63.7,5.2L24,44.9L22.6,46.2z M25.3,48.3l6.1,6.2L24,55.7L25.3,48.3z     M70.4,16.1l-3.9,4l-6.6-6.7l4-3.9L70.4,16.1z M57.7,15.5l6.7,6.7L33.8,52.7L27.2,46L57.7,15.5z"/>
                                        </g>
                                      </g>
                                    </svg>
                                  </div>
                                  <div className="delete" title="Удалить объявление" id={`delete-${item.id}`} onClick={()=>{clickDeleteAdvertisement(item.id,dispatch)}}>
                                    <svg className="deleteIcon" height="20" viewBox="0 0 48 48" width="20" xmlns="http://www.w3.org/2000/svg">
                                      <path className="delete__Fill" d="M12 38c0 2.21 1.79 4 4 4h16c2.21 0 4-1.79 4-4v-24h-24v24zm26-30h-7l-2-2h-10l-2 2h-7v4h28v-4z"/>
                                      <path  d="M0 0h48v48h-48z" fill="none"/>
                                    </svg>
                                  </div>
                                </div>
                                  <div className="dropdownContacts">
                                    <button className="ContactsBtn ContactsBtn4" id={`${item.id}`} onClick={()=>btnclick(item.id)}>
                                        <div className="btnall" style={{alignItems:"center"}}>
                                          <div className="btniconContacts">
                                            <svg className="telbtnicon" width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M7.18253 0.349609H1.72797C0.787063 0.349609 0.0234375 1.11324 0.0234375 2.05415L0.0234375 13.6451C0.0234375 14.586 0.787063 15.3496 1.72797 15.3496H7.18253C8.12344 15.3496 8.88707 14.586 8.88707 13.6451V2.05415C8.88707 1.11324 8.12344 0.349609 7.18253 0.349609ZM4.45527 14.6678C3.88935 14.6678 3.43254 14.211 3.43254 13.6451C3.43254 13.0792 3.88935 12.6223 4.45527 12.6223C5.02119 12.6223 5.478 13.0792 5.478 13.6451C5.478 14.211 5.02116 14.6678 4.45527 14.6678ZM7.52345 11.9405H1.38709V2.39507H7.52345V11.9405Z" fill="#664EF9"/>
                                            </svg>
                                          </div>
                                          <p className="textContacts">Контакты</p>    
                                        </div> 
                                    </button>
                                    <button className="ContactsBtn ContactsBtnNoText" style={{alignItems:"center",display:"none"}} id={`${item.id}`} onClick={()=>btnclick(item.id)}>
                                        <div className="btnall2" style={{padding:"10px 18px 8px 18px"}}>
                                          <div className="btniconContacts">
                                            <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <path d="M7.18253 0.349609H1.72797C0.787063 0.349609 0.0234375 1.11324 0.0234375 2.05415L0.0234375 13.6451C0.0234375 14.586 0.787063 15.3496 1.72797 15.3496H7.18253C8.12344 15.3496 8.88707 14.586 8.88707 13.6451V2.05415C8.88707 1.11324 8.12344 0.349609 7.18253 0.349609ZM4.45527 14.6678C3.88935 14.6678 3.43254 14.211 3.43254 13.6451C3.43254 13.0792 3.88935 12.6223 4.45527 12.6223C5.02119 12.6223 5.478 13.0792 5.478 13.6451C5.478 14.211 5.02116 14.6678 4.45527 14.6678ZM7.52345 11.9405H1.38709V2.39507H7.52345V11.9405Z" fill="#664EF9"/>
                                            </svg>
                                          </div>
                                        </div> 
                                    </button>
                                    <div className="informContacts" id={`${item.id}`}>
                                <img src={item.imageOwner} className="circleIcon" alt="" />
                                <p className="Owner">Владелец</p>
                                <div className="NameOwner">
                                <h1 className="NameOwner">{item.name}</h1>
                                </div>
                                <div className="NumberOwner">
                                  <h1 className="NumberOwner">{item.number}</h1>
                                </div>
                                <div className="mailOwner">
                                  <a className="mailOwner"href={item.mail}>{item.mail}</a>
                                </div>
                                <div className="links">
                                  <a className="iconSocContacts" href={item.linkViber}>
                                    <svg  width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect className="iconSocHover" width="36" height="36" rx="18" fill="#7B519D"/>
                                    <path d="M17.9024 10.4075C16.6336 10.4247 13.9035 10.633 12.3763 12.0323C11.2426 13.1594 10.8465 14.821 10.8003 16.8788C10.7608 18.9287 10.7146 22.778 14.4255 23.8267V25.4218C14.4255 25.4218 14.4005 26.0611 14.8223 26.1929C15.343 26.3577 15.6396 25.864 16.134 25.3367L17.0567 24.2953C19.5944 24.5062 21.5388 24.0191 21.7629 23.9466C22.277 23.7819 25.1778 23.4121 25.6524 19.5621C26.1401 15.5869 25.4151 13.0823 24.11 11.9486L24.1034 11.9473C23.708 11.5847 22.1261 10.4313 18.5866 10.4181C18.5866 10.4181 18.3256 10.4016 17.9024 10.4075ZM17.9466 11.5261C18.3058 11.5241 18.5266 11.5393 18.5266 11.5393C21.519 11.5458 22.95 12.4489 23.2861 12.752C24.3869 13.6939 24.9524 15.9528 24.5385 19.2721C24.143 22.4887 21.7899 22.693 21.3549 22.8314C21.1703 22.8907 19.4566 23.3126 17.3 23.1741C17.3 23.1741 15.6923 25.1126 15.1914 25.6136C15.1123 25.6993 15.02 25.7256 14.9607 25.7124C14.875 25.6927 14.8487 25.5872 14.8553 25.4422L14.8684 22.7932C11.7237 21.9231 11.9083 18.6394 11.9413 16.9256C11.9808 15.2119 12.3038 13.8067 13.2595 12.8575C14.5494 11.6909 16.8682 11.5327 17.9459 11.5261H17.9466ZM18.1838 13.2398C18.1579 13.2397 18.1322 13.2447 18.1082 13.2546C18.0842 13.2645 18.0624 13.279 18.0441 13.2973C18.0257 13.3156 18.0111 13.3374 18.0012 13.3613C17.9912 13.3853 17.9861 13.4109 17.9861 13.4369C17.9861 13.4893 18.0069 13.5396 18.044 13.5767C18.0811 13.6138 18.1314 13.6346 18.1838 13.6346C18.6739 13.6253 19.1609 13.7131 19.6168 13.8929C20.0727 14.0728 20.4885 14.3412 20.8401 14.6826C21.5586 15.3813 21.9086 16.3173 21.9217 17.5432C21.9217 17.5692 21.9269 17.5949 21.9368 17.6189C21.9467 17.6429 21.9613 17.6647 21.9797 17.6831C21.998 17.7014 22.0198 17.716 22.0438 17.7259C22.0678 17.7359 22.0935 17.741 22.1195 17.741V17.735C22.1719 17.735 22.2222 17.7142 22.2593 17.6771C22.2964 17.64 22.3172 17.5897 22.3172 17.5373C22.3417 16.9608 22.2485 16.3853 22.0434 15.8459C21.8383 15.3065 21.5255 14.8145 21.1242 14.3999C20.3398 13.6353 19.3498 13.2398 18.1832 13.2398H18.1838ZM15.5777 13.6946C15.4375 13.6746 15.2947 13.7025 15.1723 13.7737H15.1644C14.8941 13.9319 14.645 14.1296 14.4077 14.3933C14.2297 14.6042 14.1302 14.8145 14.1039 15.0188C14.0883 15.1386 14.0996 15.2604 14.1368 15.3754L14.15 15.382C14.3531 15.9792 14.6182 16.5536 14.9409 17.0957C15.3592 17.8549 15.8731 18.5573 16.4701 19.1858L16.4899 19.2121L16.5163 19.2319L16.536 19.2517L16.5558 19.2715C17.1867 19.8699 17.891 20.386 18.6518 20.8072C19.5219 21.2818 20.0505 21.5059 20.3669 21.5982V21.6048C20.4591 21.6311 20.5435 21.6443 20.6292 21.6443C20.8993 21.6246 21.155 21.5151 21.3556 21.3332C21.6126 21.1025 21.8169 20.8468 21.9685 20.5765V20.5699C22.1201 20.2865 22.0674 20.0156 21.8499 19.8311C21.4115 19.4476 20.9369 19.1076 20.4328 18.816C20.0966 18.6315 19.7539 18.7435 19.6155 18.9281L19.3189 19.3031C19.1673 19.4877 18.8904 19.4613 18.8904 19.4613L18.8825 19.4679C16.826 18.9406 16.279 16.8584 16.279 16.8584C16.279 16.8584 16.2526 16.575 16.4437 16.43L16.8129 16.1334C16.9908 15.9884 17.1161 15.6456 16.9249 15.3095C16.6337 14.8051 16.2937 14.3304 15.9099 13.8923C15.8264 13.7888 15.7085 13.7186 15.5777 13.6946ZM18.5259 14.2812C18.4735 14.2814 18.4233 14.3024 18.3863 14.3396C18.3493 14.3768 18.3287 14.4272 18.3288 14.4796C18.329 14.5321 18.35 14.5823 18.3872 14.6192C18.4244 14.6562 18.4748 14.6769 18.5272 14.6767C19.1869 14.6881 19.815 14.9607 20.2739 15.4347C20.481 15.6631 20.6401 15.9307 20.742 16.2216C20.8439 16.5126 20.8865 16.821 20.8671 17.1286C20.8673 17.181 20.8882 17.2311 20.9253 17.268C20.9624 17.305 21.0125 17.3257 21.0649 17.3257L21.0715 17.3336C21.0975 17.3336 21.1233 17.3285 21.1473 17.3185C21.1713 17.3085 21.1932 17.2939 21.2115 17.2755C21.2299 17.2571 21.2444 17.2352 21.2543 17.2111C21.2642 17.187 21.2693 17.1613 21.2692 17.1352C21.289 16.3509 21.0451 15.6918 20.5639 15.1644C20.0828 14.6371 19.4105 14.3405 18.5536 14.2812C18.5444 14.2806 18.5351 14.2806 18.5259 14.2812ZM18.8489 15.3483C18.8225 15.3476 18.7961 15.352 18.7714 15.3614C18.7467 15.3708 18.724 15.385 18.7048 15.4031C18.6855 15.4213 18.67 15.443 18.6592 15.4672C18.6484 15.4913 18.6424 15.5173 18.6416 15.5438C18.6408 15.5702 18.6453 15.5966 18.6547 15.6213C18.6641 15.646 18.6782 15.6686 18.6964 15.6879C18.7145 15.7071 18.7363 15.7226 18.7604 15.7335C18.7846 15.7443 18.8106 15.7503 18.837 15.7511C19.4896 15.784 19.8059 16.1136 19.8455 16.7925C19.8472 16.8438 19.8688 16.8924 19.9057 16.9281C19.9426 16.9637 19.9919 16.9837 20.0432 16.9836H20.0498C20.0764 16.9828 20.1025 16.9766 20.1266 16.9655C20.1507 16.9544 20.1724 16.9385 20.1902 16.9188C20.208 16.8991 20.2217 16.876 20.2305 16.8509C20.2392 16.8258 20.2428 16.7992 20.241 16.7727C20.1948 15.8895 19.7137 15.3945 18.8568 15.3483C18.8542 15.3483 18.8515 15.3483 18.8489 15.3483Z" fill="white"/>
                                    </svg>
                                  </a>
                                  <a className="iconSocContacts" href={item.linkWats}>
                                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect className="iconSocHover iconSocHover2" width="36" height="36" rx="18" fill="#0DBB41"/>
                                    <path d="M23.3797 12.5885C22.6794 11.883 21.8458 11.3237 20.9275 10.9431C20.0092 10.5624 19.0244 10.368 18.0303 10.3711C13.8635 10.3711 10.4721 13.7625 10.4721 17.9322C10.4721 19.2645 10.8212 20.5673 11.4821 21.7118L10.4092 25.6306L14.4176 24.5786C15.5258 25.1823 16.7674 25.499 18.0294 25.4999H18.0322C22.199 25.4999 25.5933 22.1085 25.5933 17.9389C25.5958 16.9451 25.4014 15.9607 25.0213 15.0426C24.6412 14.1244 24.0829 13.2906 23.3788 12.5895L23.3797 12.5885ZM18.0322 24.2239C16.906 24.224 15.8005 23.9213 14.8316 23.3474L14.6017 23.2101L12.2231 23.8328L12.8583 21.5143L12.7095 21.2759C12.078 20.2752 11.7442 19.1155 11.7472 17.9322C11.7493 16.2652 12.4126 14.6671 13.5916 13.4886C14.7706 12.3101 16.369 11.6475 18.036 11.6462C19.7136 11.6462 21.2939 12.3024 22.4794 13.4879C23.0644 14.0708 23.5281 14.7638 23.8437 15.527C24.1593 16.2901 24.3206 17.1083 24.3182 17.9341C24.3153 21.4028 21.4961 24.2229 18.0322 24.2229V24.2239ZM21.478 19.5154C21.2901 19.42 20.3602 18.9641 20.1876 18.9012C20.015 18.8382 19.8891 18.8058 19.7613 18.9965C19.6364 19.1844 19.273 19.6107 19.1624 19.7385C19.0518 19.8635 18.9421 19.8816 18.7542 19.7862C18.5663 19.6908 17.955 19.4915 17.234 18.8478C16.6732 18.3471 16.2927 17.7271 16.182 17.5393C16.0714 17.3514 16.1696 17.2474 16.2659 17.1549C16.3527 17.071 16.4538 16.9346 16.5492 16.824C16.6446 16.7133 16.6741 16.6361 16.7371 16.5083C16.8 16.3834 16.7695 16.2727 16.7218 16.1774C16.6741 16.082 16.2955 15.1521 16.141 14.7735C15.9894 14.4034 15.8311 14.4549 15.7147 14.4483C15.6041 14.4425 15.4791 14.4425 15.3542 14.4425C15.2293 14.4425 15.0233 14.4902 14.8506 14.6781C14.678 14.866 14.1888 15.3247 14.1888 16.2546C14.1888 17.1845 14.8649 18.0819 14.9603 18.2097C15.0557 18.3347 16.2927 20.2449 18.1877 21.0623C18.6378 21.2559 18.9898 21.3722 19.2635 21.4619C19.7165 21.6049 20.1275 21.584 20.4528 21.5363C20.8161 21.4829 21.5705 21.0804 21.7288 20.6388C21.8871 20.1973 21.8871 19.8196 21.8395 19.7414C21.7946 19.6575 21.6697 19.6107 21.479 19.5144L21.478 19.5154Z" fill="white"/>
                                    </svg>
                                  </a>
                                  <a className="iconSocContacts" href={item.linkMail}>
                                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <rect className="iconSocHover iconSocHover3" width="36" height="36" rx="18" fill="#664EF9"/>
                                  <g clipPath="url(#clip0_2831_2022)">
                                  <path d="M25.3926 25.0709C25.7973 25.0709 26.1478 24.9373 26.4459 24.6735L21.3462 19.5736C21.2239 19.6613 21.1053 19.7465 20.9932 19.8275C20.6116 20.1086 20.3018 20.3281 20.064 20.4853C19.8262 20.6429 19.5098 20.8035 19.1148 20.9675C18.7196 21.1317 18.3514 21.2135 18.0098 21.2135H17.9998H17.9898C17.6482 21.2135 17.28 21.1317 16.8848 20.9675C16.4896 20.8035 16.1732 20.6429 15.9356 20.4853C15.6978 20.3281 15.3882 20.1087 15.0064 19.8275C14.9 19.7495 14.782 19.6639 14.6544 19.5723L9.55371 24.6735C9.85172 24.9373 10.2025 25.0709 10.6071 25.0709H25.3926V25.0709Z" fill="white"/>
                                  <path d="M10.0146 16.3623C9.63301 16.1079 9.29461 15.8165 9 15.4883V23.2473L13.4948 18.7525C12.5956 18.1247 11.437 17.3289 10.0146 16.3623Z" fill="white"/>
                                  <path d="M25.9964 16.3623C24.6282 17.2883 23.4654 18.0855 22.5078 18.7543L27.0008 23.2475V15.4883C26.7128 15.8099 26.378 16.1011 25.9964 16.3623Z" fill="white"/>
                                  <path d="M25.3925 10.9277H10.607C10.0912 10.9277 9.69465 11.1019 9.41683 11.4499C9.13879 11.7981 9 12.2335 9 12.7557C9 13.1775 9.18418 13.6346 9.55239 14.1269C9.9206 14.6191 10.3124 15.0057 10.7276 15.287C10.9552 15.4478 11.6416 15.925 12.7868 16.7184C13.405 17.1468 13.9427 17.5202 14.4047 17.8424C14.7985 18.1168 15.1381 18.3544 15.4185 18.5516C15.4506 18.5742 15.5013 18.6104 15.5685 18.6584C15.6408 18.7104 15.7324 18.7764 15.8455 18.858C16.0631 19.0154 16.2439 19.1426 16.3878 19.2398C16.5316 19.337 16.7059 19.4456 16.9102 19.5662C17.1145 19.6866 17.3071 19.7772 17.4879 19.8374C17.6687 19.8976 17.8361 19.9278 17.99 19.9278H18H18.01C18.164 19.9278 18.3314 19.8976 18.5123 19.8374C18.693 19.7772 18.8855 19.6868 19.0899 19.5662C19.294 19.4456 19.468 19.3368 19.6123 19.2398C19.7563 19.1426 19.9371 19.0154 20.1547 18.858C20.2675 18.7764 20.3591 18.7104 20.4315 18.6586C20.4987 18.6104 20.5493 18.5744 20.5817 18.5516C20.8001 18.3996 21.1405 18.163 21.5982 17.8452C22.4309 17.2666 23.6573 16.415 25.2826 15.287C25.7714 14.9455 26.1797 14.5336 26.5079 14.0516C26.8356 13.5696 26.9998 13.064 26.9998 12.5349C26.9998 12.0929 26.8406 11.7147 26.5227 11.3997C26.2046 11.0851 25.8278 10.9277 25.3925 10.9277Z" fill="white"/>
                                  </g>
                                  </svg>
                                  </a>
                                </div>
                              </div>    
                                  </div>
                                <Button variant="primary" className="Morebtn">
                                <div className="More">
                                    <p className="textMore" onClick={(e)=>push(item.id)}>Подробнее</p>
                                </div>
                                </Button>
                              </div>
                            </Card.Body>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  );
                })
              ) : (
                <div className="Soobshenie">
                  <h1>Здесь пусто</h1>
                    <svg
                      className="iconSoobshenie"
                      xmlns="http://www.w3.org/2000/svg"
                      height="80px"
                      viewBox="0 0 24 24"
                      fill="none"
                      width="80px"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        stroke="none"
                      />
                    </svg>
                </div>
              )}
              <div style={{width:"100%"}}>
                <ReactPaginate
                  breakLabel={"..."}
                  containerClassName="pagination"
                  pageRangeDisplayed={7}
                  pageClassName="pageItem"
                  pageLinkClassName="pageLink"
                  activeClassName="pageItem pageItem__active"
                  activeLinkClassName="pageLink pageLink__active"
                  pageCount={pageCount}
                  onPageChange={handlepageclick}
                  previousClassName="previousClass"
                  nextClassName="nextClass"
                />
              </div>
            </div>
          </div>
        </div>
      </section>    
      <Modal active={modalAdvertisements} setActive={setModalAdvertisements}>
      {
          <>
             <h1 style={{textAlign:"center", marginBottom:"15px"}} className="textBreath">Редактирование Вашего объявления</h1>
             <section className="FirstObyablenie">
              <div className="infoAdvertisement">
                <div className="conteiner" style={{width:"1150px"}}>
                  <div className="exit">
                    <svg onClick={()=>{setModalAdvertisements(false);setToggleState(1);}} height="30" viewBox="0 0 512 512" width="30  " xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                      <path d="M255.997,460.351c112.685,0,204.355-91.668,204.355-204.348S368.682,51.648,255.997,51.648  c-112.68,0-204.348,91.676-204.348,204.355S143.317,460.351,255.997,460.351z M255.997,83.888  c94.906,0,172.123,77.209,172.123,172.115c0,94.898-77.217,172.117-172.123,172.117c-94.9,0-172.108-77.219-172.108-172.117  C83.888,161.097,161.096,83.888,255.997,83.888z"/>
                      <path d="M172.077,341.508c3.586,3.523,8.25,5.27,12.903,5.27c4.776,0,9.54-1.84,13.151-5.512l57.865-58.973l57.878,58.973  c3.609,3.672,8.375,5.512,13.146,5.512c4.658,0,9.316-1.746,12.902-5.27c7.264-7.125,7.369-18.793,0.242-26.051l-58.357-59.453  l58.357-59.461c7.127-7.258,7.021-18.92-0.242-26.047c-7.252-7.123-18.914-7.018-26.049,0.24l-57.878,58.971l-57.865-58.971  c-7.135-7.264-18.797-7.363-26.055-0.24c-7.258,7.127-7.369,18.789-0.236,26.047l58.351,59.461l-58.351,59.453  C164.708,322.715,164.819,334.383,172.077,341.508z"/>
                    </svg>
                  </div>

                      {
                      LoadingInfo?
                      <>
                        <div className="LoadingAnimation">
                          <img className="LoadingImg" src={img} alt="" />
                        </div>
                      </>
                      :itemInfo?
                      <Formik 
                        initialValues={{
                          url:"",
                          imageOwner:"",
                        }} 
                        validateOnBlur
                        onSubmit={ChangeInfoAdvertisement}>
                        {({values,errors,touched,handleChange,handleBlur,isValid,handleSubmit,dirty})=>(
                        <Form>
                          <div className="block__tabs" style={{justifyContent:"center",marginBottom:"20px"}}>
                            <div className={(ToggleState === 1 && (cityInfo!=="" && totalInfo!=="" && roomsInfo!=="" && linkViberInfo!=="" && linkWatsInfo!=="" && linkMailInfo!=="" && mailInfo!=="" && metroInfo!=="" && nameInfo!=="" && numberInfo!=="" && squareInfo!=="" && rayonInfo!=="" && sentInfo!=="" ))? "tabs tabs__active":(ToggleState === 1 && (cityInfo=="" || totalInfo=="" || roomsInfo=="" || linkViberInfo=="" || linkWatsInfo=="" || linkMailInfo=="" || mailInfo=="" || metroInfo=="" || nameInfo=="" || numberInfo=="" || squareInfo=="" || rayonInfo=="" || sentInfo==""))?"tabs tabs__active tabs__error__active":(ToggleState !== 1 && (cityInfo=="" || totalInfo=="" || roomsInfo=="" || linkViberInfo=="" || linkWatsInfo=="" || linkMailInfo=="" || mailInfo=="" || metroInfo=="" || nameInfo=="" || numberInfo=="" || squareInfo=="" || rayonInfo=="" || sentInfo=="")?"tabs tabs__error":"tabs" )} onClick={()=>toggleTab(1)} >
                              <p className="select__item" >Основная информация*</p>
                            </div>
                            <div className={ToggleState === 2 ? "tabs tabs__active":"tabs"} onClick={()=>toggleTab(2)}>
                              <p className="select__item" >Дополнительная информация</p>
                            </div>
                            <div className={(ToggleState === 3 && descriptionInfo!=="") ? "tabs tabs__active":(ToggleState===3 && descriptionInfo=="")?"tabs tabs__active tabs__error__active":(ToggleState!==3 && descriptionInfo=="")?"tabs tabs__error":"tabs"} onClick={()=>toggleTab(3)}>
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
                                          <img style={{width:"250px",height:"250px"}} src={imgItem} />
                                        </SwiperSlide>
                                      ))
                                    }
                                  </Swiper>
                                :
                                  <Swiper pagination={{clickable:true}} navigation={{enabled:true}} modules={[Pagination,Navigation]} className="IconImgAdvertisement">
                                    {
                                      urlInfo!==undefined && urlInfo!==null?
                                      urlInfo.map((imgItem)=>(
                                        <SwiperSlide>
                                          <img style={{width:"250px",height:"250px"}} src={imgItem} />
                                        </SwiperSlide>
                                      )):""
                                    }
                                  </Swiper>
                              }
                              <button onClick={FileObjectAdvertisementFromAdvertisement} type="button" className="Voyti choose">Выберите файл</button>
                              <Field id="file-input5" accept="image/*,.png,.jpg,.gif,.web," type="file" value={values.url} onChange={()=>downLoadImgAdvertisements(event.target,fileReader,imgUrl,setImgUrl,urlInfo)} style={{display:"none"}} />
                            </div>
                            <div className="partTwoAdvertisement" style={{display:"flex"}}>
                              <div className="InformObject" style={{marginRight:"40px"}}>
                                <h2 style={{marginRight:"17px",marginBottom:"20px",textAlign:"center",fontSize:"16px"}}>Информация об объекте</h2>
                                <div className="LOGIN">
                                    <Field className={(cityInfo==="")? "login__error cityArenda":"login cityArenda"} name = "city" type="text"  value={cityInfo} onBlur={handleBlur} onChange={()=>handleCityInfo(event.target,setCityInfo)} placeholder="Город"/>
                                    <svg className={(cityInfo==="")? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z" fill="#EB5757"/>
                                    </svg>
                                    <svg className="userOf" width="20" height="20" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg">
                                      <path opacity="0.3" className="user" d="M640 240v240c0 17.67-14.33 32-32 32H32c-17.67 0-32-14.33-32-32L0 144c0-26.51 21.49-48 48-48H64V24.01c0-13.25 10.75-23.1 24-23.1S112 10.75 112 24.01v72h64V24.01c0-13.25 10.75-23.1 24-23.1S224 10.75 224 24.01v71.1h64V48.01c0-26.51 21.49-48 48-48l96 .0049c26.51 0 48 21.49 48 48v143.1h112C618.5 192 640 213.5 640 240zM128 172c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.375-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V172zM128 268c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.375-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V268zM128 364c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.375-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V364zM256 172c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.375-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V172zM256 268c0-6.625-5.375-12-12-12h-40C197.4 256 192 261.4 192 268v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V268zM256 364c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.38-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V364zM416 76.01c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.375-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V76.01zM416 172c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.38-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V172zM416 268c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.38-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V268zM576 268c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.375-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V268zM576 364c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.375-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V364z"/>
                                    </svg>
                                </div>

                              <div className="LOGIN"> 
                                <Field className={(sentInfo === "")? "login__error cityArenda":"login cityArenda"}  name = "sent" type="text" value={sentInfo} onBlur={handleBlur} onChange={()=>handleSentInfo(event.target,setSentInfo)} placeholder="Цена(в BYN за сутки)"/>
                                <svg className={(sentInfo==="")? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="rgb(235, 87, 87)" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z" />
                                </svg>
                                <svg className="userOf" style={{marginTop:"11px"}} width="25" height="25" viewBox="0 0 512 512" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                  <path opacity="0.3" className="user" d="M256,73.089c-100.864,0-182.911,82.058-182.911,182.917S155.136,438.911,256,438.911  c100.859,0,182.911-82.046,182.911-182.905S356.86,73.089,256,73.089z M256,410.059c-84.951,0-154.06-69.108-154.06-154.054  c0-84.956,69.109-154.065,154.06-154.065c84.951,0,154.06,69.109,154.06,154.065C410.06,340.951,340.951,410.059,256,410.059z"/>
                                  <path opacity="0.3" className="user" d="M227.076,220.157c0-11.572,16.925-13.548,31.606-13.548c13.837,0,32.744,6.485,48.553,14.681l3.098-31.895  c-7.906-4.52-26.247-9.884-44.877-11.005l4.515-32.461H239.77l4.521,32.461c-38.947,3.664-51.651,26.242-51.651,45.154  c0,47.697,88.898,37.547,88.898,66.888c0,11.017-10.434,14.959-28.785,14.959c-24.832,0-43.467-8.74-53.056-17.779l-4.803,35.848  c9.04,5.364,27.375,10.161,49.397,11.294l-4.521,31.329h30.201l-4.515-31.617c45.722-3.954,53.906-28.23,53.906-44.311  C319.363,233.428,227.076,247.532,227.076,220.157z"/>
                                </svg>
                              </div>

                              <div className="LOGIN">
                                <Field className={(roomsInfo==="")? "login__error cityArenda":"login cityArenda"}  name = "rooms" type="text" value={roomsInfo} onChange={()=>handleRoomsInfo(event.target,setroomsInfo)} placeholder="Комнаты"/>
                                <svg className={(roomsInfo==="")? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="rgb(235, 87, 87)" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z"/>
                                </svg>
                                <svg className="userOf" style={{marginTop:"11px"}} fill="none" height="25" viewBox="0 0 20 20" width="25" xmlns="http://www.w3.org/2000/svg">
                                  <path opacity="0.3" className="user" d="M12.485 9.99976C12.485 10.414 12.1492 10.7498 11.735 10.7498C11.3208 10.7498 10.985 10.414 10.985 9.99976C10.985 9.58554 11.3208 9.24976 11.735 9.24976C12.1492 9.24976 12.485 9.58554 12.485 9.99976Z"/>
                                  <path opacity="0.3" className="user" d="M9.60274 2.01206C9.4551 1.98045 9.30109 2.01724 9.18368 2.11217C9.06627 2.2071 8.99805 2.35 8.99805 2.50098L8.99867 17.4986L8.99805 17.501C8.99805 17.652 9.0663 17.7949 9.18374 17.8898C9.30119 17.9848 9.45525 18.0215 9.6029 17.9899L16.6023 16.4886C16.8328 16.4392 16.9975 16.2355 16.9975 15.9998V3.99976C16.9975 3.76396 16.8328 3.56021 16.6022 3.51084L9.60274 2.01206ZM9.99805 16.8824V3.11938L15.9975 4.40403V15.5956L9.99805 16.8824Z"/>
                                  <path opacity="0.3" className="user" d="M7.99988 16.9974V15.9974H3.99805V4.00208H7.99988V3.00208H3.49805C3.2219 3.00208 2.99805 3.22593 2.99805 3.50208V16.4974C2.99805 16.7735 3.2219 16.9974 3.49805 16.9974H7.99988Z"/>
                                </svg>
                              </div>

                              <div className="LOGIN">
                                <Field className={(totalInfo==="")? "login__error cityArenda":"login cityArenda"}  name = "total" type="text" value={totalInfo} onChange={()=>handleTotalInfo(event.target,settotalInfo)} placeholder="Кол-во людей"/>
                                <svg className={(totalInfo==="")? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="rgb(235, 87, 87)" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z" fill="#EB5757"/>
                                </svg>
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
                                <Field className={(squareInfo==="")? "login__error cityArenda":"login cityArenda"}  name = "square" type="text" value={squareInfo} onChange={()=>handleSquareInfo(event.target,setsquareInfo)} placeholder="Площадь объекта"/>
                                <svg className={(squareInfo==="")? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="rgb(235, 87, 87)" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z"/>
                                </svg>
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
                                <Field className={(metroInfo==="")? "login__error cityArenda":"login cityArenda"}  name = "metro" type="text" value={metroInfo} onChange={()=>handleMetroInfo(event.target,setMetroInfo)} placeholder="Метро(ближайшее)"/>
                                <svg className={(metroInfo==="")? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="rgb(235, 87, 87)" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z" fill="#EB5757"/>
                                </svg>
                              <svg className="userOf" style={{marginTop:"11px"}} fill="none" height="25" width="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path opacity="0.3" className="user" d="M8.71,14.29a1.00157,1.00157,0,0,0-1.08984-.21.90087.90087,0,0,0-.54.54,1.00008,1.00008,0,1,0,1.83984,0A1.14718,1.14718,0,0,0,8.71,14.29Zm8,0a1.04669,1.04669,0,0,0-1.41992,0,1.14718,1.14718,0,0,0-.21.33008A.98919.98919,0,0,0,15.29,15.71a1.14718,1.14718,0,0,0,.33008.21.94107.94107,0,0,0,.75976,0,1.16044,1.16044,0,0,0,.33008-.21.98919.98919,0,0,0,.21-1.08984A1.14718,1.14718,0,0,0,16.71,14.29Zm2.59943,4.60528a4.97014,4.97014,0,0,0,1.78436-4.8172l-1.5-8A5.00038,5.00038,0,0,0,14.68066,2H9.31934A5.00038,5.00038,0,0,0,4.40625,6.07812l-1.5,8a4.97014,4.97014,0,0,0,1.78436,4.8172L3.293,20.293A.99989.99989,0,1,0,4.707,21.707l1.86914-1.86914A5.00576,5.00576,0,0,0,7.81934,20h8.36132a5.00576,5.00576,0,0,0,1.24317-.16211L19.293,21.707A.99989.99989,0,0,0,20.707,20.293ZM6.37109,6.44727A3.0021,3.0021,0,0,1,9.31934,4h5.36132a3.0021,3.0021,0,0,1,2.94825,2.44727l.34668,1.84893a7.95514,7.95514,0,0,1-11.95118,0ZM18.48828,16.916A2.9899,2.9899,0,0,1,16.18066,18H7.81934a3.00057,3.00057,0,0,1-2.94825-3.55273l.71106-3.79236a9.95447,9.95447,0,0,0,12.8357,0l.71106,3.79236A2.99028,2.99028,0,0,1,18.48828,16.916Z"/>
                                </svg>
                              </div>

                              <div className="LOGIN">
                                <Field className={(rayonInfo==="")? "login__error cityArenda":"login cityArenda"}  name = "rayon" type="text" value={rayonInfo} onChange={()=>handleRayonInfo(event.target,setRayonInfo)} placeholder="Район"/>
                                <svg className={(rayonInfo==="")? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="rgb(235, 87, 87)" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z" fill="#EB5757"/>
                                </svg>
                                <svg className="userOf" width="20" height="20" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg">
                                  <path opacity="0.3" className="user" d="M640 240v240c0 17.67-14.33 32-32 32H32c-17.67 0-32-14.33-32-32L0 144c0-26.51 21.49-48 48-48H64V24.01c0-13.25 10.75-23.1 24-23.1S112 10.75 112 24.01v72h64V24.01c0-13.25 10.75-23.1 24-23.1S224 10.75 224 24.01v71.1h64V48.01c0-26.51 21.49-48 48-48l96 .0049c26.51 0 48 21.49 48 48v143.1h112C618.5 192 640 213.5 640 240zM128 172c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.375-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V172zM128 268c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.375-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V268zM128 364c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.375-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V364zM256 172c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.375-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V172zM256 268c0-6.625-5.375-12-12-12h-40C197.4 256 192 261.4 192 268v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V268zM256 364c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.38-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V364zM416 76.01c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.375-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V76.01zM416 172c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.38-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V172zM416 268c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.38-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V268zM576 268c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.375-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V268zM576 364c0-6.625-5.375-12-12-12h-40c-6.625 0-12 5.375-12 12v40c0 6.625 5.375 12 12 12h40c6.625 0 12-5.375 12-12V364z"/>
                                </svg>
                              </div>
                            </div>
                            <div className="informOwner">
                            <h2 style={{marginRight:"17px",marginBottom:"20px",textAlign:"center",fontSize:"16px"}}>Информация о владельце</h2>
                            <div className="LOGIN">
                                <Field className={(nameInfo==="")? "login__error cityArenda":"login cityArenda"}  name = "name" type="text" value={nameInfo} onChange={()=>handleNameInfo(event.target,setNameInfo)}  placeholder="ФИО"/>
                                <svg className={(nameInfo==="")? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z" fill="#EB5757"/>
                                </svg>
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
                                <InputMask mask = "+7\ - 999 999 99 99" maskChar="_" className={(numberInfo==="")? "login__error cityArenda":"login cityArenda"}  name = "number" type="text" value={numberInfo} onChange={()=>handleNumberInfo(event.target,setNumberInfo)} placeholder="Телефон"/>
                                <svg className={(numberInfo==="")? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z" fill="#EB5757"/>
                                </svg>
                                <svg className="userOf" height="25"  viewBox="0 0 512 512" width="25" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                  <path opacity="0.3" className="user" d="M415.9,335.5c-14.6-15-56.1-43.1-83.3-43.1c-6.3,0-11.8,1.4-16.3,4.3c-13.3,8.5-23.9,15.1-29,15.1c-2.8,0-5.8-2.5-12.4-8.2  l-1.1-1c-18.3-15.9-22.2-20-29.3-27.4l-1.8-1.9c-1.3-1.3-2.4-2.5-3.5-3.6c-6.2-6.4-10.7-11-26.6-29l-0.7-0.8  c-7.6-8.6-12.6-14.2-12.9-18.3c-0.3-4,3.2-10.5,12.1-22.6c10.8-14.6,11.2-32.6,1.3-53.5c-7.9-16.5-20.8-32.3-32.2-46.2l-1-1.2  c-9.8-12-21.2-18-33.9-18c-14.1,0-25.8,7.6-32,11.6c-0.5,0.3-1,0.7-1.5,1c-13.9,8.8-24,20.9-27.8,33.2c-5.7,18.5-9.5,42.5,17.8,92.4  c23.6,43.2,45,72.2,79,107.1c32,32.8,46.2,43.4,78,66.4c35.4,25.6,69.4,40.3,93.2,40.3c22.1,0,39.5,0,64.3-29.9  C442.3,370.8,431.5,351.6,415.9,335.5z"/>
                                </svg>
                              </div>

                              <div className="MAIL">
                                <Field className={(mailInfo==="")? "login__error cityArenda":"login cityArenda"}  name = "mail" type="mail" value={mailInfo} onChange={()=>handleMailInfo(event.target,setMailInfo)}  placeholder="Электронная почта"/>
                                <svg className={(mailInfo==="")? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z" fill="#EB5757"/>
                                </svg>
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
                                <Field className={(linkViberInfo==="")? "login__error cityArenda":"login cityArenda"}  name = "linkViber" type="text" value={linkViberInfo} onChange={()=>handleLinkViberInfo(event.target,setLinkViberInfo)}  placeholder="Ваш Viber"/>
                                <svg className={(linkViberInfo==="")? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z" fill="#EB5757"/>
                                </svg>
                                <svg className="userOf" style={{marginTop:"11px",marginLeft:"23px"}} width="20" height="20" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <rect opacity="0.3" className="user" width="36" height="36" rx="18" fill="none"/>
                                    <path d="M17.9024 10.4075C16.6336 10.4247 13.9035 10.633 12.3763 12.0323C11.2426 13.1594 10.8465 14.821 10.8003 16.8788C10.7608 18.9287 10.7146 22.778 14.4255 23.8267V25.4218C14.4255 25.4218 14.4005 26.0611 14.8223 26.1929C15.343 26.3577 15.6396 25.864 16.134 25.3367L17.0567 24.2953C19.5944 24.5062 21.5388 24.0191 21.7629 23.9466C22.277 23.7819 25.1778 23.4121 25.6524 19.5621C26.1401 15.5869 25.4151 13.0823 24.11 11.9486L24.1034 11.9473C23.708 11.5847 22.1261 10.4313 18.5866 10.4181C18.5866 10.4181 18.3256 10.4016 17.9024 10.4075ZM17.9466 11.5261C18.3058 11.5241 18.5266 11.5393 18.5266 11.5393C21.519 11.5458 22.95 12.4489 23.2861 12.752C24.3869 13.6939 24.9524 15.9528 24.5385 19.2721C24.143 22.4887 21.7899 22.693 21.3549 22.8314C21.1703 22.8907 19.4566 23.3126 17.3 23.1741C17.3 23.1741 15.6923 25.1126 15.1914 25.6136C15.1123 25.6993 15.02 25.7256 14.9607 25.7124C14.875 25.6927 14.8487 25.5872 14.8553 25.4422L14.8684 22.7932C11.7237 21.9231 11.9083 18.6394 11.9413 16.9256C11.9808 15.2119 12.3038 13.8067 13.2595 12.8575C14.5494 11.6909 16.8682 11.5327 17.9459 11.5261H17.9466ZM18.1838 13.2398C18.1579 13.2397 18.1322 13.2447 18.1082 13.2546C18.0842 13.2645 18.0624 13.279 18.0441 13.2973C18.0257 13.3156 18.0111 13.3374 18.0012 13.3613C17.9912 13.3853 17.9861 13.4109 17.9861 13.4369C17.9861 13.4893 18.0069 13.5396 18.044 13.5767C18.0811 13.6138 18.1314 13.6346 18.1838 13.6346C18.6739 13.6253 19.1609 13.7131 19.6168 13.8929C20.0727 14.0728 20.4885 14.3412 20.8401 14.6826C21.5586 15.3813 21.9086 16.3173 21.9217 17.5432C21.9217 17.5692 21.9269 17.5949 21.9368 17.6189C21.9467 17.6429 21.9613 17.6647 21.9797 17.6831C21.998 17.7014 22.0198 17.716 22.0438 17.7259C22.0678 17.7359 22.0935 17.741 22.1195 17.741V17.735C22.1719 17.735 22.2222 17.7142 22.2593 17.6771C22.2964 17.64 22.3172 17.5897 22.3172 17.5373C22.3417 16.9608 22.2485 16.3853 22.0434 15.8459C21.8383 15.3065 21.5255 14.8145 21.1242 14.3999C20.3398 13.6353 19.3498 13.2398 18.1832 13.2398H18.1838ZM15.5777 13.6946C15.4375 13.6746 15.2947 13.7025 15.1723 13.7737H15.1644C14.8941 13.9319 14.645 14.1296 14.4077 14.3933C14.2297 14.6042 14.1302 14.8145 14.1039 15.0188C14.0883 15.1386 14.0996 15.2604 14.1368 15.3754L14.15 15.382C14.3531 15.9792 14.6182 16.5536 14.9409 17.0957C15.3592 17.8549 15.8731 18.5573 16.4701 19.1858L16.4899 19.2121L16.5163 19.2319L16.536 19.2517L16.5558 19.2715C17.1867 19.8699 17.891 20.386 18.6518 20.8072C19.5219 21.2818 20.0505 21.5059 20.3669 21.5982V21.6048C20.4591 21.6311 20.5435 21.6443 20.6292 21.6443C20.8993 21.6246 21.155 21.5151 21.3556 21.3332C21.6126 21.1025 21.8169 20.8468 21.9685 20.5765V20.5699C22.1201 20.2865 22.0674 20.0156 21.8499 19.8311C21.4115 19.4476 20.9369 19.1076 20.4328 18.816C20.0966 18.6315 19.7539 18.7435 19.6155 18.9281L19.3189 19.3031C19.1673 19.4877 18.8904 19.4613 18.8904 19.4613L18.8825 19.4679C16.826 18.9406 16.279 16.8584 16.279 16.8584C16.279 16.8584 16.2526 16.575 16.4437 16.43L16.8129 16.1334C16.9908 15.9884 17.1161 15.6456 16.9249 15.3095C16.6337 14.8051 16.2937 14.3304 15.9099 13.8923C15.8264 13.7888 15.7085 13.7186 15.5777 13.6946ZM18.5259 14.2812C18.4735 14.2814 18.4233 14.3024 18.3863 14.3396C18.3493 14.3768 18.3287 14.4272 18.3288 14.4796C18.329 14.5321 18.35 14.5823 18.3872 14.6192C18.4244 14.6562 18.4748 14.6769 18.5272 14.6767C19.1869 14.6881 19.815 14.9607 20.2739 15.4347C20.481 15.6631 20.6401 15.9307 20.742 16.2216C20.8439 16.5126 20.8865 16.821 20.8671 17.1286C20.8673 17.181 20.8882 17.2311 20.9253 17.268C20.9624 17.305 21.0125 17.3257 21.0649 17.3257L21.0715 17.3336C21.0975 17.3336 21.1233 17.3285 21.1473 17.3185C21.1713 17.3085 21.1932 17.2939 21.2115 17.2755C21.2299 17.2571 21.2444 17.2352 21.2543 17.2111C21.2642 17.187 21.2693 17.1613 21.2692 17.1352C21.289 16.3509 21.0451 15.6918 20.5639 15.1644C20.0828 14.6371 19.4105 14.3405 18.5536 14.2812C18.5444 14.2806 18.5351 14.2806 18.5259 14.2812ZM18.8489 15.3483C18.8225 15.3476 18.7961 15.352 18.7714 15.3614C18.7467 15.3708 18.724 15.385 18.7048 15.4031C18.6855 15.4213 18.67 15.443 18.6592 15.4672C18.6484 15.4913 18.6424 15.5173 18.6416 15.5438C18.6408 15.5702 18.6453 15.5966 18.6547 15.6213C18.6641 15.646 18.6782 15.6686 18.6964 15.6879C18.7145 15.7071 18.7363 15.7226 18.7604 15.7335C18.7846 15.7443 18.8106 15.7503 18.837 15.7511C19.4896 15.784 19.8059 16.1136 19.8455 16.7925C19.8472 16.8438 19.8688 16.8924 19.9057 16.9281C19.9426 16.9637 19.9919 16.9837 20.0432 16.9836H20.0498C20.0764 16.9828 20.1025 16.9766 20.1266 16.9655C20.1507 16.9544 20.1724 16.9385 20.1902 16.9188C20.208 16.8991 20.2217 16.876 20.2305 16.8509C20.2392 16.8258 20.2428 16.7992 20.241 16.7727C20.1948 15.8895 19.7137 15.3945 18.8568 15.3483C18.8542 15.3483 18.8515 15.3483 18.8489 15.3483Z" fill="white"/>
                                </svg>
                              </div>

                              <div className="LOGIN">
                                <Field className={(linkWatsInfo==="")? "login__error cityArenda":"login cityArenda"}  name = "linkWats" type="text" value={linkWatsInfo} onChange={()=>handleLinkWhatsInfo(event.target,setLinkWatsInfo)} placeholder="Ваш Watsup"/>
                                <svg className={(linkWatsInfo==="")? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z" fill="#EB5757"/>
                                </svg>
                                <svg className="userOf" style={{marginTop:"11px",marginLeft:"23px"}} width="20" height="20" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <rect opacity="0.3" className="user" width="36" height="36" rx="18"/>
                                    <path d="M23.3797 12.5885C22.6794 11.883 21.8458 11.3237 20.9275 10.9431C20.0092 10.5624 19.0244 10.368 18.0303 10.3711C13.8635 10.3711 10.4721 13.7625 10.4721 17.9322C10.4721 19.2645 10.8212 20.5673 11.4821 21.7118L10.4092 25.6306L14.4176 24.5786C15.5258 25.1823 16.7674 25.499 18.0294 25.4999H18.0322C22.199 25.4999 25.5933 22.1085 25.5933 17.9389C25.5958 16.9451 25.4014 15.9607 25.0213 15.0426C24.6412 14.1244 24.0829 13.2906 23.3788 12.5895L23.3797 12.5885ZM18.0322 24.2239C16.906 24.224 15.8005 23.9213 14.8316 23.3474L14.6017 23.2101L12.2231 23.8328L12.8583 21.5143L12.7095 21.2759C12.078 20.2752 11.7442 19.1155 11.7472 17.9322C11.7493 16.2652 12.4126 14.6671 13.5916 13.4886C14.7706 12.3101 16.369 11.6475 18.036 11.6462C19.7136 11.6462 21.2939 12.3024 22.4794 13.4879C23.0644 14.0708 23.5281 14.7638 23.8437 15.527C24.1593 16.2901 24.3206 17.1083 24.3182 17.9341C24.3153 21.4028 21.4961 24.2229 18.0322 24.2229V24.2239ZM21.478 19.5154C21.2901 19.42 20.3602 18.9641 20.1876 18.9012C20.015 18.8382 19.8891 18.8058 19.7613 18.9965C19.6364 19.1844 19.273 19.6107 19.1624 19.7385C19.0518 19.8635 18.9421 19.8816 18.7542 19.7862C18.5663 19.6908 17.955 19.4915 17.234 18.8478C16.6732 18.3471 16.2927 17.7271 16.182 17.5393C16.0714 17.3514 16.1696 17.2474 16.2659 17.1549C16.3527 17.071 16.4538 16.9346 16.5492 16.824C16.6446 16.7133 16.6741 16.6361 16.7371 16.5083C16.8 16.3834 16.7695 16.2727 16.7218 16.1774C16.6741 16.082 16.2955 15.1521 16.141 14.7735C15.9894 14.4034 15.8311 14.4549 15.7147 14.4483C15.6041 14.4425 15.4791 14.4425 15.3542 14.4425C15.2293 14.4425 15.0233 14.4902 14.8506 14.6781C14.678 14.866 14.1888 15.3247 14.1888 16.2546C14.1888 17.1845 14.8649 18.0819 14.9603 18.2097C15.0557 18.3347 16.2927 20.2449 18.1877 21.0623C18.6378 21.2559 18.9898 21.3722 19.2635 21.4619C19.7165 21.6049 20.1275 21.584 20.4528 21.5363C20.8161 21.4829 21.5705 21.0804 21.7288 20.6388C21.8871 20.1973 21.8871 19.8196 21.8395 19.7414C21.7946 19.6575 21.6697 19.6107 21.479 19.5144L21.478 19.5154Z" fill="white"/>
                                </svg>
                              </div>

                              <div className="LOGIN">
                                <Field className={(linkMailInfo==="")? "login__error cityArenda":"login cityArenda"}  name = "linkMail" type="mail" value={linkMailInfo} onChange={()=>handleLinkMailInfo(event.target,setLinkMailInfo)} placeholder="Ваша рабочая почта"/>
                                <svg className={(linkMailInfo==="")? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z" fill="#EB5757"/>
                                </svg>
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
                            <img className="IconImgAdvertisement"src={imgUrl2?imgUrl2:imageOwnerInfo} alt="" />
                            <button onClick={OwnerImgAdvertisementFromAdvertisement} type="button" className="Voyti choose">Выберите файл</button>
                            <Field id="file-input4" type="file" accept="image/*,.png,.jpg,.gif,.web," value={values.imageOwner} onChange={()=>downLoadImgOwner(event.target,fileReader2,setImgUrl2)} style={{display:"none"}} />
                          </div>
                        </div>
                        <div className={ToggleState===2?"DopInfo":"DopInfoNone"}>
                          <div className="MainOptions" style={{marginBottom:"20px"}}>
                            {/* Первое деление */}
                            <div className="DivisionOptions">
                              <p className="titleOptions">Спальные места</p>
                              <div className="dropdown">
                                <button className="List" id="FiltersleepPlacesDopAdverts" type="button" onClick={defaultClickDropDown}>{sleepPlaces?sleepPlaces:"Выберите"}</button>
                                <ul className="List__dropdown">
                                  <li className="dropdown__item">1 место</li>
                                  <li className="dropdown__item">2 места</li>
                                  <li className="dropdown__item">3 места</li>
                                  <li className="dropdown__item">4 места</li>
                                </ul>
                                <Field type="text" name="select__category" className="drodown__item__hiden" />
                              </div>
                              <input type="text" id="checkboxInputValue_moduleChange" defaultValue={dopNames} className="drodown__item__hiden checkboxInputValue_moduleChange" />
                              <div className="checkbox" style={{display:"flex",marginBottom:"10px",marginTop:"30px"}}>
                                <input type="checkbox" value={"Газоваяплита"} defaultValue={"Газоваяплита"} id="checkbox_moduleChange1" onChange={() => ClickCheckbox(1)} className="checkBoxOptions3"/> 
                                <label htmlFor="checkbox_moduleChange1" className="textCheckboxOptions">Газовая плита</label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Духовка"} id="checkbox_moduleChange2" onChange={() => ClickCheckbox(2)} className="checkBoxOptions3"/> 
                                <label htmlFor="checkbox_moduleChange2" className="textCheckboxOptions">Духовка</label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Кофеварка"} id="checkbox_moduleChange3" onChange={() => ClickCheckbox(3)} className="  checkBoxOptions3"/> 
                                <label htmlFor="checkbox_moduleChange3" className="textCheckboxOptions">Кофеварка</label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Микроволноваяпечь"} id="checkbox_moduleChange4" onChange={() => ClickCheckbox(4)} className="  checkBoxOptions3"/> 
                                <label htmlFor="checkbox_moduleChange4" className="textCheckboxOptions">Микроволновая печь </label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Посуда"} id="checkbox_moduleChange5" onChange={() => ClickCheckbox(5)} className="  checkBoxOptions3"/> 
                                <label htmlFor="checkbox_moduleChange5" className="textCheckboxOptions">Посуда </label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Посудомоечнаямашина"} id="checkbox_moduleChange6" onChange={() => ClickCheckbox(6)} className="  checkBoxOptions3"/> 
                                <label htmlFor="checkbox_moduleChange6" className="textCheckboxOptions">Посудомоечная машина </label>
                              </div>
                            </div>
                          {/* Второе деление */}
                            <div className="DivisionOptions">
                              <p className="titleOptions"style={{visibility:"hidden"}}>Район</p>
                              <div className="dropdown">
                                <button style={{visibility:"hidden"}} className="List" type="button">{}</button>
                                <input type="text" name="select__category" value="" className="drodown__item__hiden" />
                              </div>
                              <div className="checkbox" style={{display:"flex",marginBottom:"10px",marginTop:"30px"}}>
                                <input type="checkbox" value={"Газоваяплита"} id="checkbox_moduleChange7" onChange={() => ClickCheckbox(7)} className="  checkBoxOptions3"/> 
                                <label htmlFor="checkbox_moduleChange7" className="textCheckboxOptions">Газовая плита</label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Духовка"} id="checkbox_moduleChange8" onChange={() => ClickCheckbox(8)} className="  checkBoxOptions3"/> 
                                <label htmlFor="checkbox_moduleChange8" className="textCheckboxOptions">Духовка</label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Кофеварка"} id="checkbox_moduleChange9" onChange={() => ClickCheckbox(9)} className="  checkBoxOptions3"/> 
                                <label htmlFor="checkbox_moduleChange9" className="textCheckboxOptions">Кофеварка</label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Микроволноваяпечь"} id="checkbox_moduleChange10" onChange={() => ClickCheckbox(10)} className=" checkBoxOptions3"/> 
                                <label htmlFor="checkbox_moduleChange10" className="textCheckboxOptions">Микроволновая печь </label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Посуда"} id="checkbox_moduleChange11" onChange={() => ClickCheckbox(11)} className="checkBoxOptions3"/> 
                                <label htmlFor="checkbox_moduleChange11" className="textCheckboxOptions">Посуда </label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Посудомоечнаямашина"} id="checkbox_moduleChange12" onChange={() => ClickCheckbox(12)} className="  checkBoxOptions3"/> 
                                <label htmlFor="checkbox_moduleChange12" className="textCheckboxOptions">Посудомоечная машина </label>
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
                                <input type="checkbox" value={"Газоваяплита"} id="checkbox_moduleChange13" onChange={() => ClickCheckbox(13)} className="  checkBoxOptions3"/> 
                                <label htmlFor="checkbox_moduleChange13" className="textCheckboxOptions">Газовая плита</label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Духовка"} id="checkbox_moduleChange14" onChange={() => ClickCheckbox(14)} className="  checkBoxOptions3"/> 
                                <label htmlFor="checkbox_moduleChange14" className="textCheckboxOptions">Духовка</label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Кофеварка"} id="checkbox_moduleChange15" onChange={() => ClickCheckbox(15)} className="  checkBoxOptions3"/> 
                                <label htmlFor="checkbox_moduleChange15" className="textCheckboxOptions">Кофеварка</label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Микроволноваяпечь"} id="checkbox_moduleChange16" onChange={() => ClickCheckbox(16)} className="  checkBoxOptions3"/> 
                                <label htmlFor="checkbox_moduleChange16" className="textCheckboxOptions">Микроволновая печь </label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Посуда"} id="checkbox_moduleChange17" onChange={() => ClickCheckbox(17)} className="  checkBoxOptions3"/> 
                                <label htmlFor="checkbox_moduleChange17" className="textCheckboxOptions">Посуда </label>
                              </div>
                              <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                <input type="checkbox" value={"Посудомоечнаямашина"} id="checkbox_moduleChange18" onChange={() => ClickCheckbox(18)} className="  checkBoxOptions3"/> 
                                <label htmlFor="checkbox_moduleChange18" className="textCheckboxOptions">Посудомоечная машина </label>
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
                                  <input type="checkbox" value={"Газоваяплита"} id="checkbox_moduleChange19" onChange={() => ClickCheckbox(19)} className="  checkBoxOptions3"/> 
                                  <label htmlFor="checkbox_moduleChange19" className="textCheckboxOptions">Газовая плита</label>
                                </div>
                                <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                  <input type="checkbox" value={"Духовка"} id="checkbox_moduleChange20" onChange={() => ClickCheckbox(20)} className="  checkBoxOptions3"/> 
                                  <label htmlFor="checkbox_moduleChange20" className="textCheckboxOptions">Духовка</label>
                                </div>
                                <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                  <input type="checkbox" value={"Кофеварка"} id="checkbox_moduleChange21" onChange={() => ClickCheckbox(21)} className="  checkBoxOptions3"/> 
                                  <label htmlFor="checkbox_moduleChange21" className="textCheckboxOptions">Кофеварка</label>
                                </div>
                                <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                  <input type="checkbox" value={"Микроволноваяпечь"} id="checkbox_moduleChange22" onChange={() => ClickCheckbox(22)} className="  checkBoxOptions3"/> 
                                  <label htmlFor="checkbox_moduleChange22" className="textCheckboxOptions">Микроволновая печь </label>
                                </div>
                                <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                  <input type="checkbox" value={"Посуда"} id="checkbox_moduleChange23" onChange={() => ClickCheckbox(23)} className="  checkBoxOptions3"/> 
                                  <label htmlFor="checkbox_moduleChange23" className="textCheckboxOptions">Посуда </label>
                                </div>
                                <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                  <input type="checkbox" value={"Посудомоечнаямашина"} id="checkbox_moduleChange24" onChange={() => ClickCheckbox(24)} className="  checkBoxOptions3"/> 
                                  <label htmlFor="checkbox_moduleChange24" className="textCheckboxOptions">Посудомоечная машина </label>
                                </div>
                            </div>
                          {/* Пятое деление */}
                            <div className="DivisionOptions">
                              <div className="dropdown" style={{visibility: "hidden"}}>
                                <p className="titleOptions" >Метро</p>
                                <button className="List" id = "FilterMetro" type="button" onClick={defaultClickDropDown}>Выберите</button>
                                <ul className="List__dropdown">
                                  <li className="dropdown__item">Грушевка</li>
                                </ul>
                                <input type="text" name="select__category"  className="drodown__item__hiden" />
                              </div>
                              <div className="checkbox" style={{display:"flex",marginBottom:"10px",marginTop:"30px"}}>
                                  <input type="checkbox" value={"Газоваяплита"} id="checkbox_moduleChange25" onChange={() => ClickCheckbox(25)} className="  checkBoxOptions3"/> 
                                  <label htmlFor="checkbox_moduleChange25" className="textCheckboxOptions">Газовая плита</label>
                                </div>
                                <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                  <input type="checkbox" value={"Духовка"} id="checkbox_moduleChange26" onChange={() => ClickCheckbox(26)} className="  checkBoxOptions3"/> 
                                  <label htmlFor="checkbox_moduleChange26" className="textCheckboxOptions">Духовка</label>
                                </div>
                                <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                  <input type="checkbox" value={"Кофеварка"} id="checkbox_moduleChange27" onChange={() => ClickCheckbox(27)} className="  checkBoxOptions3"/> 
                                  <label htmlFor="checkbox_moduleChange27" className="textCheckboxOptions">Кофеварка</label>
                                </div>
                                <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                  <input type="checkbox" value={"Микроволноваяпечь"} id="checkbox_moduleChange28" onChange={() => ClickCheckbox(28)} className="  checkBoxOptions3"/> 
                                  <label htmlFor="checkbox_moduleChange28" className="textCheckboxOptions">Микроволновая печь </label>
                                </div>
                                <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                  <input type="checkbox" value={"Посуда"} id="checkbox_moduleChange29" onChange={() => ClickCheckbox(29)} className="  checkBoxOptions3"/> 
                                  <label htmlFor="checkbox_moduleChange29" className="textCheckboxOptions">Посуда </label>
                                </div>
                                <div className="" style={{display:"flex",marginBottom:"10px"}}>
                                  <input type="checkbox" value={"Посудомоечнаямашина"} id="checkbox_moduleChange30" onChange={() => ClickCheckbox(30)} className="  checkBoxOptions3"/> 
                                  <label htmlFor="checkbox_moduleChange30" className="textCheckboxOptions">Посудомоечная машина </label>
                                </div>
                            </div>
                          </div>
                        </div>
                        <div className={ToggleState===3?"DopInfo":"DopInfoNone"}>
                          <div className="Message">
                            <p className="Contacts__text">Описание объявления</p>
                              <textarea name="textArea" className={(descriptionInfo=="")?"TextAreaMes__error":"TextAreaMes"} onChange={()=>handleDescriptionInfo(event.target,setdescriptionInfo)} value={descriptionInfo} placeholder="Описание" cols={30} rows={10}></textarea>
                          </div>
                        </div>
                        <div className="" style={{display:"flex",justifyContent:"center"}}>
                            <div style={{width:"fit-content",padding:"9px 16px"}} className={("ErrorEnter" && ((cityInfo=="" || totalInfo=="" || roomsInfo=="" || linkViberInfo=="" || linkWatsInfo=="" || linkMailInfo=="" || mailInfo=="" || metroInfo=="" || nameInfo=="" || numberInfo=="" || squareInfo=="" || rayonInfo=="" || sentInfo=="" )))? "ErrorEnter fix":"ErrorEnter"}>
                              <p className="ErrorEnterText">Не все поля заполнены</p>
                              <div className="">
                              <svg style={{marginLeft:"15px",paddingTop:"5px"}} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 0C4.5 0 0 4.5 0 10C0 15.5 4.5 20 10 20C15.5 20 20 15.5 20 10C20 4.5 15.5 0 10 0ZM10 2C11.1 2 11.9 2.9 11.8 4L11 12H9L8.2 4C8.1 2.9 8.9 2 10 2ZM10 18C8.9 18 8 17.1 8 16C8 14.9 8.9 14 10 14C11.1 14 12 14.9 12 16C12 17.1 11.1 18 10 18Z" fill="white" fillOpacity="0.5"/>
                              </svg>
                            </div>
                            </div>
                        </div>
                        <div className="" style={{display:"flex",justifyContent:"center"}}>
                          <button className="Voyti choose" disabled={(cityInfo=="" || totalInfo=="" || roomsInfo=="" || linkViberInfo=="" || linkWatsInfo=="" || linkMailInfo=="" || mailInfo=="" || metroInfo=="" || nameInfo=="" || numberInfo=="" || squareInfo=="" || rayonInfo=="" || sentInfo=="" || descriptionInfo=="")?isValid:!isValid} type="submit" onClick={()=>{handleSubmit}}>Внести изменения</button>
                        </div>
                      </Form>
                        )}
                    </Formik>
                    :""}
                </div>
              </div>
             </section>
          </>
          
        }   
      </Modal>
      <ToastContainer/>
    </>
  );
}
