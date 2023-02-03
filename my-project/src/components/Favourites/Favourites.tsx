import React, { useState, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import "./Favourites.css";
import { Link,useNavigate } from "react-router-dom";
import { Card,Button,Col,Row } from "react-bootstrap";
import axios from "../../axios";


import btnclick from "../Functions/clickbtnContacts";
import ReactPaginate from "react-paginate";
import CardSkeleton from "../Skeletons/arendaCardSkeleton";
import { ArendaCardProduct } from "../../interfaces";
import { useDispatch, useSelector } from "react-redux";
import { decrement, setLengthFavourites, setValue, setValueFromFavourites } from "../../store/actions/favouritesAction";
import { setCity, setRooms } from "../../store/slices/FilterSlice";
import { notifyDeleteFavourites } from "../Toasts/ToastsContent";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import { clickHeartDeleteFromFavourites } from "../Functions/HeartChangesActions";


export default function Favourites() {
  const navigate=useNavigate();
  const login = localStorage.getItem("login");
  const [favouritesChange, setFavouritesChange] = useState<ArendaCardProduct[]>([]);
  const id = localStorage.getItem("id");
  const [currentPage,setCurrentPage] = useState<ArendaCardProduct[]>([]);
  const [CatalogPerPage,setCatalogPerPage]= useState<number>(6)
  const [itemOffset,setItemOffset] = useState<number>(0)
  const [pageCount,setCountPage]= useState<number>(0)
  const lengthFavourites = useSelector((state:any) => state.favouritesAction.length);
  const valueFromFavourites = useSelector((state:any) => state.favouritesAction.valueFromFavourites);
  const dispatch = useDispatch();
  const [Loading,setLoading]=useState<boolean>(true);

  useEffect(()=>{
    dispatch(setValue(null));
    dispatch(setCity("Минск"));
    dispatch(setRooms("Квартиры на сутки"));
  },[]);

  const handlepageclick = (e) =>{
    const newOffset = (e.selected*CatalogPerPage)%favouritesChange.length;
    setItemOffset(newOffset);
    window.scrollTo({top:100,behavior:"smooth"});
  }

  const push = (item,item2) =>{
    navigate(`/catalog/city=${item2}/${item}`)
  }

  useEffect(() => {
    if(login){
      axios.get(`/users?login=${login}`).then((data) => {
        for (let i = 0; i < data.data[0].favourites.length; i++) {
          if(data.data[0].favourites[i].id==valueFromFavourites){
            dispatch(setValueFromFavourites(null));
            data.data[0].favourites.splice(i,1);
            axios.patch(`/users/${id}`,{"favourites":data.data[0].favourites});
            notifyDeleteFavourites();
          }
        }
        setFavouritesChange(data.data[0].favourites);
        setLoading(false)
        dispatch(setLengthFavourites(lengthFavourites));
      });
    }
  },[login,valueFromFavourites]);

  useEffect(()=>{
    const endoffset=itemOffset+CatalogPerPage;
    setCurrentPage(favouritesChange.slice(itemOffset,endoffset));
    setCountPage(Math.ceil(favouritesChange.length/CatalogPerPage));
  },[itemOffset,CatalogPerPage,favouritesChange,lengthFavourites])

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
                <Link to="/favourites" style={{ textDecoration: "none" }}>
                  <div className="catalogLink">
                    <p className="LinkText">Закладки</p>
                  </div>
                </Link>
              </nav>
            </div>

            <div className="allCatalog">
              <div className="textFilterInfo">
                <div className="ArendaInnerText">
                  <h1 className="ArendaInnerTextH1">Ваши закладки</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="SecondFavourites"  style={{marginTop:"50px"}}>
        <div className="CardsFavourites">
          <div className="conteiner">
            <div className="FavouritesMain" style={lengthFavourites==0?{justifyContent:"center"}:{justifyContent:"space-between"}}>
              {login?
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
              </div>:(
                (favouritesChange.length>0)?(
                currentPage.map((item) => {
                  return (
                    <Col className="mainCatalogCard" key={item.id}>
                      <Card className="card__style" style={{width:"406px",height:"535px"}}>
                        <div className="ListInformContacts">  
                          <div className="CardMain">
                            <div className="Gold">
                              <svg width="66" height="38" viewBox="0 0 66 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M0 0.980469H56C61.5229 0.980469 66 5.45762 66 10.9805V27.9805C66 33.5033 61.5228 37.9805 56 37.9805H10C4.47715 37.9805 0 33.5033 0 27.9805L0 0.980469Z" fill="url(#paint0_linear_2831_1891)"/>
                              <g filter="url(#filter0_d_2831_1891)">
                              <path d="M21.8182 17.6211H24.6307C24.2727 15.0323 21.9908 13.2106 19.0312 13.2106C15.5732 13.2106 12.9077 15.7035 12.9077 19.9478C12.9077 24.0898 15.4006 26.6594 19.0888 26.6594C22.3935 26.6594 24.7521 24.5692 24.7521 21.1239V19.4748H19.2741V21.5586H22.0866C22.0483 23.1822 20.9425 24.2113 19.1016 24.2113C17.0241 24.2113 15.7138 22.658 15.7138 19.9222C15.7138 17.1992 17.0753 15.6587 19.076 15.6587C20.5014 15.6587 21.4666 16.3938 21.8182 17.6211ZM31.2161 26.6722C34.1948 26.6722 36.0485 24.6332 36.0485 21.6097C36.0485 18.5671 34.1948 16.5344 31.2161 16.5344C28.2374 16.5344 26.3837 18.5671 26.3837 21.6097C26.3837 24.6332 28.2374 26.6722 31.2161 26.6722ZM31.2289 24.5629C29.8546 24.5629 29.1515 23.3036 29.1515 21.5906C29.1515 19.8775 29.8546 18.6119 31.2289 18.6119C32.5776 18.6119 33.2807 19.8775 33.2807 21.5906C33.2807 23.3036 32.5776 24.5629 31.2289 24.5629ZM40.5421 13.3896H37.8191V26.4805H40.5421V13.3896ZM46.3413 26.6403C47.9265 26.6403 48.7511 25.7262 49.1282 24.908H49.2433V26.4805H51.9279V13.3896H49.2113V18.3114H49.1282C48.7638 17.5124 47.9776 16.5344 46.3349 16.5344C44.1808 16.5344 42.359 18.2092 42.359 21.5842C42.359 24.8697 44.104 26.6403 46.3413 26.6403ZM47.2042 24.4734C45.8683 24.4734 45.1396 23.2844 45.1396 21.5714C45.1396 19.8711 45.8555 18.7013 47.2042 18.7013C48.5273 18.7013 49.2688 19.82 49.2688 21.5714C49.2688 23.3228 48.5146 24.4734 47.2042 24.4734Z" fill="white"/>
                              </g>
                              <defs>
                              <filter id="filter0_d_2831_1891" x="12.9072" y="13.2109" width="39.0205" height="14.4609" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                              <feOffset dy="1"/>
                              <feColorMatrix type="matrix" values="0 0 0 0 0.575 0 0 0 0 0.3105 0 0 0 0 0 0 0 0 0.3 0"/>
                              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2831_1891"/>
                              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2831_1891" result="shape"/>
                              </filter>
                              <linearGradient id="paint0_linear_2831_1891" x1="-6.06526e-07" y1="2.83047" x2="65.138" y2="36.2767" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#FFD54F"/>
                              <stop offset="1" stopColor="#FEC100"/>
                              </linearGradient>
                              </defs>
                              </svg>
                            </div>
                            <Swiper pagination={{clickable:true}} navigation={{enabled:true}} modules={[Pagination,Navigation]} className="imgCard">
                              {
                                item.url.map((itemImg)=>(
                                  <SwiperSlide>
                                      <Card.Img variant="top" src={itemImg} style={{ height: "300px",width: "444px"}}/>
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
                                  <div className="totalPeople square">{item.square}<sup style={{lineHeight:"5px"}}><small>2</small></sup></div>
                                </div>
                                <div className="secondtitle">
                                  <div className="adresall">
                                    <div className="icocnadress">
                                      <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M11.462 3.15505C10.3632 1.42457 8.54923 0.451172 6.50853 0.451172C4.48528 0.451172 2.67132 1.42457 1.5376 3.15505C0.403882 4.84949 0.142254 7.01259 0.839929 8.90531C1.03179 9.41003 1.3283 9.93278 1.71202 10.4015L6.12481 15.7732C6.22946 15.8813 6.33412 15.9534 6.49109 15.9534C6.64807 15.9534 6.75272 15.8813 6.85737 15.7732L11.2876 10.4015C11.6713 9.93278 11.9853 9.42806 12.1597 8.90531C12.8574 7.01259 12.5957 4.84949 11.462 3.15505ZM6.50853 9.53622C5.00853 9.53622 3.77016 8.25638 3.77016 6.70615C3.77016 5.15593 5.00853 3.87609 6.50853 3.87609C8.00853 3.87609 9.24691 5.15593 9.24691 6.70615C9.24691 8.25638 8.02598 9.53622 6.50853 9.53622Z" fill="#BDBDBD"/>
                                      </svg>
                                    </div>
                                    <div className="aress">{item.adress}</div>
                                  </div>
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
                                <div className="btnContactsMain">
                                <div className="heart" id={`heart-${item.id}`} onClick={()=>clickHeartDeleteFromFavourites(item.id,lengthFavourites,dispatch)}>
                                  <svg className="heart__svg active" id={`heart__svg-${item.id}`} xmlns="http://www.w3.org/2000/svg" height="13px" viewBox="0 0 24 24" fill="none" width="15px">
                                    <path d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#EB5757"/>
                                  </svg>
                                </div>
                                  <div className="dropdownContacts">
                                    <button className="ContactsBtn ContactsBtn2" id={`${item.id}`} onClick={()=>btnclick(item.id)}>
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
                                    <p className="textMore" onClick={(e)=>push(item.id,item.city2)}>Подробнее</p>
                                </div>
                                </Button>
                              </div>
                            </Card.Body>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  );
                })):(<div className="Soobshenie">
                <h1>Здесь пусто</h1>
                <Link to={`/catalog/city=`}>
                  <svg
                    className="iconSoobshenie"
                    xmlns="http://www.w3.org/2000/svg"
                    height="80px"
                    viewBox="0 0 24 24"
                    fill="none"
                    width="80px"
                    onClick={()=>dispatch(setRooms(""))}
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      stroke="none"
                    />
                  </svg>
                </Link>
              </div>))
               : (
                <div className="Soobshenie">
                  <h1>Необходимо <Link to="/signIn">авторизоваться</Link></h1>
                  <Link to={`/catalog/city=`}>
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
                  </Link>
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
    </>
  );
}
