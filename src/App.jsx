import ReactLenis from 'lenis/react';
import Experience from './components/Layout/Experience';
//import Loader from './components/UI/Loader/Loader';

function App() {
  return (
    <>
      <ReactLenis root autoRaf={false} options={{lerp:0.05}}>
        <Experience />
      </ReactLenis>
    </>
  );
}

export default App;
