// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import ExpressionDetector from "./components/face-expression";
import MoodSongs from "../src/components/Songs";
function App() {
  // const [count, setCount] = useState(0);

  return (
    <>
      <ExpressionDetector />
      <MoodSongs />
    </>
  );
}

export default App;
