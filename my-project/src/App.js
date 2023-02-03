import Homepage from "./components/MainPage/Homepage";
import Map from "./components/MapPage/Map";
import Error from "./components/ErrorPage/error";
import SignIn from "./components/SignIn_SignUp/signIn";
import SignUp from "./components/SignIn_SignUp/signUp/signUp";
import Send from "./components/SignIn_SignUp/signUp/send";
import Contacts from "./components/ContactsPage/contacts";
import Catalog from "./components/Catalog/catalog";
import News from "./components/News/News";
import Favourites from "./components/Favourites/Favourites";
import NewsSelect from "./components/News/NewsSelect";
import Advertisement from "./components/AdvertisementsPage/advertisement"
import CatalogSelect from "./components/Catalog/catalogSelect"
import "./App.css";
import React from "react";
import { Routes, Route} from "react-router-dom";
import TestAdvertisement from "./components/AdvertisementsPage/TestAdvertisement/testAdvertisement";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ScrollButton from "./components/Functions/scrollUp";



function App() {
  return (
    <>
      <div className="App">
        <Header/>
          <Routes>
            <Route exact path="/" element={<Homepage/>}/>
            <Route exact path="/signIn" element={<SignIn/>}/>
            <Route exact path="/contacts" element={<Contacts/>}/>
            <Route exact path="/send" element={<Send/>} />
            <Route exact path="/signIn/signUp" element={<SignUp/>}/>
            <Route exact path="/catalog/city=?/" element={<Catalog/>} />
            <Route exact path="/catalog/city?/:city/:id" element={<CatalogSelect/>} />
            <Route exact path="/news" element={<News/>} />
            <Route exact path="/news/:id" element={<NewsSelect/>} />
            <Route exact path="/map" element={<Map/>} />
            <Route path='/instagram.com' element={() => window.location = 'https://instagram.com'}/>
            <Route path='/vk.com' element={() => window.location = 'https://vk.com'}/>
            <Route path='/facebook.com' element={() => window.location = 'https://facebook.com'}/>
            <Route path='/whatsapp.com' element={() => window.location = 'https://whatsapp.com'}/>
            <Route path='/telegram.org' element={() => window.location = 'https://telegram.org'}/>
            <Route path='/viber.com' element={() => window.location = 'https://viber.com'}/>
            <Route exact path = "/favourites" element = {<Favourites/>} />
            <Route exact path = "/advertisement" element = {<Advertisement/>} />
            <Route exact path = "/advertisement/test/:id" element = {<TestAdvertisement/>} />
            <Route exact path="*" element={<Error/>} />
          </Routes> 
        <Footer/>   
        <ScrollButton/>    
      </div>
    </>
      
  );
}

export default App;
