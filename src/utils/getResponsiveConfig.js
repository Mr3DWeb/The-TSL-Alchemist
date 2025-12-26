export function getResponsiveConfig(){
  const witdh = window.innerWidth;
  const isMobile = witdh < 768;

  return{
    starCount : isMobile ? 600 : 2000,
    starSize : isMobile ? 0.12 : 0.1
  }
}