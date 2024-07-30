import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Market from "./Pages/Market";
import { HashRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import gsap from "gsap";


function App() {
  return (
    <>
    <BrowserRouter>
     <Navbar/>
      <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/market" element={<Market/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}
export default App;
