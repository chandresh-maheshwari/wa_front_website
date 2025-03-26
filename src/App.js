// import { BrowserRouter, Routes, Route } from "react-router-dom";
// // css file
// import './Wa-Frontend/Wa-Frontend.css';
// import './Wa-Frontend/Wa-MediaQuerys.css';
// //import other files
// import Home from "./Wa-Frontend/Home";
// import Navlayout from "./Wa-Frontend/NavLayout";
// import TopNav from "./Wa-Frontend/TopNav";
// import Footer from "./Wa-Frontend/Footer";
// // import About from "./Wa-Frontend/Aboutus/Aboutus";
// // import Contact from "./Wa-Frontend/Contactus/Contact us";
// // import OurProducts from "./Wa-Frontend/Our Products/OurProducts";
// import MenuPage from './components/MenuPage';
// import NoPage from './NoPage'; 




// function App() {
//   return (
//     <div className="App">

//       <BrowserRouter>
//         <TopNav />
//         <Routes>
//           <Route path="/" element={<Navlayout />}>
//             <Route path="/menu/:menuName" element={<MenuPage />} />
//             <Route index element={<Home />} />
//             <Route path="*" element={<NoPage />} />
//             {/* <Route path="About" element={<About />} />
//             <Route path="OurProducts" element={<OurProducts />} />
//             <Route path="Contact" element={<Contact />} /> */}
//           </Route>
//         </Routes>
//         <Footer />
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;



import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ls from "local-storage";
import './Wa-Frontend/Wa-Frontend.css';
import './Wa-Frontend/Wa-MediaQuerys.css';
import Home from "./Wa-Frontend/Home";
// import Navlayout from "./Wa-Frontend/NavLayout";
import TopNav from "./Wa-Frontend/TopNav";
import Footer from "./Wa-Frontend/Footer";
import MenuPage from './components/MenuPage';
import NoPage from './NoPage';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';
import Company from "./components/companypage/Company";
import Contract from "./components/companypage/Contract";
import Depot from "./components/companypage/Depot";
import Vehicle from "./components/companypage/Vehicle";  
import Success from "./components/companypage/Success";
import Site from "./components/companypage/Site";

// const stripePromise = loadStripe('pk_test_51P4GXaAvL6Jnl0r3yHDSV2zN0JrGRt2UFxn217kqw9JFFBXe4K1n5xZHGfsKaIicVfUBAP5ch0TBIO8C8cI3ijQv00bNWJynzK');

function ProtectedRoute({ children }) {
  const isLoggedIn = ls('userData') !== null; 
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }
  return children;
}

function App() {
  const [lastScrollTop, setLastScrollTop] = useState(0);
// function updateScrollbarThumb() {
//     let body = document.body;
//     let html = document.documentElement;
    
//     // Calculate scrollable height
//     let scrollHeight = Math.max(body.scrollHeight, html.scrollHeight);
//     let clientHeight = Math.max(body.clientHeight, html.clientHeight);
    
//     // Calculate thumb height based on page size
//     let thumbHeight = Math.max(50, (clientHeight / scrollHeight) * clientHeight);
    
//     // Set thumb height dynamically
//     document.documentElement.style.setProperty('--thumb-height', `${thumbHeight}px`);
// }

// // Run on page load & resize
// window.addEventListener('load', updateScrollbarThumb);
// window.addEventListener('resize', updateScrollbarThumb);

// function updateScrollbarThumb() {
//   let body = document.body;
//   let html = document.documentElement;

//   // Calculate scrollable height
//   let scrollHeight = Math.max(body.scrollHeight, html.scrollHeight);
//   let clientHeight = Math.max(body.clientHeight, html.clientHeight);

//   // Calculate thumb height based on page size
//   let thumbHeight = Math.max(50, (clientHeight / scrollHeight) * clientHeight);
  
//   // Set thumb height dynamically
//   document.documentElement.style.setProperty('--thumb-height', `${thumbHeight}px`);

//   // Calculate the thumb position based on scroll
//   let scrollPosition = window.scrollY;
//   let thumbTop = (scrollPosition / (scrollHeight - clientHeight)) * (clientHeight - thumbHeight);
  
//   // Set the thumb's position dynamically
//   document.documentElement.style.setProperty('--thumb-top', `${thumbTop}px`);

//   // Adjust background position dynamically for scrolling effect
//   let thumbScrollPosition = (scrollPosition / (scrollHeight - clientHeight)) * 100;
//   document.documentElement.style.setProperty('--thumb-bg-position', `${thumbScrollPosition}%`);
// }

// // Call update function on scroll, resize, and load
// window.addEventListener('load', updateScrollbarThumb);
// window.addEventListener('resize', updateScrollbarThumb);
// window.addEventListener('scroll', updateScrollbarThumb);



  useEffect(() => {
    const handleScroll = () => {
        const currentScrollTop = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        
        // Add scroll direction classes
        if (currentScrollTop > lastScrollTop) {
            document.body.classList.add('scrolled-down');
            document.body.classList.remove('scrolled-top');
        } else {
            document.body.classList.add('scrolled-top');
            document.body.classList.remove('scrolled-down');
        }
        
        // Update scroll thumb position
        const scrollPercent = (currentScrollTop / maxScroll) * 100;
        document.documentElement.style.setProperty('--scroll-percent', `${scrollPercent}%`);
        
        setLastScrollTop(currentScrollTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  return (
    <div className="App">
      <BrowserRouter>
        <TopNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu/:menuName" element={<MenuPage />} />
          <Route path="/company" element={<ProtectedRoute><Company /></ProtectedRoute>} />
          <Route path="/contract" element={<ProtectedRoute><Contract /></ProtectedRoute>} />
          <Route path="/depot" element={<ProtectedRoute><Depot /></ProtectedRoute>} />
          <Route path="/vehicle" element={<ProtectedRoute><Vehicle /></ProtectedRoute>} />
          <Route path="/site" element={<ProtectedRoute><Site /></ProtectedRoute>} />
          <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
          <Route path="*" element={<NoPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;