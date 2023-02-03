import React,{useEffect,useState} from "react";
import "./signUp.css";
import {Link,useNavigate} from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha"
import axios from "../../../axios"
import {Formik,Form,Field} from "formik"
import { validationSchemaSignUp } from "../../../ValidationSchema";

const signUp = () =>{
  const navigate = useNavigate();
  const login = localStorage.getItem('login');
  useEffect(()=>{
    if(login){
      navigate("/")
    }
    else if(document.querySelector(".head") && !login){
      document.querySelector(".head").classList.add("headerHide");
      document.querySelector("header").classList.add("headerHide");
      document.querySelector("footer").classList.add("headerHide");
    }
  },[])
  const [Login,setLogin]=useState<boolean>(true);
  const [Email,setemail]=useState<boolean>(true);
  const [capcha,setcapcha]=useState<boolean>(false);
// validation
  function validateLogin(value){
      const btn = document.querySelector(".Registrationbtn")
      axios.get(`/users?login=${value}`).then((res)=>{
      if(res.data.length==0){
        setLogin(true)
      }
      else if (res.data.length!==0){
        setLogin(false) 
      }
    }) 
  }

  async function validateMail(value){
    axios.get(`/users?email=${value}`).then((res)=>{
      if((res.data.length==0)){
        return setemail(true)
      }
      else{
        return setemail(false) 
      }
    }) 
  }


// end validation

  function onChange(value) {
    setcapcha(true)
  }

    async function signUp(value){
    axios.post("/users ",{
    "login": value.login,
    "email": value.email,
    "password": value.password,
    "url":"https://mypremo.com/placeholder-profile.jpeg",
    "favourites":[],
    "advertisement":[]
  }).then(()=>{
    navigate("/send")
  })  
}

return(
  <div className="Forma">
    <Formik 
      initialValues={{
        login:"",
        password:"",
        email:"",
        password2:"",
        }} 
      validateOnBlur
      validationSchema={validationSchemaSignUp}
      onSubmit={signUp}>
      {({values,errors,touched,handleChange,handleBlur,setFieldValue,isValid,handleSubmit,dirty})=>(
        <Form className="Regforma" >
          <div className="Division">
            <div className="Osnovnoe">
              <h1 className="Authorization">Регистрация</h1>
                <div className="LogPass">
                  <div className="LOGIN">
                  <Field className={((touched.login && errors.login)||(values.login==="")||(Login==false))? "login__error":"login"} onChange={handleChange} onBlur={handleBlur} validate={validateLogin} value={values.login} name = "login" type="text" placeholder="Логин" />
                  <div className="" style={{position:"relative"}}>
                    <svg className={((touched.login && errors.login)||(values.login==="")||(Login==false))? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                  <div className="MAIL">
                    <Field className={((touched.email && errors.email)||(values.email==="")||(errors.email)||(Email==false))? "login__error":"login"} onChange={handleChange} onBlur={handleBlur} validate={validateMail} value={values.email} name = "email" type="mail" placeholder="Электронная почта" />
                    <div className="" style={{position:"relative"}}>
                      <svg className={((touched.email && errors.email)||(values.email==="")||(errors.email)||(Email==false))? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z" fill="#EB5757"/>
                      </svg>
                    </div>
                      <svg className="MessOf"width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                  <div className="PASSWORD" style={{marginBottom:"20px"}}>
                    <Field className={((touched.password && errors.password)||(values.password==="")||(values.password.length<6))?"password__error":"password"} onChange={handleChange} onBlur={handleBlur} name = "password" value={values.password} type="password" placeholder="Пароль" />
                    <div className="" style={{position:"relative"}}> 
                      <svg className={((touched.password && errors.password)||(values.password==="")||(values.password.length<6))? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z" fill="#EB5757"/>
                      </svg>
                    </div>
                      <svg className="LockOf" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g className="Lock" opacity="0.3" clipPath="url(#clip0_2831_1557)">
                        <path className="Lock" d="M15.625 7.5H15V5C15 2.2425 12.7575 0 10 0C7.2425 0 5 2.2425 5 5V7.5H4.375C3.34167 7.5 2.5 8.34083 2.5 9.375V18.125C2.5 19.1592 3.34167 20 4.375 20H15.625C16.6583 20 17.5 19.1592 17.5 18.125V9.375C17.5 8.34083 16.6583 7.5 15.625 7.5ZM6.66667 5C6.66667 3.16167 8.16167 1.66667 10 1.66667C11.8383 1.66667 13.3333 3.16167 13.3333 5V7.5H6.66667V5ZM10.8333 13.935V15.8333C10.8333 16.2933 10.4608 16.6667 10 16.6667C9.53917 16.6667 9.16667 16.2933 9.16667 15.8333V13.935C8.67083 13.6458 8.33333 13.1142 8.33333 12.5C8.33333 11.5808 9.08083 10.8333 10 10.8333C10.9192 10.8333 11.6667 11.5808 11.6667 12.5C11.6667 13.1142 11.3292 13.6458 10.8333 13.935Z" fill="#686868"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_2831_1557">
                        <rect width="20" height="20" fill="white"/>
                        </clipPath>
                        </defs>
                      </svg>
                  </div>

                  <div className="PASSWORD2">
                    <Field className={((touched.password2 && errors.password2)||(values.password2===""))?"password__error":"password"} onChange={handleChange} onBlur={handleBlur} value={values.password2} name = "password2" type="password" placeholder="Повторите пароль" />
                    <div className="" style={{position:"relative"}}>
                      <svg className={((touched.password2 && errors.password2)||(values.password2===""))? "icon__error":"iconHidden"}  width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5 0C5 0 0.5 4.5 0.5 10C0.5 15.5 5 20 10.5 20C16 20 20.5 15.5 20.5 10C20.5 4.5 16 0 10.5 0ZM10.5 2C11.6 2 12.4 2.9 12.3 4L11.5 12H9.5L8.7 4C8.6 2.9 9.4 2 10.5 2ZM10.5 18C9.4 18 8.5 17.1 8.5 16C8.5 14.9 9.4 14 10.5 14C11.6 14 12.5 14.9 12.5 16C12.5 17.1 11.6 18 10.5 18Z" fill="#EB5757"/>
                      </svg>
                    </div>
                      <svg className="LockOf2" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g className="Lock2" opacity="0.3" clipPath="url(#clip0_2831_1557)">
                        <path className="Lock2" d="M15.625 7.5H15V5C15 2.2425 12.7575 0 10 0C7.2425 0 5 2.2425 5 5V7.5H4.375C3.34167 7.5 2.5 8.34083 2.5 9.375V18.125C2.5 19.1592 3.34167 20 4.375 20H15.625C16.6583 20 17.5 19.1592 17.5 18.125V9.375C17.5 8.34083 16.6583 7.5 15.625 7.5ZM6.66667 5C6.66667 3.16167 8.16167 1.66667 10 1.66667C11.8383 1.66667 13.3333 3.16167 13.3333 5V7.5H6.66667V5ZM10.8333 13.935V15.8333C10.8333 16.2933 10.4608 16.6667 10 16.6667C9.53917 16.6667 9.16667 16.2933 9.16667 15.8333V13.935C8.67083 13.6458 8.33333 13.1142 8.33333 12.5C8.33333 11.5808 9.08083 10.8333 10 10.8333C10.9192 10.8333 11.6667 11.5808 11.6667 12.5C11.6667 13.1142 11.3292 13.6458 10.8333 13.935Z" fill="#686868"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_2831_1557">
                        <rect width="20" height="20" fill="white"/>
                        </clipPath>
                        </defs>
                      </svg>
                  </div>
                </div>
              <div className={((Login==false)||(values.login=="")||(errors.email)||(Email==false)||(values.password.length<6)||(errors.password2))?"Zabil ZabilOpacity":"Zabil"}>
                <ReCAPTCHA
                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                name="recaptcha"
                onChange={onChange}
                value={capcha}
                />
              </div>
              <div className={("ErrorEnter" && ((touched.login&&errors.login)||(touched.password && errors.password)||(Login==false)||(errors.email)||(Email==false)||(values.password.length<6)||(errors.password2)||(capcha==false)))? "ErrorEnter fix":"ErrorEnter"}>
                  <div className="">
                    <p className="ErrorEnterText">{((Login==false?"Такой логин уже занят":"")||((values.login=="")?"Логин не может быть пустым":"")||((errors.email)?`${errors.email}`:"")||((Email==false)?"Такой email занят":"")||((values.password.length<6)?"Символы в пароле<6":"")||((errors.password2)?`${errors.password2}`:"")||((capcha==false)?"Капча":""))}</p>
                  </div>
                  <div className="">
                    <svg style={{marginLeft:"15px",paddingTop:"5px"}} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 0C4.5 0 0 4.5 0 10C0 15.5 4.5 20 10 20C15.5 20 20 15.5 20 10C20 4.5 15.5 0 10 0ZM10 2C11.1 2 11.9 2.9 11.8 4L11 12H9L8.2 4C8.1 2.9 8.9 2 10 2ZM10 18C8.9 18 8 17.1 8 16C8 14.9 8.9 14 10 14C11.1 14 12 14.9 12 16C12 17.1 11.1 18 10 18Z" fill="white" fillOpacity="0.5"/>
                    </svg>
                  </div>
                </div>
                <button className="Registrationbtn" id="btn" disabled={(values.login=="" || values.password=="" || Login==false || errors.email || errors.password2 || capcha==true)? !isValid:isValid} onClick={()=>{handleSubmit}} type="submit">Зарегистрироваться</button>
            </div>
            <div className="Dop">
              <p><b>Пользователь обязуется:</b></p>
              <ul className="osntext" typeof="disc">
                <li className="perechis">предоставлять достоверную и актуальную информацию при регистрации и добавлении объекта;</li>
                <li className="perechis">добавлять фотографии объектов соответствующие действительности. Администрация сайта sdaem.by оставляет за собой право удалять любую информацию, размещенную пользователем, если сочтет, что информация не соответствует действительности, носит оскорбительный характер, нарушает права и законные интересы других граждан либо действующее законодательство Республики Беларусь.</li>
              </ul>
              <div className="last__item__registraciya">
                <p className="Primech">Уже есть аккаунт?</p>
                <Link to="/signIn" className="Registration zabpas"> Войдите</Link>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  </div>
);
}
export default signUp;