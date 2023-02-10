let Massive = [];
let Massive3 = [];
let Massive2;
export default function ClickCheckbox(value){
  const input = document.getElementById("checkboxInputValue");
  document.querySelectorAll(".checkBoxOptions").forEach((checkbox)=>{
    if (value=="" || input.value=="") {
      Massive = []
    }

    if(checkbox.checked==true && checkbox.id == `checkbox${value}`){
        Massive.push(checkbox.value.replace(/\s/g, ""));
    }

    else if (checkbox.checked==false && checkbox.id ==`checkbox${value}` ){
      for (let i = 0; i < Massive.length; i++) {
        if(Massive[i]==checkbox.value||Massive[i]==checkbox.value.replace(/\s/g, "")){
          Massive.splice(i,1);
        }
      }
    }
      input.value = Massive;
  })

  const input2 = document.getElementById("checkboxInputValue_module");
  document.querySelectorAll(".checkBoxOptions2").forEach((checkbox)=>{
    if (value=="" || input2.value=="") {
      Massive3 = []
    }

    if(checkbox.checked==true && checkbox.id == `checkbox_module${value}`){
        Massive3.push(checkbox.value.replace(/\s/g, ""));
    }

    else if (checkbox.checked==false && checkbox.id ==`checkbox_module${value}` ){
      for (let i = 0; i < Massive3.length; i++) {
        if(Massive3[i]==checkbox.value||Massive3[i]==checkbox.value.replace(/\s/g, "")){
          Massive.splice(i,1);
        }
      }
    }
      input2.value = Massive3;
  })

  const input3 = document.getElementById("checkboxInputValue_moduleChange");
  if(input3!==null){
    if (input3.value!==""){
    Massive2=input3.value.split(",");
    }
    else{
      Massive2=[];
    }

    document.querySelectorAll(".checkBoxOptions3").forEach((checkbox)=>{ 
      if (checkbox.checked==true && checkbox.id == `checkbox_moduleChange${value}`){
        Massive2.push(checkbox.value.replace(/\s/g, ""));
      }


      else if (checkbox.checked==false && checkbox.id ==`checkbox_moduleChange${value}` ){
        for (let i = 0; i < Massive2.length; i++) {
          if(Massive2[i]==checkbox.value||Massive2[i]==checkbox.value.replace(/\s/g, "")){
            Massive2.splice(i,1);
          }
        }
      }
        input3.value = Massive2;
    }
  )}
}
    
