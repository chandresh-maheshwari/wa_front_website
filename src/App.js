import { BrowserRouter, Routes, Route } from "react-router-dom";
// css file
import './Wa-Frontend/Wa-Frontend.css';
import './Wa-Frontend/Wa-MediaQuerys.css';
//import other files
import Home from "./Wa-Frontend/Home";
import Navlayout from "./Wa-Frontend/NavLayout";
import TopNav from "./Wa-Frontend/TopNav";
import Footer from "./Wa-Frontend/Footer";
// import About from "./Wa-Frontend/Aboutus/Aboutus";
// import Contact from "./Wa-Frontend/Contactus/Contact us";
// import OurProducts from "./Wa-Frontend/Our Products/OurProducts";
import MenuPage from './components/MenuPage';
import NoPage from './NoPage'; 




function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <TopNav />
        <Routes>
          <Route path="/" element={<Navlayout />}>
            <Route path="/menu/:menuName" element={<MenuPage />} />
            <Route index element={<Home />} />
            <Route path="*" element={<NoPage />} />
            {/* <Route path="About" element={<About />} />
            <Route path="OurProducts" element={<OurProducts />} />
            <Route path="Contact" element={<Contact />} /> */}
          </Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
