import React from "react"
import ContentLoader from "react-content-loader"

const newsHomePage = (props) => (
  <ContentLoader 
    speed={2}
    width="100%"
    height="465px"
    viewBox="0 0 360 465"
    backgroundColor="#f3f3f3"
    backgroundOpacity={1}
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect key={"1"} x="0" y="0" rx="5" ry="5" width="117px" height="25px" /> 
    <rect key={"2"} x="0" y="65" rx="5" ry="5" width="360px" height="56px" /> 
    <rect key={"3"} x="0" y="136" rx="5" ry="5" width="360px" height="56px" /> 
    <rect key={"4"} x="0" y="206" rx="5" ry="5" width="360px" height="56px" /> 
    <rect key={"5"} x="0" y="276" rx="5" ry="5" width="360px" height="56px" /> 
    <rect key={"6"} x="0" y="346" rx="5" ry="5" width="360px" height="56px" /> 
    <rect key={"7"} x="0" y="434" rx="5" ry="5" width="117px" height="20px" /> 
  </ContentLoader> 
  
)

export default newsHomePage