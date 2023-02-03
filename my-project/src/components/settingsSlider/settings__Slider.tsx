import React from "react";

export const settingsHomePage = {
  infinite: true,
  swipe:false,
  speed: 2500,
  arrows:false,
  slidesToShow: 3,
  slidesToScroll: 3,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1325,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        dots: false
      }
    },
    {
      breakpoint: 1151,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      }
    },
    {
      breakpoint: 785,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
}

export const settingsSelectPage = {
  Infinity:true,
  autoplaySpeed:0,
  swipe:true,
  speed: 2500,
  arrows:false,
  slidesToShow: 3,
  slidesToScroll: 3,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1325,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        infinite: true,
        dots: false
      }
    },
    {
      breakpoint: 1151,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2
      }
    },
    {
      breakpoint: 785,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
}

  export const settingsNewsSelectPage = {
    infinite: true,
    swipe:true,
    speed: 2500,
    arrows:false,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1325,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 1151,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 785,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  }