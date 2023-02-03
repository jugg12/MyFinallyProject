import React from "react";
import ymaps from "ymaps";
import axios from "../../axios";
import "./Map.css";


import MapSelect from "./mapSelect";

export default function Map () {
  
  return(
    <>
      
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
  )
}