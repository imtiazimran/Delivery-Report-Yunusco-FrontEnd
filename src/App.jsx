import { Outlet } from 'react-router-dom'
import './App.css'
import Home from './Components/Home'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import React, { useEffect } from 'react';

function App() {

  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '924767752698755',
        cookie: true,
        xfbml: true,
        version: 'v13.0'
      });
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }, []);



  return (
    <div className=' '>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default App
