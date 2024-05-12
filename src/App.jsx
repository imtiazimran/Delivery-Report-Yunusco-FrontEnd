import { Outlet } from 'react-router-dom'
import './App.css'
import Home from './Components/Home'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'

function App() {


  return (
    <div className=' '>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default App
