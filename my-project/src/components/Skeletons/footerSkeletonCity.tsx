import React from "react"
import ContentLoader from "react-content-loader"

const footerItemsCitySkeleton = (props) => (
  <ContentLoader 
    speed={2}
    width="135px"
    height="17px"
    viewBox="0 0 135 17"
    backgroundColor="#f3f3f3"
    backgroundOpacity={1}
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="5" ry="5" width="135" height="17" /> 
    
  </ContentLoader>
  

  
)

export default footerItemsCitySkeleton