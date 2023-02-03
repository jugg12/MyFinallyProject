import { cityIn } from 'lvovich';
import { setSort } from '../../store/slices/FilterSlice';

export default function Clear(category,setCategory,setCategory2,priceMin,priceMax,setpriceMin,setpriceMax,axios,setArenda,city,dispatch){
  const Options = document.querySelector(".Options");
  const DopOptions = document.querySelector(".DopOptions");
  const h1= document.querySelector(".ArendaInnerTextH1");
  const btn = document.getElementById("ListFilter");
  const btn2 = document.getElementById("filterSleepplaces");
  const btn3 = document.getElementById("FilterRayon");
  const btn4 = document.getElementById("FilterMetro2");
  const inputCheckBoxInfo = document.getElementById("checkboxInputValue");
  
  if (category){
    setCategory("");
    setCategory2("");
    h1.textContent=`Аренда квартир на сутки в ${cityIn(city)}`;
  }

  document.querySelectorAll(".categoriesBtn").forEach(function(categoriaalone){
    const categoria = categoriaalone.querySelector(".xHidden");
    categoriaalone.classList.remove("hidden");
    categoria.classList.remove("active");
  });

  document.querySelectorAll(".checkBoxOptions").forEach((checkbox)=>{
    checkbox.checked=false
      });
  btn.textContent="Выберите";
  btn2.textContent="Выберите";
  btn3.textContent="Выберите";
  btn4.textContent="Выберите";
  inputCheckBoxInfo.value="";
  Options.classList.remove("active");
  DopOptions.classList.remove("active");
  axios.get(`/ArendaCard?city2=${city}`)
  .then(({data})=>{
    setArenda(data)
  });
  setpriceMin("");
  setpriceMax("");
  dispatch(setSort("По умолчанию"));
  const imgSort = document.querySelectorAll(".imgSort");
  if (imgSort!==undefined){
    imgSort.forEach((img)=>{
      img.classList.remove("active")
    });
  }
}