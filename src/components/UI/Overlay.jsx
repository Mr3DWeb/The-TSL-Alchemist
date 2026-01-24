import HeroSection from './Sections/Hero/HeroSection';
import ScentSection from './Sections/Scent/ScentSection';
import PersonaSection from './Sections/Persona/PersonaSection';
import CTASection from './Sections/CTA/CTASection';
import './Overlay.css';


function Overlay(){
  return(
    <main id='Overlay'>
      <HeroSection />
      <ScentSection />
      <PersonaSection />
      <CTASection />
    </main>
  )
}

export default Overlay;