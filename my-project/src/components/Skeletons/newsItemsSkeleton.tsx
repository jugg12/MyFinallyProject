import React from "react"
import ContentLoader from "react-content-loader"

const newsItemSkeleton = (props) => (
  <ContentLoader 
    speed={2}
    width="100%"
    height={526}
    viewBox="0 0 426 526"
    backgroundColor="#f3f3f3"
    backgroundOpacity={1}
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="5" ry="5" width="426" height="238" /> 
    <rect x="14" y="272" rx="5" ry="5" width="400" height="30" />  
    <rect x="14" y="327" rx="5" ry="5" width="400" height="90" /> 
    <rect x="14" y="470" rx="11" ry="11" width="131" height="33" /> 
    <rect x="330" y="470" rx="11" ry="11" width="78" height="33" /> 
    <rect x="14" y="440" rx="5" ry="5" width="400" height="2" />
    <rect x="0" y="524" rx="5" ry="5" width="669" height="5" />
    <rect x="423" y="0" rx="5" ry="5" width="3" height="800" />
    <rect x="0" y="0" rx="3" ry="3" width="3" height="800" />
    
  </ContentLoader>
  

  
)

export default newsItemSkeleton