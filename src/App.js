import KeyMonitor from "./component/KeyMonitor";
import "./App.css";
import { Strafe } from "./component/strafe";
import { useState } from "react";

function App() {
  const [showComponent, setShowComponent] = useState('KeyMonitor');

  const toggleComponent = () => {
    setShowComponent(prev => (prev === 'KeyMonitor' ? 'Strafe' : 'KeyMonitor'));
  };

  return (
    <div className="App">
      <button onClick={toggleComponent}>
        {showComponent === 'KeyMonitor' ? 'ストレイフ道場' : 'キーモニター'}
      </button>
      {showComponent === 'KeyMonitor' ? <KeyMonitor /> : <Strafe />}
    </div>
  );
}

export default App;
