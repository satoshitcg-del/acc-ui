import React from 'react'
import * as loadingData from "@/assets/loading/loading.json";
import { useLottie } from "lottie-react";

const Loading = () => {

  const options = {
    animationData: loadingData.default,
    loop: true,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };
   
  const { View } = useLottie(options);

  return (
      View 
  )
}

export default Loading
