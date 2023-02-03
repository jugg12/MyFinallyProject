import React, {useState,useEffect,useRef} from "react"
import "./NewsRoom.css"
import axios from "../../../axios"
import { Card,Button,Col } from "react-bootstrap"
import {useNavigate} from "react-router-dom"
import Slider from "react-slick"
import { NewsItem } from "../../../interfaces"
import { settingsNewsSelectPage } from "../../settingsSlider/settings__Slider"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import CardSkeleton from "../../Skeletons/newsItemsSkeleton"

const NewsRoom=(link)=>{

  const sliderRef = useRef<any>(null);
  const navigate=useNavigate();
  const [Loading,setLoading] = useState<boolean>(true);
    
  const push = (item) =>{
    navigate(`/news/${item}`)
    window.scrollTo({top:0,behavior:"smooth"})
  }  
  
  const [news,setNews]=useState<NewsItem[]>([]);
  useEffect(()=>{
    axios.get(link.children).then(({data})=>{
      setNews(data);
      setLoading(false);
    })
  },[])
    
  return(
    Loading?
    <>
      <div className="" style={{display:"flex",width:"1308px"}}>
        <CardSkeleton style={{marginRight:"50px"}}/>
        <CardSkeleton style={{marginRight:"50px"}}/>
        <CardSkeleton/>
      </div>
    </>
    :<div className="slider-wrapper conteiner">
    <Slider {...settingsNewsSelectPage} ref={sliderRef} className="Slider">
      {
        news.map((item)=>(
        <Col key={item.id} style={{marginBottom:"25px",width:"33.33333%"}}>
        <Card className="card__style" style={{width:"406px",height:"500px"}}>
          <div className="SpisokInformKontakti">   
            <div className="CardMain">
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
                  <div className="InnerText">{item.title}</div>
                </Card.Title>
                <Card.Text className="card__text card__text2">
                  {item.secondTitle}
                </Card.Text>  
                <div className="btnContactsMain">

                  <div className="totalPeople DataNews">
                    {item.data}
                  </div>

                  <Button variant="primary" className="ReadButton">
                  <div className="More">
                      <p className="textMore ReadBtn" onClick={(e)=>{push(item.id)}}>Читать</p>
                  </div>
                  </Button>
                </div>
              </Card.Body>
            </div>
          </div>
        </Card>
      </Col>
    
    ))
      }
    </Slider>
    </div>
  )
  
}

export default NewsRoom