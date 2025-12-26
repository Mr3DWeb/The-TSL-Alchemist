import { useState , useEffect } from "react";

export function useQuality(){
  const [isHighQuality , setIsHighQuality ] = useState(true) ;
  useEffect(()=>{
    const isMobile = window.innerWidth < 768;
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    if (isMobile && hardwareConcurrency < 4 ){
      setIsHighQuality(false);
    }else{
      setIsHighQuality(true);
    }
  },[])
  return isHighQuality;
}