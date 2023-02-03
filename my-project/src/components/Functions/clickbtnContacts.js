export default function btnclick(value){
document.querySelectorAll(".dropdownContacts").forEach(function(dropdownWrapper){
  const btn = dropdownWrapper.querySelector(".ContactsBtn");
  const btn2 = dropdownWrapper.querySelector(".ContactsBtnNoText");
  const inform=dropdownWrapper.querySelector(".informContacts")
  if ((inform.id==value)){
    inform.classList.toggle("informContacts__visible")
  }
 
  document.addEventListener('click',(e)=>{
    if(e.target !== btn && e.target !== btn2){
      inform.classList.remove("informContacts__visible");
    }
  })
})


}