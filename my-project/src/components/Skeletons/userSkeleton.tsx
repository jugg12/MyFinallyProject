import React from "react"
import ContentLoader from "react-content-loader"

const userSkeleton = (props) => (
  <ContentLoader 
    speed={2}
    width="30px"
    height="30px"
    viewBox="0 0 30 30"
    backgroundColor="#ecebeb"
    backgroundOpacity={1}
    foregroundColor="#d6d5d5d6"
    {...props}
  >
    <rect x="0" y="0" rx="20" ry="20" width="30" height="30" /> 
  </ContentLoader>
)

export default userSkeleton