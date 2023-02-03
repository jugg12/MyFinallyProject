import React from "react"
import ContentLoader from "react-content-loader"

const testAdvertisementSkeleton = (props) => (
  <ContentLoader 
    speed={2}
    width="100%"
    height="100%"
    viewBox="0 0 1080 1920"
    backgroundColor="#f3f3f3"
    backgroundOpacity={1}
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="465" y="25" rx="5" ry="5" width="160" height="15" /> 
    <rect x="300" y="40" rx="5" ry="5" width="100" height="15" /> 
    <rect x="300" y="65" rx="5" ry="5" width="350" height="30" /> 
    <rect x="580" y="105" rx="5" ry="5" width="200" height="20" /> 
    <rect x="300" y="105" rx="5" ry="5" width="110" height="20" /> 
    <rect x="305" y="140" rx="5" ry="5" width="475" height="320" /> 
    <rect x="305" y="480" rx="5" ry="5" width="475" height="45" /> 
    <rect x="0" y="585" rx="5" ry="5" width="1920" height="437" /> 
    
  </ContentLoader>
  

  
)

export default testAdvertisementSkeleton