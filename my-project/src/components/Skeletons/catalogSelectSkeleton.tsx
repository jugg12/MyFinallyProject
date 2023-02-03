import React from "react"
import ContentLoader from "react-content-loader"

const catalogSelectSkeleton = (props) => (
  <ContentLoader 
    speed={2}
    width="1920px"
    height="1500px"
    viewBox="0 0 1920 1500"
    backgroundColor="#f3f3f3"
    backgroundOpacity={1}
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="525" y="45" rx="5" ry="5" width="450" height="15" /> 
    <rect x="525" y="90" rx="5" ry="5" width="800" height="55" /> 
    <rect x="1000" y="180" rx="10" ry="10" width="370" height="30" /> 
    <rect x="525" y="180" rx="10" ry="10" width="140" height="30" /> 
    <rect x="525" y="245" rx="5" ry="5" width="840" height="565" /> 
    <rect x="525" y="840" rx="5" ry="5" width="840" height="100" /> 
    <rect x="0" y="970" rx="5" ry="5" width="1920" height="437" /> 
    
  </ContentLoader>

)

export default catalogSelectSkeleton