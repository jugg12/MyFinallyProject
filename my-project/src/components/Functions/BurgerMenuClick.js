export default function burgerMenu(){
  const burger = document.querySelector(".burgerMenu__box");
  const line1 = document.querySelector(".line1");
  const line2 = document.querySelector(".line2");
  const line3 = document.querySelector(".line3");
  if (burger!==undefined){
    burger.classList.toggle("active")
  }
  if(line1){
    line1.classList.toggle("active");
    line2.classList.toggle("active");
    line3.classList.toggle("active");
  }
}
  
  
  
   
      
  
   