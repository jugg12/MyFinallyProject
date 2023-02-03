import { cityIn, cityFrom, cityTo } from 'lvovich';
import { notifyInfoPrice } from '../Toasts/ToastsContent';

export default function ShowSort(priceMin,priceMax,category,setCategory,setCategory2,setValue,setpriceMax,axios,setArenda,Arenda,gorod){
  const h1= document.querySelector(".ArendaInnerTextH1");
  let results;
  let DopOptionsCategory=false;
  const filterRooms = document.getElementById("ListFilter");
  const filterSleepPlaces = document.getElementById("filterSleepplaces");
  const filterRayon = document.getElementById("FilterRayon"); 
  const filterMetro = document.getElementById("FilterMetro2");
  const checkboxInputValue = document.getElementById("checkboxInputValue");
  const Options = document.querySelector(".OpFcii");
  const DopOptions = document.querySelector(".DopOptions");
  let results1 = 0;
  let results2;
  let k=0;
  let z=0;
  if(priceMin==0){
    priceMin=null;
  }
  if(priceMax==0){
    priceMax=null
  }

  // Список чексов скрыт
  if(Options && DopOptions!==null && checkboxInputValue==null){
    Options.classList.remove("active");
    DopOptions.classList.remove("active");
  }

  // Очистка кнопок поиска сверху
  document.querySelectorAll(".categoriesBtn").forEach(function(categoriaalone){
    const categoria = categoriaalone.querySelector(".xHidden");
    categoria.classList.remove("active");
    categoriaalone.classList.remove("hidden");
  });
  if(checkboxInputValue!==null && filterMetro!==null && filterSleepPlaces!==null && filterRayon!==null && filterRooms!==null){
    if (category && checkboxInputValue.value=="" && filterRooms.textContent == "Выберите" && filterMetro.textContent=="Выберите" && filterSleepPlaces.textContent=="Выберите" && filterRayon.textContent=="Выберите" && DopOptionsCategory==false ){
      setCategory("");
      setCategory2("")
      h1.textContent=`Аренда квартир на сутки в ${cityIn(gorod)}`;
    }
  }

  axios.get(`/ArendaCard?city2=${gorod}`)
  .then(({data})=>{

  if(checkboxInputValue!==null && filterMetro!==null && filterSleepPlaces!==null && filterRayon!==null){
    if(checkboxInputValue.value!=="" || filterMetro.textContent!=="Выберите" || filterSleepPlaces.textContent!=="Выберите" || filterRayon.textContent!=="Выберите"){
      DopOptionsCategory=true;
    }
    else{
      DopOptionsCategory=false;
    }

    if ((priceMin==null && priceMax!==null) || (priceMin!==null && priceMax==null)){
      notifyInfoPrice();
    }

    // Multiple filter
    if((priceMin!==null && priceMax!==null) && filterRooms.textContent=="Выберите" && DopOptionsCategory==false){ //Без опций чисто цена
      if(Number(priceMin) < Number(priceMax)){
        results = data.filter((item)=>
        (Number(priceMax)>Number(item.sent)) && (Number(item.sent)>Number(priceMin)));
        setArenda(results);
      }
      else{
        results = data.filter((item)=>
        (Number(item.sent)>=Number(priceMax)) && (Number(priceMin)>= Number(item.sent) ));
  
        setArenda(results);
      }    
    }

    else if(filterRooms.textContent!=="Выберите" && (priceMin==null && priceMax==null) && DopOptionsCategory==false){ // Filter rooms
      results = data.filter((item)=>
      (item.rooms==(filterRooms.textContent.substring(0,6)+".")));
      setArenda(results); 
    }

    else if ((priceMin!==null && priceMax!==null) && filterRooms.textContent!=="Выберите" && DopOptionsCategory==false){ //Без опций квартиры+цена
      if(Number(priceMax) > Number(priceMin)){
        results = data.filter((item)=>
        (Number(item.sent)>Number(priceMin) && Number(priceMax)>Number(item.sent)) &&(item.rooms==(filterRooms.textContent.substring(0,6)+".")));
        setArenda(results);
      }
      else{
        results = data.filter((item)=>
        (Number(item.sent)>=Number(priceMax) && Number(priceMin)>=Number(item.sent)) && (item.rooms==(filterRooms.textContent.substring(0,6)+".")));
        setArenda(results);
      }    
    }
    else if(DopOptionsCategory==true){
      if((priceMin==null && priceMax==null) && filterRooms.textContent=="Выберите"){ //Чисто опции
        // Spalnie sleepPlaces одиночное

        if(filterRayon.textContent=="Выберите" && filterSleepPlaces.textContent!=="Выберите" && filterMetro.textContent=="Выберите" && checkboxInputValue.value==""){
          results = data.filter((item)=>
          (item.options.length!==0 && item.options[0].sleepPlaces==(filterSleepPlaces.textContent)));
          setArenda(results); 
        }

        // Rayon одиночное

        else if(filterRayon.textContent!=="Выберите" && filterSleepPlaces.textContent=="Выберите" && filterMetro.textContent=="Выберите" && checkboxInputValue.value==""){
          results = data.filter((item)=>
          (item.rayon==(filterRayon.textContent + " р.")));
          setArenda(results); 
        }

        // Metro одиночное

        else if(filterRayon.textContent=="Выберите" && filterSleepPlaces.textContent=="Выберите" && filterMetro.textContent!=="Выберите" && checkboxInputValue.value==""){
          results = data.filter((item)=>
          (item.metro==(filterMetro.textContent)));
          setArenda(results); 
        }

        // checkbox одиночный

        else if(filterRayon.textContent =="Выберите" && filterSleepPlaces.textContent =="Выберите" && filterMetro.textContent =="Выберите" && checkboxInputValue.value!==""){
          const lengthResult = data.filter((item)=>(item.options[0].name.length!==0));
          for (let i=0; i<lengthResult.length;i++){
            results2 = data.filter((item)=>(item.options[0].length!==0 && 
              ((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1)));
              // Uslovia proverki podlennosti
              if(results2.length!==0 && results1<results2.length && k==z){ //Main dlya 1 elementa
                setArenda(results2);
                results1=results2.length;
                k++;
              }

              else if(results2.length!==0 && results1==results2.length && z==k){
                setArenda(results2);
                results1=results2.length
                k++
                z=k
              }

              else if(results2.length!==0 && results1==results2.length && z<k){
                Arenda.push(results2);
                results1=results2.length
                k++
                z=k
              }
          }
        }
        // Filter rayona s chem-to (2 elementa)

        // filter Rayona i sleepPlaces
        else if(filterRayon.textContent !== "Выберите" && filterSleepPlaces.textContent !== "Выберите" && filterMetro.textContent =="Выберите" && checkboxInputValue.value==""){
          results = data.filter((item)=>
          (item.options[0].sleepPlaces==(filterSleepPlaces.textContent) && (item.rayon==(filterRayon.textContent + " р."))));
          setArenda(results); 
        }

        // filter rayona s metro
        else if (filterRayon.textContent !== "Выберите" && filterSleepPlaces.textContent == "Выберите" && filterMetro.textContent !=="Выберите" && checkboxInputValue.value==""){
          results = data.filter((item)=>
          (item.metro==(filterMetro.textContent) && (item.rayon==(filterRayon.textContent + " р."))));
          setArenda(results); 
        }
        
        // filter rayona s chekboxom
        else if (filterRayon.textContent !== "Выберите" && filterSleepPlaces.textContent == "Выберите" && filterMetro.textContent =="Выберите" && checkboxInputValue.value !== ""){
          const lengthResult = data.filter((item)=>(item.options[0].name.length!==0));
          for (let i=0; i<lengthResult.length;i++){
            results2 = data.filter((item)=>(item.options[0].length!==0 && 
              ((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1)) && (item.rayon==(filterRayon.textContent + " р.")) );
              // Uslovia proverki podlennosti
              if(results1<results2.length && k==z){ //Main dlya 1 elementa
                setArenda(results2);
                results1=results2.length;
                k++;
              }
              else if( results1==results2.length && z==k){
                setArenda(results2);
                results1=results2.length
                k++
                z=k
              }
              else if(results1==results2.length && z<k){
                Arenda.push(results2);
                results1=results2.length
                k++
                z=k
              }
          }
        }

        // Filter sleepPlaces s chem-to (2 elementa)

        // filter sleepPlaces i metro
        else if(filterRayon.textContent == "Выберите" && filterSleepPlaces.textContent !== "Выберите" && filterMetro.textContent !=="Выберите" && checkboxInputValue.value ==""){
          results = data.filter((item)=>
          (item.options[0].sleepPlaces==(filterSleepPlaces.textContent) && (item.metro==(filterMetro.textContent))));
          setArenda(results); 
        }

        // filter sleepPlaces s checkboxom
        else if (filterRayon.textContent == "Выберите" && filterSleepPlaces.textContent !== "Выберите" && filterMetro.textContent =="Выберите" && checkboxInputValue.value !==""){
          const lengthResult = data.filter((item)=>(item.options[0].name.length!==0));
          for (let i=0; i<lengthResult.length;i++){
            results2 = data.filter((item)=>(item.options[0].length!==0 && 
              ((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1)) && (item.options[0].sleepPlaces==(filterSleepPlaces.textContent)));
              // Uslovia proverki podlennosti
              if(results1<results2.length && k==z){ //Main dlya 1 elementa
                setArenda(results2);
                results1=results2.length;
                k++;
              }
              else if( results1==results2.length && z==k){
                setArenda(results2);
                results1=results2.length
                k++
                z=k
              }
              else if(results1==results2.length && z<k){
                Arenda.push(results2);
                results1=results2.length
                k++
                z=k
              }
          }
        }

        // Filter Metro s chekboxom 

        else if (filterRayon.textContent == "Выберите" && filterSleepPlaces.textContent == "Выберите" && filterMetro.textContent !=="Выберите" && checkboxInputValue.value !==""){
          const lengthResult = data.filter((item)=>(item.options[0].name.length!==0));
          for (let i=0; i<lengthResult.length;i++){
            results2 = data.filter((item)=>(item.options[0].length!==0 && 
              ((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1)) && (item.metro==(filterMetro.textContent)));
              // Uslovia proverki podlennosti
              if(results1<results2.length && k==z){ //Main dlya 1 elementa
                setArenda(results2);
                results1=results2.length;
                k++;
              }
              else if( results1==results2.length && z==k){
                setArenda(results2);
                results1=results2.length
                k++
                z=k
              }
              else if(results1==results2.length && z<k){
                Arenda.push(results2);
                results1=results2.length
                k++
                z=k
              }
          }
        }
        
      //  Filter 3 elementa dop opciy

      // filter rayon,metro,mest
      else if (filterRayon.textContent !== "Выберите" && filterSleepPlaces.textContent !== "Выберите" && filterMetro.textContent !=="Выберите" && checkboxInputValue.value==""){
        results = data.filter((item)=>
        (item.metro==(filterMetro.textContent) && (item.rayon==(filterRayon.textContent + " р."))&& (item.options[0].sleepPlaces==(filterSleepPlaces.textContent))));
        setArenda(results); 
      }

      // filter rayon,sleepPlaces,checkbox
      else if (filterRayon.textContent !== "Выберите" && filterSleepPlaces.textContent !== "Выберите" && filterMetro.textContent =="Выберите" && checkboxInputValue.value!==""){
        const lengthResult = data.filter((item)=>(item.options[0].name.length!==0));
          for (let i=0; i<lengthResult.length;i++){
            results2 = data.filter((item)=>
              (((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1) && (item.rayon==(filterRayon.textContent + " р."))&& (item.options[0].sleepPlaces==(filterSleepPlaces.textContent))));
              // Uslovia proverki podlennosti
              if(results1<results2.length && k==z){ //Main dlya 1 elementa
                setArenda(results2);
                results1=results2.length;
                k++;
              }
              else if( results1==results2.length && z==k){
                setArenda(results2);
                results1=results2.length
                k++
                z=k
              }
              else if(results1==results2.length && z<k){
                Arenda.push(results2);
                results1=results2.length
                k++
                z=k
              }
          }
          
      }

      // filter rayon,metro,checkbox
      else if (filterRayon.textContent !== "Выберите" && filterSleepPlaces.textContent == "Выберите" && filterMetro.textContent !=="Выберите" && checkboxInputValue.value !== ""){
        const lengthResult = data.filter((item)=>(item.options[0].name.length!==0));
        for (let i=0; i<lengthResult.length;i++){
          results2 = data.filter((item)=>
            (((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1) && (item.rayon==(filterRayon.textContent + " р.")) && (item.metro==(filterMetro.textContent))));
            // Uslovia proverki podlennosti
            if(results1<results2.length && k==z){ //Main dlya 1 elementa
              setArenda(results2);
              results1=results2.length;
              k++;
            }
            else if( results1==results2.length && z==k){
              setArenda(results2);
              results1=results2.length
              k++
              z=k
            }
            else if(results1==results2.length && z<k){
              Arenda.push(results2);
              results1=results2.length
              k++
              z=k
            }
        }
      }

      // filter sleepPlaces,metro,checkbox
      else if (filterRayon.textContent == "Выберите" && filterSleepPlaces.textContent !== "Выберите" && filterMetro.textContent !=="Выберите" && checkboxInputValue.value !== ""){
        const lengthResult = data.filter((item)=>(item.options[0].name.length!==0));
        for (let i=0; i<lengthResult.length;i++){
          results2 = data.filter((item)=>
            (((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1) && (item.options[0].sleepPlaces==(filterSleepPlaces.textContent)) && (item.metro==(filterMetro.textContent))));
            // Uslovia proverki podlennosti
            if(results1<results2.length && k==z){ //Main dlya 1 elementa
              setArenda(results2);
              results1=results2.length;
              k++;
            }
            else if( results1==results2.length && z==k){
              setArenda(results2);
              results1=results2.length
              k++
              z=k
            }
            else if(results1==results2.length && z<k){
              Arenda.push(results2);
              results1=results2.length
              k++
              z=k
            }
        }
      }
      
      // filter 4 elementa
      else if (filterRayon.textContent !== "Выберите" && filterSleepPlaces.textContent !== "Выберите" && filterMetro.textContent !=="Выберите" && checkboxInputValue.value !== ""){
        const lengthResult = data.filter((item)=>(item.options[0].name.length!==0));
        for (let i=0; i<lengthResult.length;i++){
          results2 = data.filter((item)=>
            (((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1) && (item.rayon==(filterRayon.textContent + " р.")) && (item.metro==(filterMetro.textContent)) && (item.options[0].sleepPlaces==(filterSleepPlaces.textContent))));
            // Uslovia proverki podlennosti
            if(results1<results2.length && k==z){ //Main dlya 1 elementa
              setArenda(results2);
              results1=results2.length;
              k++;
            }
            else if( results1==results2.length && z==k){
              setArenda(results2);
              results1=results2.length
              k++
              z=k
            }
            else if(results1==results2.length && z<k){
              Arenda.push(results2);
              results1=results2.length
              k++
              z=k
            }
        }
      }

    }

  // /////////////////////////////////////////////////////////////////////////////////////////////

  //MULTIPLY FILTER ALL 

  else if(DopOptionsCategory==true){
      // Spalnie sleepPlaces 

      // *2 elementa
      // sleepPlaces+priceMin
      if(filterRayon.textContent=="Выберите" && filterSleepPlaces.textContent!=="Выберите" && filterMetro.textContent=="Выберите" 
      && checkboxInputValue.value=="" && (priceMin!==null && priceMax!==null) && filterRooms.textContent=="Выберите"){
        if(Number(priceMax) > Number(priceMin)){
          results = data.filter(((item)=>(Number(item.sent)>Number(priceMin) && Number(priceMax)>Number(item.sent)) &&(item.options.length!==0 && item.options[0].sleepPlaces==(filterSleepPlaces.textContent))));
          setArenda(results);
        }
        else{
          results = data.filter((item)=>((Number(item.sent)>=Number(priceMax) && Number(priceMin)>=Number(item.sent)) && (item.options.length!==0 && item.options[0].sleepPlaces==(filterSleepPlaces.textContent))));
          setArenda(results);
        }    
      }

      // sleepPlaces+rooms
      else if(filterRayon.textContent=="Выберите" && filterSleepPlaces.textContent!=="Выберите" && filterMetro.textContent=="Выберите" 
      && checkboxInputValue.value=="" && (priceMin==null && priceMax==null) && filterRooms.textContent!=="Выберите"){
        results = data.filter((item)=>
        (item.rooms==(filterRooms.textContent.substring(0,6)+".")) && (item.options.length!==0 && item.options[0].sleepPlaces==(filterSleepPlaces.textContent)));
        setArenda(results); 
      }

      // Rayon + priceMin (item.rayon==(filterRayon.textContent + " р.")));
      else if(filterRayon.textContent!=="Выберите" && filterSleepPlaces.textContent=="Выберите" && filterMetro.textContent=="Выберите" 
      && checkboxInputValue.value=="" && (priceMin!==null && priceMax!==null) && filterRooms.textContent=="Выберите"){
        if(Number(priceMax) > Number(priceMin)){
          results = data.filter(((item)=>(Number(item.sent)>Number(priceMin) && Number(priceMax)>Number(item.sent)) &&(item.rayon==(filterRayon.textContent + " р."))));
          setArenda(results);
        }
        else{
          results = data.filter((item)=>((Number(item.sent)>=Number(priceMax) && Number(priceMin)>=Number(item.sent)) && (item.rayon==(filterRayon.textContent + " р."))));
          setArenda(results);
        }    
      }

      // Rayon + rooms 
      else if(filterRayon.textContent!=="Выберите" && filterSleepPlaces.textContent=="Выберите" && filterMetro.textContent=="Выберите" 
      && checkboxInputValue.value=="" && (priceMin==null && priceMax==null) && filterRooms.textContent!=="Выберите"){
        results = data.filter((item)=>
        (item.rooms==(filterRooms.textContent.substring(0,6)+".")) && (item.rayon==(filterRayon.textContent + " р.")));
        setArenda(results); 
      }

      // Metro+priceMin item.metro==(filterMetro.textContent))
      else if(filterRayon.textContent=="Выберите" && filterSleepPlaces.textContent=="Выберите" && filterMetro.textContent!=="Выберите" 
      && checkboxInputValue.value=="" && (priceMin!==null && priceMax!==null) && filterRooms.textContent=="Выберите"){
        if(Number(priceMax) > Number(priceMin)){
          results = data.filter(((item)=>(Number(item.sent)>Number(priceMin) && Number(priceMax)>Number(item.sent)) &&item.metro==(filterMetro.textContent)));
          setArenda(results);
        }
        else{
          results = data.filter((item)=>((Number(item.sent)>=Number(priceMax) && Number(priceMin)>=Number(item.sent)) && item.metro==(filterMetro.textContent)));
          setArenda(results);
        }    
      }

      // Metro+rooms
      else if(filterRayon.textContent=="Выберите" && filterSleepPlaces.textContent=="Выберите" && filterMetro.textContent!=="Выберите" 
      && checkboxInputValue.value=="" && (priceMin==null && priceMax==null) && filterRooms.textContent!=="Выберите"){
        results = data.filter((item)=>
        (item.rooms==(filterRooms.textContent.substring(0,6)+".")) && item.metro==(filterMetro.textContent));
        setArenda(results); 
      }

      // checkbox+priceMin
      else if(filterRayon.textContent=="Выберите" && filterSleepPlaces.textContent=="Выберите" && filterMetro.textContent=="Выберите" 
      && checkboxInputValue.value!=="" && (priceMin!==null && priceMax!==null) && filterRooms.textContent=="Выберите"){
        const lengthResult = data.filter((item)=>(item.options[0].name.length!==0));
        for (let i=0; i<lengthResult.length;i++){
          if(Number(priceMax) > Number(priceMin)){
            results2 = data.filter(((item)=>(Number(item.sent)>Number(priceMin) && Number(priceMax)>Number(item.sent)) && (item.options[0].length!==0 && 
            ((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1))));
          }
          else{
            results2 = data.filter((item)=>((Number(item.sent)>=Number(priceMax) && Number(priceMin)>=Number(item.sent)) && (item.options[0].length!==0 && 
            ((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1))));
          }    
            // Uslovia proverki podlennosti
            if(results2.length!==0 && results1<results2.length && k==z){ //Main dlya 1 elementa
              setArenda(results2);
              results1=results2.length;
              k++;
            }

            else if(results2.length!==0 && results1==results2.length && z==k){
              setArenda(results2);
              results1=results2.length
              k++
              z=k
            }

            else if(results2.length!==0 && results1==results2.length && z<k){
              Arenda.push(results2);
              results1=results2.length
              k++
              z=k
            }
            else if(results2.length==0 && results1<results2.length && k==z){
              setArenda(results2);
            }

            else if(results2.length==0 && results1==results2.length && z==k){
              setArenda(results2);
              results1=results2.length
              k++
              z=k
            }

            else if(results2.length==0 && results1==results2.length && z<k){
              Arenda.push(results2);
              results1=results2.length
              k++
              z=k
            }
        }
      }
      
      // checkbox+rooms
      else if(filterRayon.textContent=="Выберите" && filterSleepPlaces.textContent=="Выберите" && filterMetro.textContent=="Выберите" 
      && checkboxInputValue.value!=="" && (priceMin==null && priceMax==null) && filterRooms.textContent!=="Выберите"){
        const lengthResult = data.filter((item)=>(item.options[0].name.length!==0));
        for (let i=0; i<lengthResult.length;i++){
          results2 = data.filter((item)=>
          (((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1))&& (item.rooms==(filterRooms.textContent.substring(0,6)+".")));
            // Uslovia proverki podlennosti
            if(results2.length!==0 && results1<results2.length && k==z){ //Main dlya 1 elementa
              setArenda(results2);
              results1=results2.length;
              k++;
            }

            else if(results2.length!==0 && results1==results2.length && z==k){
              setArenda(results2);
              results1=results2.length
              k++
              z=k
            }

            else if(results2.length!==0 && results1==results2.length && z<k){
              Arenda.push(results2);
              results1=results2.length
              k++
              z=k
            }
            else if(results2.length==0 && results1<results2.length && k==z){
              setArenda(results2);
            }

            else if(results2.length==0 && results1==results2.length && z==k){
              setArenda(results2);
              results1=results2.length
              k++
              z=k
            }

            else if(results2.length==0 && results1==results2.length && z<k){
              Arenda.push(results2);
              results1=results2.length
              k++
              z=k
            }
        }
      }

      // Filter rooms s 2 elementami (3 elementa)

      // filter rooms,priceMin s rayonom
      else if(filterRayon.textContent!=="Выберите" && filterSleepPlaces.textContent=="Выберите" && filterMetro.textContent=="Выберите" 
      && checkboxInputValue.value=="" && (priceMin!==null && priceMax!==null) && filterRooms.textContent!=="Выберите"){
        if(Number(priceMax) > Number(priceMin)){
          results2 = data.filter((item)=>((Number(item.sent)>Number(priceMin) && Number(priceMax)>Number(item.sent)) &&
          (item.rayon==(filterRayon.textContent + " р.")) && (item.rooms==(filterRooms.textContent.substring(0,6)+"."))));
          setArenda(results2);
        }
        else{
          results2 = data.filter((item)=>((Number(item.sent)>=Number(priceMax) && Number(priceMin)>=Number(item.sent)) && 
          (item.rayon==(filterRayon.textContent + " р.")) && (item.rooms==(filterRooms.textContent.substring(0,6)+"."))));
          setArenda(results2);
        }    
      }

      // filter rooms,priceMin s sleepPlaces
      else if(filterRayon.textContent=="Выберите" && filterSleepPlaces.textContent!=="Выберите" && filterMetro.textContent=="Выберите" 
      && checkboxInputValue.value=="" && (priceMin!==null && priceMax!==null) && filterRooms.textContent!=="Выберите"){
        if(Number(priceMax) > Number(priceMin)){
          results2 = data.filter((item)=>((Number(item.sent)>Number(priceMin) && Number(priceMax)>Number(item.sent)) &&
          (item.rooms==(filterRooms.textContent.substring(0,6)+".")) && (item.options[0].sleepPlaces==(filterSleepPlaces.textContent))));
          setArenda(results2);
        }
        else{
          results2 = data.filter((item)=>((Number(item.sent)>=Number(priceMax) && Number(priceMin)>=Number(item.sent)) && 
          (item.rooms==(filterRooms.textContent.substring(0,6)+".")) && (item.options[0].sleepPlaces==(filterSleepPlaces.textContent))));
          setArenda(results2);
        }    
      }

      // filter rooms,priceMin s metro
      else if(filterRayon.textContent=="Выберите" && filterSleepPlaces.textContent=="Выберите" && filterMetro.textContent!=="Выберите" 
      && checkboxInputValue.value=="" && (priceMin!==null && priceMax!==null) && filterRooms.textContent!=="Выберите"){
        if(Number(priceMax) > Number(priceMin)){
          results2 = data.filter((item)=>((Number(item.sent)>Number(priceMin) && Number(priceMax)>Number(item.sent)) &&
          (item.rooms==(filterRooms.textContent.substring(0,6)+".")) && (item.metro==(filterMetro.textContent))));
          setArenda(results2);
        }
        else{
          results2 = data.filter((item)=>((Number(item.sent)>=Number(priceMax) && Number(priceMin)>=Number(item.sent)) && 
          (item.rooms==(filterRooms.textContent.substring(0,6)+".")) && (item.metro==(filterMetro.textContent))));
          setArenda(results2);
        }    
      }

      // filter rooms,priceMin s checkbox
      else if(filterRayon.textContent=="Выберите" && filterSleepPlaces.textContent=="Выберите" && filterMetro.textContent =="Выберите" 
      && checkboxInputValue.value!=="" && (priceMin!==null && priceMax!==null) && filterRooms.textContent!=="Выберите"){ 
        const lengthResult = data.filter((item)=>(item.options[0].name.length!==0));
        for (let i=0; i<lengthResult.length;i++){
          if(Number(priceMax) > Number(priceMin)){
            results2 = data.filter(((item)=> (Number(item.sent)>Number(priceMin) && Number(priceMax)>Number(item.sent)) && 
           (item.options[0].length!==0 && ((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1))&& (item.rooms==(filterRooms.textContent.substring(0,6)+"."))));
          }
          else{
            results2 = data.filter((item)=>((Number(item.sent)>=Number(priceMax) && Number(priceMin)>=Number(item.sent)) && 
            (item.options[0].length!==0 && ((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1)) && (item.rooms==(filterRooms.textContent.substring(0,6)+"."))));
          }    
            // Uslovia proverki podlennosti
            if(results2.length!==0 && results1<results2.length && k==z){ //Main dlya 1 elementa
              setArenda(results2);
              results1=results2.length;
              k++;
            }

            else if(results2.length!==0 && results1==results2.length && z==k){
              setArenda(results2);
              results1=results2.length
              k++
              z=k
            }

            else if(results2.length!==0 && results1==results2.length && z<k){
              Arenda.push(results2);
              results1=results2.length
              k++
              z=k
            }
            else if(results2.length==0 && results1<results2.length && k==z){
              setArenda(results2);
            }

            else if(results2.length==0 && results1==results2.length && z==k){
              setArenda(results2);
              results1=results2.length
              k++
              z=k
            }

            else if(results2.length==0 && results1==results2.length && z<k){
              Arenda.push(results2);
              results1=results2.length
              k++
              z=k
            }
        }
      }

      // filter rooms,rayona s sleepPlaces
      else if(filterRayon.textContent!=="Выберите" && filterSleepPlaces.textContent!=="Выберите" && filterMetro.textContent=="Выберите" 
      && checkboxInputValue.value=="" && (priceMin==null && priceMax==null) && filterRooms.textContent!=="Выберите"){
        results = data.filter((item)=>
        (item.options[0].sleepPlaces==(filterSleepPlaces.textContent) && (item.rayon==(filterRayon.textContent + " р.")) && (item.rooms==(filterRooms.textContent.substring(0,6)+"."))));
        setArenda(results); 
      }

      // filter rooms,rayona s metro  
      else if(filterRayon.textContent!=="Выберите" && filterSleepPlaces.textContent=="Выберите" && filterMetro.textContent!=="Выберите" 
      && checkboxInputValue.value=="" && (priceMin==null && priceMax==null) && filterRooms.textContent!=="Выберите"){
        results = data.filter((item)=>
        (item.metro==(filterMetro.textContent) && (item.rayon==(filterRayon.textContent + " р.")) && (item.rooms==(filterRooms.textContent.substring(0,6)+"."))));
        setArenda(results); 
      }
      
      // filter rooms,rayona s chekboxom
      else if(filterRayon.textContent!=="Выберите" && filterSleepPlaces.textContent=="Выберите" && filterMetro.textContent=="Выберите" 
      && checkboxInputValue.value!=="" && (priceMin==null && priceMax==null) && filterRooms.textContent!=="Выберите"){
        const lengthResult = data.filter((item)=>(item.options[0].name.length!==0));
        for (let i=0; i<lengthResult.length;i++){
          results2 = data.filter((item)=>(item.options[0].length!==0 && 
            ((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1)) && (item.rayon==(filterRayon.textContent + " р.")) && (item.rooms==(filterRooms.textContent.substring(0,6)+".")));
            // Uslovia proverki podlennosti
            if(results1<results2.length && k==z){ //Main dlya 1 elementa
              setArenda(results2);
              results1=results2.length;
              k++;
            }
            else if( results1==results2.length && z==k){
              setArenda(results2);
              results1=results2.length
              k++
              z=k
            }
            else if(results1==results2.length && z<k){
              Arenda.push(results2);
              results1=results2.length
              k++
              z=k
            }
        }
      }

      // Filter rooms,sleepPlaces +1 element (3 elementa)

      // filter rooms,sleepPlaces i metro
      else if(filterRayon.textContent == "Выберите" && filterSleepPlaces.textContent !== "Выберите" && 
      filterMetro.textContent !=="Выберите" && checkboxInputValue.value =="" && (priceMin==null && priceMax==null)){
        results = data.filter((item)=>
        (item.rooms==(filterRooms.textContent.substring(0,6)+"."))&&(item.options[0].sleepPlaces==(filterSleepPlaces.textContent) && (item.metro==(filterMetro.textContent))));
        setArenda(results); 
      }

      // filter rooms,sleepPlaces s checkboxom
      else if(filterRayon.textContent == "Выберите" && filterSleepPlaces.textContent !== "Выберите" && 
      filterMetro.textContent =="Выберите" && checkboxInputValue.value !=="" && (priceMin==null && priceMax==null)){
        const lengthResult = data.filter((item)=>(item.options[0].name.length!==0));
        for (let i=0; i<lengthResult.length;i++){
          results2 = data.filter((item)=>(item.options[0].length!==0 && 
            ((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1)) && (item.rooms==(filterRooms.textContent.substring(0,6)+".")) && (item.options[0].sleepPlaces==(filterSleepPlaces.textContent)));
            // Uslovia proverki podlennosti
            if(results1<results2.length && k==z){ //Main dlya 1 elementa
              setArenda(results2);
              results1=results2.length;
              k++;
            }
            else if( results1==results2.length && z==k){
              setArenda(results2);
              results1=results2.length
              k++
              z=k
            }
            else if(results1==results2.length && z<k){
              Arenda.push(results2);
              results1=results2.length
              k++
              z=k
            }
        }
      }

      // filter rooms,metro s chekboxom 

      else if(filterRayon.textContent == "Выберите" && filterSleepPlaces.textContent == "Выберите" && 
      filterMetro.textContent !=="Выберите" && checkboxInputValue.value !=="" && (priceMin==null && priceMax==null)){
        const lengthResult = data.filter((item)=>(item.options[0].name.length!==0));
        for (let i=0; i<lengthResult.length;i++){
          results2 = data.filter((item)=>(item.options[0].length!==0 && 
            ((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1)) && (item.rooms==(filterRooms.textContent.substring(0,6)+".")) && (item.metro==(filterMetro.textContent)));
            // Uslovia proverki podlennosti
            if(results1<results2.length && k==z){ //Main dlya 1 elementa
              setArenda(results2);
              results1=results2.length;
              k++;
            }
            else if( results1==results2.length && z==k){
              setArenda(results2);
              results1=results2.length
              k++
              z=k
            }
            else if(results1==results2.length && z<k){
              Arenda.push(results2);
              results1=results2.length
              k++
              z=k
            }
        }
      }
      
    //  Filter 4 elementa

    //filter rooms,priceMin,rayon,checkbox -
    else if(filterRayon.textContent!=="Выберите" && filterSleepPlaces.textContent=="Выберите" && filterMetro.textContent=="Выберите" 
      && checkboxInputValue.value!=="" && (priceMin!==null && priceMax!==null) && filterRooms.textContent!=="Выберите"){
        const lengthResult = data.filter((item)=>(item.options[0].name.length!==0));
        for (let i=0; i<lengthResult.length;i++){
          if(Number(priceMax) > Number(priceMin)){
            results2 = data.filter(((item)=>(Number(item.sent)>Number(priceMin) && Number(priceMax)>Number(item.sent)) && (item.rooms==(filterRooms.textContent.substring(0,6)+"."))&&
            (item.rayon==(filterRayon.textContent + " р.")) && (item.options[0].length!==0 && ((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1))));
          }
          else{
            results2 = data.filter((item)=>((Number(item.sent)>=Number(priceMax) && Number(priceMin)>=Number(item.sent)) && (item.rooms==(filterRooms.textContent.substring(0,6)+".")) &&
            (item.rayon==(filterRayon.textContent + " р.")) && (item.options[0].length!==0 && ((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1))));
          }    
            // Uslovia proverki podlennosti
            if(results2.length!==0 && results1<results2.length && k==z){ //Main dlya 1 elementa
              setArenda(results2);
              results1=results2.length;
              k++;
            }

            else if(results2.length!==0 && results1==results2.length && z==k){
              setArenda(results2);
              results1=results2.length
              k++
              z=k
            }

            else if(results2.length!==0 && results1==results2.length && z<k){
              Arenda.push(results2);
              results1=results2.length
              k++
              z=k
            }
            else if(results2.length==0 && results1<results2.length && k==z){
              setArenda(results2);
            }

            else if(results2.length==0 && results1==results2.length && z==k){
              setArenda(results2);
              results1=results2.length
              k++
              z=k
            }

            else if(results2.length==0 && results1==results2.length && z<k){
              Arenda.push(results2);
              results1=results2.length
              k++
              z=k
            }
        }
      }

    //filter rooms,priceMin,sleepPlaces,checkbox -
    else if(filterRayon.textContent=="Выберите" && filterSleepPlaces.textContent!=="Выберите" && filterMetro.textContent=="Выберите" 
    && checkboxInputValue.value!=="" && (priceMin!==null && priceMax!==null) && filterRooms.textContent!=="Выберите"){
      const lengthResult = data.filter((item)=>(item.options[0].name.length!==0));
      for (let i=0; i<lengthResult.length;i++){
        if(Number(priceMax) > Number(priceMin)){
          results2 = data.filter(((item)=>(Number(item.sent)>Number(priceMin) && Number(priceMax)>Number(item.sent)) && (item.rooms==(filterRooms.textContent.substring(0,6)+".")) && (item.options[0].sleepPlaces==(filterSleepPlaces.textContent)) && (item.options[0].length!==0 && 
          ((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1))));
        }
        else{
          results2 = data.filter((item)=>((Number(item.sent)>=Number(priceMax) && Number(priceMin)>=Number(item.sent)) && (item.rooms==(filterRooms.textContent.substring(0,6)+".")) && (item.options[0].sleepPlaces==(filterSleepPlaces.textContent)) && (item.options[0].length!==0 && 
          ((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1))));
        }    
          // Uslovia proverki podlennosti
          if(results2.length!==0 && results1<results2.length && k==z){ //Main dlya 1 elementa
            setArenda(results2);
            results1=results2.length;
            k++;
          }

          else if(results2.length!==0 && results1==results2.length && z==k){
            setArenda(results2);
            results1=results2.length
            k++
            z=k
          }

          else if(results2.length!==0 && results1==results2.length && z<k){
            Arenda.push(results2);
            results1=results2.length
            k++
            z=k
          }
          else if(results2.length==0 && results1<results2.length && k==z){
            setArenda(results2);
          }

          else if(results2.length==0 && results1==results2.length && z==k){
            setArenda(results2);
            results1=results2.length
            k++
            z=k
          }

          else if(results2.length==0 && results1==results2.length && z<k){
            Arenda.push(results2);
            results1=results2.length
            k++
            z=k
          }
      }
    }  

    //filter rooms,priceMin,metro,checkbox -
    else if(filterRayon.textContent=="Выберите" && filterSleepPlaces.textContent=="Выберите" && filterMetro.textContent!=="Выберите" 
    && checkboxInputValue.value!=="" && (priceMin!==null && priceMax!==null) && filterRooms.textContent!=="Выберите"){
      const lengthResult = data.filter((item)=>(item.options[0].name.length!==0));
      for (let i=0; i<lengthResult.length;i++){
        if(Number(priceMax) > Number(priceMin)){
          results2 = data.filter(((item)=>(Number(item.sent)>Number(priceMin) && Number(priceMax)>Number(item.sent)) && (item.rooms==(filterRooms.textContent.substring(0,6)+".")) && (item.metro==(filterMetro.textContent)) && (item.options[0].length!==0 && 
          ((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1))));
        }
        else{
          results2 = data.filter((item)=>((Number(item.sent)>=Number(priceMax) && Number(priceMin)>=Number(item.sent)) && (item.rooms==(filterRooms.textContent.substring(0,6)+".")) && (item.metro==(filterMetro.textContent)) && (item.options[0].length!==0 && 
          ((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1))));
        }    
          // Uslovia proverki podlennosti
          if(results2.length!==0 && results1<results2.length && k==z){ //Main dlya 1 elementa
            setArenda(results2);
            results1=results2.length;
            k++;
          }

          else if(results2.length!==0 && results1==results2.length && z==k){
            setArenda(results2);
            results1=results2.length
            k++
            z=k
          }

          else if(results2.length!==0 && results1==results2.length && z<k){
            Arenda.push(results2);
            results1=results2.length
            k++
            z=k
          }
          else if(results2.length==0 && results1<results2.length && k==z){
            setArenda(results2);
          }

          else if(results2.length==0 && results1==results2.length && z==k){
            setArenda(results2);
            results1=results2.length
            k++
            z=k
          }

          else if(results2.length==0 && results1==results2.length && z<k){
            Arenda.push(results2);
            results1=results2.length
            k++
            z=k
          }
      }
    }  
    
    // filter rooms,rayon,metro,sleepPlaces
    else if(filterRayon.textContent !== "Выберите" && filterSleepPlaces.textContent !== "Выберите" && 
    filterMetro.textContent !=="Выберите" && checkboxInputValue.value =="" && (priceMin==null && priceMax==null) && filterRooms.textContent!=="Выберите"){
      results = data.filter((item)=>
      (item.metro==(filterMetro.textContent) && (item.rayon==(filterRayon.textContent + " р.")) && (item.rooms==(filterRooms.textContent.substring(0,6)+".")) && (item.options[0].sleepPlaces==(filterSleepPlaces.textContent))));
      setArenda(results); 
    }

    // filter rooms,rayon,sleepPlaces,checkbox
    else if (filterRayon.textContent !== "Выберите" && filterSleepPlaces.textContent !== "Выберите" && 
    filterMetro.textContent =="Выберите" && checkboxInputValue.value!=="" && (priceMin==null && priceMax==null) && filterRooms.textContent!=="Выберите"){
      const lengthResult = data.filter((item)=>(item.options[0].name.length!==0));
        for (let i=0; i<lengthResult.length;i++){
          results2 = data.filter((item)=>
            (((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1) && (item.rayon==(filterRayon.textContent + " р."))&& 
            (item.options[0].sleepPlaces==(filterSleepPlaces.textContent)) && (item.rooms==(filterRooms.textContent.substring(0,6)+"."))));
            // Uslovia proverki podlennosti
            if(results1<results2.length && k==z){ //Main dlya 1 elementa
              setArenda(results2);
              results1=results2.length;
              k++;
            }
            else if( results1==results2.length && z==k){
              setArenda(results2);
              results1=results2.length
              k++
              z=k
            }
            else if(results1==results2.length && z<k){
              Arenda.push(results2);
              results1=results2.length
              k++
              z=k
            }
        }
        
    }

    // filter rooms,rayon,metro,checkbox
    else if (filterRayon.textContent !== "Выберите" && filterSleepPlaces.textContent == "Выберите" && 
    filterMetro.textContent !=="Выберите" && checkboxInputValue.value !== "" && (priceMin==null && priceMax==null) && filterRooms.textContent!=="Выберите"){
      const lengthResult = data.filter((item)=>(item.options[0].name.length!==0));
      for (let i=0; i<lengthResult.length;i++){
        results2 = data.filter((item)=>
          (((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1) && 
          (item.rayon==(filterRayon.textContent + " р.")) && (item.metro==(filterMetro.textContent)) && (item.rooms==(filterRooms.textContent.substring(0,6)+"."))));
          // Uslovia proverki podlennosti
          if(results1<results2.length && k==z){ //Main dlya 1 elementa
            setArenda(results2);
            results1=results2.length;
            k++;
          }
          else if( results1==results2.length && z==k){
            setArenda(results2);
            results1=results2.length
            k++
            z=k
          }
          else if(results1==results2.length && z<k){
            Arenda.push(results2);
            results1=results2.length
            k++
            z=k
          }
      }
    }

    // filter rooms,sleepPlaces,metro,checkbox
    else if (filterRayon.textContent == "Выберите" && filterSleepPlaces.textContent !== "Выберите" && 
    filterMetro.textContent !=="Выберите" && checkboxInputValue.value !== "" && (priceMin==null && priceMax==null) && filterRooms.textContent!=="Выберите"){
      const lengthResult = data.filter((item)=>(item.options[0].name.length!==0));
      for (let i=0; i<lengthResult.length;i++){
        results2 = data.filter((item)=>
          (((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1) && (item.options[0].sleepPlaces==(filterSleepPlaces.textContent)) && 
          (item.metro==(filterMetro.textContent)) && (item.rooms==(filterRooms.textContent.substring(0,6)+"."))));
          // Uslovia proverki podlennosti
          if(results1<results2.length && k==z){ //Main dlya 1 elementa
            setArenda(results2);
            results1=results2.length;
            k++;
          }
          else if( results1==results2.length && z==k){
            setArenda(results2);
            results1=results2.length
            k++
            z=k
          }
          else if(results1==results2.length && z<k){
            Arenda.push(results2);
            results1=results2.length
            k++
            z=k
          }
      }
    }

    // priceMin filter 3 elementa
    ////////////////////////////////////////////////////////////// 
    
    // filter priceMin,rayon,metro,sleepPlaces
    else if(filterRayon.textContent !== "Выберите" && filterSleepPlaces.textContent !== "Выберите" && 
    filterMetro.textContent !=="Выберите" && checkboxInputValue.value =="" && (priceMin!==null && priceMax!==null) && filterRooms.textContent=="Выберите"){
      if(Number(priceMax) > Number(priceMin)){
        results2 = data.filter(((item)=>(Number(item.sent)>Number(priceMin) && Number(priceMax)>Number(item.sent)) && 
        item.metro==(filterMetro.textContent) && (item.rayon==(filterRayon.textContent + " р.")) && (item.rooms==(filterRooms.textContent.substring(0,6)+".")) && (item.options[0].sleepPlaces==(filterSleepPlaces.textContent))));
      }
      else{
        results2 = data.filter((item)=>((Number(item.sent)>=Number(priceMax) && Number(priceMin)>=Number(item.sent)) && 
        item.metro==(filterMetro.textContent) && (item.rayon==(filterRayon.textContent + " р.")) && (item.rooms==(filterRooms.textContent.substring(0,6)+".")) && (item.options[0].sleepPlaces==(filterSleepPlaces.textContent))));
      }    
      setArenda(results2); 
    }

    // filter priceMin,rayon,sleepPlaces,checkbox
    else if (filterRayon.textContent !== "Выберите" && filterSleepPlaces.textContent !== "Выберите" && 
    filterMetro.textContent =="Выберите" && checkboxInputValue.value!=="" && (priceMin!==null && priceMax!==null) && filterRooms.textContent=="Выберите"){
      const lengthResult = data.filter((item)=>(item.options[0].name.length!==0));
        for (let i=0; i<lengthResult.length;i++){
          if(Number(priceMax) > Number(priceMin)){
            results2 = data.filter((item)=>
            (((Number(item.sent)>Number(priceMin) && Number(priceMax)>Number(item.sent)) && (checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1) && (item.rayon==(filterRayon.textContent + " р."))&& 
            (item.options[0].sleepPlaces==(filterSleepPlaces.textContent))));
          }
          else{
            results2 = data.filter((item)=>
            ((Number(item.sent)>=Number(priceMax) && Number(priceMin)>=Number(item.sent)) && (checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1) && (item.rayon==(filterRayon.textContent + " р."))&& 
            (item.options[0].sleepPlaces==(filterSleepPlaces.textContent)));
          }    
            // Uslovia proverki podlennosti
            if(results1<results2.length && k==z){ //Main dlya 1 elementa
              setArenda(results2);
              results1=results2.length;
              k++;
            }
            else if( results1==results2.length && z==k){
              setArenda(results2);
              results1=results2.length
              k++
              z=k
            }
            else if(results1==results2.length && z<k){
              Arenda.push(results2);
              results1=results2.length
              k++
              z=k
            }
        }
        
    }

    // filter priceMin,rayon,metro,checkbox
    else if (filterRayon.textContent !== "Выберите" && filterSleepPlaces.textContent == "Выберите" && 
    filterMetro.textContent !=="Выберите" && checkboxInputValue.value !== "" && (priceMin!==null && priceMax!==null) && filterRooms.textContent=="Выберите"){
      const lengthResult = data.filter((item)=>(item.options[0].name.length!==0));
      for (let i=0; i<lengthResult.length;i++){
        if(Number(priceMax) > Number(priceMin)){
          results2 = data.filter((item)=>
          (((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1) && (Number(item.sent)>Number(priceMin) && Number(priceMax)>Number(item.sent)) &&
          (item.rayon==(filterRayon.textContent + " р.")) && (item.metro==(filterMetro.textContent))));
        }
        else{
          results2 = data.filter((item)=>
          (((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1) && (Number(item.sent)>=Number(priceMax) && Number(priceMin)>=Number(item.sent)) &&
          (item.rayon==(filterRayon.textContent + " р.")) && (item.metro==(filterMetro.textContent))));
        }    
          // Uslovia proverki podlennosti
          if(results1<results2.length && k==z){ //Main dlya 1 elementa
            setArenda(results2);
            results1=results2.length;
            k++;
          }
          else if( results1==results2.length && z==k){
            setArenda(results2);
            results1=results2.length
            k++
            z=k
          }
          else if(results1==results2.length && z<k){
            Arenda.push(results2);
            results1=results2.length
            k++
            z=k
          }
      }
    }

    // filter priceMin,sleepPlaces,metro,checkbox
    else if (filterRayon.textContent == "Выберите" && filterSleepPlaces.textContent !== "Выберите" && 
    filterMetro.textContent !=="Выберите" && checkboxInputValue.value !== "" && (priceMin!==null && priceMax!==null) && filterRooms.textContent=="Выберите"){
      const lengthResult = data.filter((item)=>(item.options[0].name.length!==0));
      for (let i=0; i<lengthResult.length;i++){
        if(Number(priceMax) > Number(priceMin)){
          results2 = data.filter((item)=>
          (((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1) && (item.options[0].sleepPlaces==(filterSleepPlaces.textContent)) && 
          (item.metro==(filterMetro.textContent)) && (Number(item.sent)>Number(priceMin) && Number(priceMax)>Number(item.sent))));
        }
        else{
          results2 = data.filter((item)=>
          (((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1) && (item.options[0].sleepPlaces==(filterSleepPlaces.textContent)) && 
          (item.metro==(filterMetro.textContent)) && (Number(item.sent)>=Number(priceMax) && Number(priceMin)>=Number(item.sent))));
        }    
          // Uslovia proverki podlennosti
          if(results1<results2.length && k==z){ //Main dlya 1 elementa
            setArenda(results2);
            results1=results2.length;
            k++;
          }
          else if( results1==results2.length && z==k){
            setArenda(results2);
            results1=results2.length
            k++
            z=k
          }
          else if(results1==results2.length && z<k){
            Arenda.push(results2);
            results1=results2.length
            k++
            z=k
          }
      }
    }

    // //////////////////////////////////////////
    
    // 5 elementov v summe

    // filter 4 elementa + rooms
    else if (filterRayon.textContent !== "Выберите" && filterSleepPlaces.textContent !== "Выберите" && 
    filterMetro.textContent !=="Выберите" && checkboxInputValue.value !== "" && (priceMin==null && priceMax==null) && filterRooms.textContent!=="Выберите"){
      const lengthResult = data.filter((item)=>(item.options[0].name.length!==0));
      for (let i=0; i<lengthResult.length;i++){
        results2 = data.filter((item)=>
          (((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1) && (item.rayon==(filterRayon.textContent + " р.")) && 
          (item.metro==(filterMetro.textContent)) && (item.options[0].sleepPlaces==(filterSleepPlaces.textContent)) && (item.rooms==(filterRooms.textContent.substring(0,6)+"."))));
          // Uslovia proverki podlennosti
          if(results1<results2.length && k==z){ //Main dlya 1 elementa
            setArenda(results2);
            results1=results2.length;
            k++;
          }
          else if( results1==results2.length && z==k){
            setArenda(results2);
            results1=results2.length
            k++
            z=k
          }
          else if(results1==results2.length && z<k){
            Arenda.push(results2);
            results1=results2.length
            k++
            z=k
          }
      }
    }

    // filter 4 elementa + priceMin
    else if (filterRayon.textContent !== "Выберите" && filterSleepPlaces.textContent !== "Выберите" && 
    filterMetro.textContent !=="Выберите" && checkboxInputValue.value !== "" && (priceMin!==null && priceMax!==null) && filterRooms.textContent=="Выберите"){
      const lengthResult = data.filter((item)=>(item.options[0].name.length!==0));
      for (let i=0; i<lengthResult.length;i++){
        if(Number(priceMax) > Number(priceMin)){
          results2 = data.filter((item)=>
          (((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1) && (item.rayon==(filterRayon.textContent + " р.")) && 
          (item.metro==(filterMetro.textContent)) && (item.options[0].sleepPlaces==(filterSleepPlaces.textContent)) && (Number(item.sent)>Number(priceMin) && Number(priceMax)>Number(item.sent))));
        }
        else{
          results2 = data.filter((item)=>
          (((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1) && (item.rayon==(filterRayon.textContent + " р.")) && 
          (item.metro==(filterMetro.textContent)) && (item.options[0].sleepPlaces==(filterSleepPlaces.textContent)) && (Number(item.sent)>=Number(priceMax) && Number(priceMin)>=Number(item.sent))));
        }    
          // Uslovia proverki podlennosti
          if(results1<results2.length && k==z){ //Main dlya 1 elementa
            setArenda(results2);
            results1=results2.length;
            k++;
          }
          else if( results1==results2.length && z==k){
            setArenda(results2);
            results1=results2.length
            k++
            z=k
          }
          else if(results1==results2.length && z<k){
            Arenda.push(results2);
            results1=results2.length
            k++
            z=k
          }
      }
    }
    
    // //////////////////////////////////////////

    // VSE ELEMENTI
    else if (filterRayon.textContent !== "Выберите" && filterSleepPlaces.textContent !== "Выберите" && 
    filterMetro.textContent !=="Выберите" && checkboxInputValue.value !== "" && (priceMin!==null && priceMax!==null) && filterRooms.textContent!=="Выберите"){
      const lengthResult = data.filter((item)=>(item.options[0].name.length!==0));
      for (let i=0; i<lengthResult.length;i++){
        if(Number(priceMax) > Number(priceMin)){
          results2 = data.filter((item)=>
          (((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1) && (item.rayon==(filterRayon.textContent + " р.")) && 
          (item.metro==(filterMetro.textContent)) && (item.options[0].sleepPlaces==(filterSleepPlaces.textContent)) && (Number(item.sent)>Number(priceMin) && Number(priceMax)>Number(item.sent)) && (item.rooms==(filterRooms.textContent.substring(0,6)+"."))));
        }
        else{
          results2 = data.filter((item)=>
          (((checkboxInputValue.value).split(",").indexOf(item.options[0].name[i])!==-1) && (item.rayon==(filterRayon.textContent + " р.")) && 
          (item.metro==(filterMetro.textContent)) && (item.options[0].sleepPlaces==(filterSleepPlaces.textContent)) && (Number(item.sent)>=Number(priceMax) && Number(priceMin)>=Number(item.sent)) && (item.rooms==(filterRooms.textContent.substring(0,6)+"."))));
        }    
          // Uslovia proverki podlennosti
          if(results1<results2.length && k==z){ //Main dlya 1 elementa
            setArenda(results2);
            results1=results2.length;
            k++;
          }
          else if( results1==results2.length && z==k){
            setArenda(results2);
            results1=results2.length
            k++
            z=k
          }
          else if(results1==results2.length && z<k){
            Arenda.push(results2);
            results1=results2.length
            k++
            z=k
          }
      }
    }
  }
  }
} 
  },[results])
}