
import React, {useState} from 'react';
  
const ScrollButton = () =>{
  
  const [visible, setVisible] = useState(false)
  
  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 150){
      setVisible(true)
    } 
    else if (scrolled <= 150){
      setVisible(false)
    }
  };
  
  const scrollToTop = () =>{
    window.scrollTo({
      top: 0, 
      behavior: 'smooth'
    });
  };
  
  window.addEventListener('scroll', toggleVisible);
  
  return (
    <button onClick={scrollToTop} className={visible?"scrollUp visible":"scrollUp"} >
       <svg height="48" viewBox="0 0 48 48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M14.83 30.83l9.17-9.17 9.17 9.17 2.83-2.83-12-12-12 12z"/><path d="M0 0h48v48h-48z" fill="none"/></svg>
    </button>
  );
}
  
export default ScrollButton;