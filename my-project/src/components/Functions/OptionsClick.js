export default function OptionsClick(value){
  const options = document.querySelector(".Options");
  const DopOptions = document.querySelector(".DopOptions");
  if (options!==null && value==true){
    options.classList.toggle("active");
    DopOptions.classList.toggle("active");
  }
  if(value==false && options!==null ){
    options.classList.remove("active")
  }
}
