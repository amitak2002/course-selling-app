
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import { ToastContainer, toast } from 'react-toastify';
import Courses from './components/Courses.jsx';
import Buy from './components/Buy.jsx';
import Purchase from './components/Purchases.jsx';
import AdminSignup from './admin/AdminSignup.jsx';
import AdminSignin from './admin/AdminSignin.jsx';
import AdminDashboard from './admin/AdminDashboard.jsx';
import CreateCourse from './admin/CreateCourse.jsx';
import UpdateCourse from './admin/UpdateCourse.jsx';
import OurCourses from './admin/OurCourses.jsx';
import {Navigate} from 'react-router-dom';




function App() {

  const admin = JSON.parse(localStorage.getItem('admin'))
  const user = JSON.parse(localStorage.getItem('user'))

  return (
    <>
    <ToastContainer position='top-center'/>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* {other} */}

      <Route path='/courses' element={<Courses/>}/>
      <Route path='/buy/:courseId' element={<Buy/>}/>
      <Route path='/purchases' element={ user ? <Purchase/> : <Navigate to={"/login"}/>}/>

      {/* admin Routes */}
      <Route path='/admin/signup' element={<AdminSignup/>}/>
      <Route path='/admin/signin' element={<AdminSignin/>}/>
      <Route path='/admin/dashboard' element={admin ? <AdminDashboard/> : <Navigate to={"/admin/signin"}/>}/>
      <Route path='/admin/create-course' element={<CreateCourse/>}/>
      <Route path='/admin/update-course/:courseId' element={<UpdateCourse/>}/>
      <Route path='/admin/our-courses' element={<OurCourses/>}/>
    </Routes>

    

    </>
  );
}

export default App;
