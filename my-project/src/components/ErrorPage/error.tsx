import "./error.css";
import React from "react";
import {Link} from "react-router-dom";


import img7 from "../../img/footer/8.svg"
import img8 from "../../img/footer/9.svg"

export default function error(){
  return(
    <>
    <header className="oshhead">
      
      </header>
        <div className="Forma formaoshibki">
          <div className="conteiner">
            <img className="tochki" src={img7} alt="" />
              <div className="DivisionOshibki">
                <div className="pervoeDivision">
                  <h1 className="Text">Ошибка 404</h1>
                  <p className="SecondText">Возможно, у вас опечатка в адресе страницы, или её просто не существует</p>
                  <Link to="/">
                    <button className="Voyti back">
                      <svg className="Home" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_2831_1150)">
                      <path d="M11.7985 5.36427L6.41446 0.458394C6.17814 0.243027 5.82177 0.243051 5.58554 0.458371L0.201516 5.3643C0.0122119 5.5368 -0.0503192 5.80258 0.042165 6.04138C0.134673 6.28019 0.359907 6.43448 0.616008 6.43448H1.47593V11.3498C1.47593 11.5447 1.63394 11.7027 1.82883 11.7027H4.77993C4.97481 11.7027 5.13283 11.5447 5.13283 11.3498V8.36537H6.86724V11.3498C6.86724 11.5447 7.02526 11.7027 7.22014 11.7027H10.1711C10.366 11.7027 10.524 11.5447 10.524 11.3498V6.43448H11.3841C11.6402 6.43448 11.8654 6.28016 11.9579 6.04138C12.0503 5.80256 11.9878 5.5368 11.7985 5.36427Z" fill="#1E2123"/>
                      <path d="M10.4319 1.00195H8.06189L10.7848 3.47779V1.35483C10.7848 1.15995 10.6268 1.00195 10.4319 1.00195Z" fill="#1E2123"/>
                      </g>
                      <defs>
                      <clipPath id="clip0_2831_1150">
                      <rect width="12" height="12" fill="white"/>
                      </clipPath>
                      </defs>
                      </svg>
                      Вернуться на главную
                    </button>
                  </Link>
                  <Link to="/">
                    <button className="Voyti back2" title="Вернуться на главную">
                      <svg className="Home" width="30" height="30" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_2831_1150)">
                      <path d="M11.7985 5.36427L6.41446 0.458394C6.17814 0.243027 5.82177 0.243051 5.58554 0.458371L0.201516 5.3643C0.0122119 5.5368 -0.0503192 5.80258 0.042165 6.04138C0.134673 6.28019 0.359907 6.43448 0.616008 6.43448H1.47593V11.3498C1.47593 11.5447 1.63394 11.7027 1.82883 11.7027H4.77993C4.97481 11.7027 5.13283 11.5447 5.13283 11.3498V8.36537H6.86724V11.3498C6.86724 11.5447 7.02526 11.7027 7.22014 11.7027H10.1711C10.366 11.7027 10.524 11.5447 10.524 11.3498V6.43448H11.3841C11.6402 6.43448 11.8654 6.28016 11.9579 6.04138C12.0503 5.80256 11.9878 5.5368 11.7985 5.36427Z" fill="#1E2123"/>
                      <path d="M10.4319 1.00195H8.06189L10.7848 3.47779V1.35483C10.7848 1.15995 10.6268 1.00195 10.4319 1.00195Z" fill="#1E2123"/>
                      </g>
                      <defs>
                      <clipPath id="clip0_2831_1150">
                      <rect width="12" height="12" fill="white"/>
                      </clipPath>
                      </defs>
                      </svg>
                    </button>
                  </Link>
                </div>
                <div className="SecondDivision">
                  <div className="block404">
                    <svg className="Img404" width="613" height="273" viewBox="0 0 613 273" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.3" filter="url(#filter0_d_2831_1146)">
                    <path d="M30 201.328H128.868V237.481H170.507V201.328H196.053V166.481H170.507V31.8119H115.994L30 167.083V201.328ZM129.672 166.481H73.8518V164.874L128.063 79.2122H129.672V166.481Z" fill="white"/>
                    <path d="M305.834 242C357.631 242 388.911 202.634 389.011 134.847C389.112 67.5629 357.43 29 305.834 29C254.137 29 222.757 67.4625 222.656 134.847C222.455 202.433 253.936 241.9 305.834 242ZM305.834 205.948C282.198 205.948 266.91 182.248 267.011 134.847C267.111 88.1499 282.299 64.6507 305.834 64.6507C329.268 64.6507 344.556 88.1499 344.556 134.847C344.657 182.248 329.369 205.948 305.834 205.948Z" fill="white"/>
                    <path d="M416.947 201.328H515.814V237.481H557.453V201.328H583V166.481H557.453V31.8119H502.94L416.947 167.083V201.328ZM516.619 166.481H460.798V164.874L515.01 79.2122H516.619V166.481Z" fill="white"/>
                    </g>
                    <defs>
                    <filter id="filter0_d_2831_1146" x="0" y="0" width="613" height="273" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="1"/>
                    <feGaussianBlur stdDeviation="15"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2831_1146"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2831_1146" result="shape"/>
                    </filter>
                    </defs>
                    </svg>
                  </div>
                  <div className="tochkiblock">
                    <img className="tochki2"src={img8} alt="" />
                  </div>
                  
                </div>
              </div>
              
          </div>
        </div>
        
    </>
  )
}