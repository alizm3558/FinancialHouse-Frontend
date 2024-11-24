import React from "react";
import JsonViewer from "./components/JsonViewer";

function App() {
  return (
    <div className="App">
      {/* JsonViewer yalnızca bir kez çağrılıyor */}
      <JsonViewer />
    </div>
  );
}

export default App;
