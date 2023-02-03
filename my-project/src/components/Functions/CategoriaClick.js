import { cityIn, cityFrom, cityTo } from 'lvovich';

export default function categoriaClick(value,priceMax,category,setCategory,setCategory2,setpriceMin,setpriceMax,gorod){
  const btn = document.getElementById("ListFilter");
  const btn2 = document.getElementById("filterSleepplaces");
  const btn3 = document.getElementById("FilterRayon");
  const btn4 = document.getElementById("FilterMetro2");
  const Options = document.querySelector(".Options");
  const DopOptions = document.querySelector(".DopOptions");
  const input = document.getElementById("checkboxInputValue");
  
  btn.textContent="Выберите";
  btn2.textContent="Выберите";
  btn3.textContent="Выберите";
  btn4.textContent="Выберите";
  if(input!==null){
    input.textContent="";
  }
  Options.classList.remove("active");
  DopOptions.classList.remove("active");
  


  document.querySelectorAll(".checkBoxOptions").forEach((checkbox)=>{
    checkbox.checked=false;
  })

  document.querySelectorAll(".categoriesBtn").forEach(function(categoriaalone){
    const categoria = categoriaalone.querySelector(".xHidden");
    const h1= document.querySelector(".ArendaInnerTextH1");
    if (categoria.id==value){
      categoria.classList.toggle("active");
      if (category){
        setCategory("");
        setCategory2("");
        h1.textContent=`Аренда квартир на сутки в ${cityIn(gorod)}`;
      }
      else if (categoria.id==value && priceMax!=="rayon"){
        setCategory(categoriaalone.textContent);
        h1.textContent=`Аренда ${cityFrom(categoriaalone.textContent)} квартир на сутки в ${cityIn(gorod)}`;
        setCategory2("rooms");
      }
      else{
        setCategory(categoriaalone.textContent);
        h1.textContent=`Аренда квартир в ${cityIn(categoriaalone.textContent)} на сутки в ${cityIn(gorod)}`;
        setCategory2("rayon");
      }
    }
    else if (categoria.id!==value){
      categoriaalone.classList.toggle("hidden")
    }  
  })

  setpriceMin(null);
  setpriceMax(null);
}