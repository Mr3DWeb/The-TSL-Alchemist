import { Canvas } from '@react-three/fiber';
import ReactLenis from 'lenis/react';
import CustomScrollbar from './components/UI/CustomScrollbar/CustomScrollbar';
import Overlay from './components/UI/Overlay';
import Scene from './components/Canvas/Scene';
import Loader from './components/UI/Loader/Loader';

function App() {
  return (
    <>
    <Loader />
    
      <ReactLenis root autoRaf={false} options={{lerp:0.05}}>
        <div className="canvasWarpper">
          <Canvas>
            <Scene />
          </Canvas>
        </div>

        <Overlay />

        <CustomScrollbar />
      </ReactLenis>
    </>
  );
}

export default App;
