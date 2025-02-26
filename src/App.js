import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './Wa-Frontend/Wa-Frontend.css';
import './Wa-Frontend/Wa-MediaQuerys.css';
import Home from "./Wa-Frontend/Home";
import Navlayout from "./Wa-Frontend/NavLayout";
import TopNav from "./Wa-Frontend/TopNav";
import Footer from "./Wa-Frontend/Footer";
import CheckoutForm from './components/CheckoutForm';
import MenuPage from './components/MenuPage';
import NoPage from './NoPage';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Company from "./components/Company page/Company";
import PaymentComponent from "./components/PaymentComponent";
import SupplierPayments from "./components/SupplierPayments";
import Contract from "./components/Company page/Contract";
import Depot from "./components/Company page/Depot";
import Vehicle from "./components/Company page/Vehicle";  
import Success from "./components/Company page/Success";
// Stripe key
const stripePromise = loadStripe('pk_test_51P4GXaAvL6Jnl0r3yHDSV2zN0JrGRt2UFxn217kqw9JFFBXe4K1n5xZHGfsKaIicVfUBAP5ch0TBIO8C8cI3ijQv00bNWJynzK');

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <TopNav />
        <Routes>
          <Route element={<Navlayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/menu/:menuName" element={<MenuPage />} />
            <Route path="/company" element={<Company />} />
            <Route path="/contract" element={<Contract />} />
            <Route path="/depot" element={<Depot />} />
            <Route path="/vehicle" element={<Vehicle />} />
            {/* <Route path="/supplier_payments" element={<SupplierPayments />} /> */}
            <Route path="/success" element={<Success />} />
          </Route>
          
          {/* Payment Routes */}
          <Route 
            path="/checkout" 
            element={
              <Elements stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            } 
          />
          <Route 
            path="/admin/stripe/checkout/success" 
            element={
              <Elements stripe={stripePromise}>
                <PaymentComponent />
              </Elements>
            } 
          />

          {/* 404 Route */}
          <Route path="*" element={<NoPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
