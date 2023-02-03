import React from "react"
import ContentLoader from "react-content-loader"

const advertisementSkeleton = (props) => (
  <ContentLoader 
    speed={2}
    width={426}
    height={526}
    viewBox="0 0 426 526"
    backgroundColor="#f3f3f3"
    backgroundOpacity={1}
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="5" ry="5" width="426" height="238" /> 
    <rect x="14" y="252" rx="5" ry="5" width="122" height="40" /> 
    <rect x="154" y="255" rx="20" ry="20" width="256" height="35" /> 
    <rect x="15" y="315" rx="5" ry="5" width="258" height="21" /> 
    <rect x="16" y="350" rx="10" ry="10" width="119" height="23" /> 
    <rect x="150" y="350" rx="10" ry="10" width="119" height="23" /> 
    <rect x="12" y="395" rx="10" ry="10" width="400" height="68" /> 
    <rect x="17" y="490" rx="20" ry="20" width="35" height="33" /> 
    <rect x="57" y="490" rx="20" ry="20" width="35" height="33" /> 
    <rect x="140" y="490" rx="11" ry="11" width="131" height="33" /> 
    <rect x="280" y="490" rx="11" ry="11" width="131" height="33" /> 
    <rect x="0" y="524" rx="3" ry="3" width="669" height="5" />
    <rect x="423" y="0" rx="3" ry="3" width="3" height="800" />
    <rect x="0" y="0" rx="3" ry="3" width="3" height="800" />
    
  </ContentLoader>
  

  
)

export default advertisementSkeleton