import React, { useEffect, useState } from 'react';
import logo from '../../public/logo.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { BACKEND_URL } from '../assets/backendurl.js';




function AdminDashboard() {
  const navigate = useNavigate();
  const [adminLogin, setAdminLogin] = useState(false);

  const admin = JSON.parse(localStorage.getItem('admin'));

  useEffect(() => {
    
    if (!admin || !admin.token) {
      setAdminLogin(false)
      setTimeout(() => (navigate('/admin/signin')) , 4000)
      toast.error('Please login first', { autoClose: 1000 });
      console.log('admin is login : ',admin)
      return;
    } else {
      setAdminLogin(true);
    }
  }, []);

  const logOutAdminHandle = async () => {
    const admin = JSON.parse(localStorage.getItem('admin'));
    if (!admin) {
      toast.error("Please login first", { autoClose: 1000 });
      setTimeout(() => (
        navigate('/admin/signin')
      ), 4000);
      return;
    }

    if (admin){
      localStorage.removeItem("admin")
      toast.success("logout admin" , {autoClose : 1000})
      setAdminLogin(false)
      setTimeout(() => (navigate("/admin/signin")) , 4000)
    }
    
  };

  
  return (
    <>
      <ToastContainer position='top-center' />
      <div className='flex h-screen w-full bg-slate-100'>
        
        <div className='w-[20%] h-[100%] bg-slate-200'>
          <div className='h-[30%] flex justify-center items-center flex-col py-4 '>
            <img src={logo} className='h-[90px] w-[90px] rounded-full '/>
            <h1 className='my-2 font-extrabold text-2xl'>I ,'am_Admin_</h1>
          </div>
          <div className='w-full h-[70%] flex justify-top items-center flex-col'>
            
              <div className='w-[80%]  bg-green-400 py-2 flex justify-center items-center my-4 rounded-md hover:cursor-pointer'>
                <Link to="/admin/our-courses" className='  font-extrabold'>our courses</Link>
              </div>

              <div className='w-[80%] bg-yellow-400 my-2 py-2 flex justify-center items-center rounded-md hover:cursor-pointer'>
                <Link to="/admin/create-course" className='  font-extrabold'>create courses</Link>
              </div>

              <div className='w-[80%] bg-orange-400 my-2 py-2 flex justify-center items-center rounded-md hover:cursor-pointer'>
                <Link to="/#" className='  font-extrabold'>home</Link>
              </div>

              <div className='w-[80%] bg-red-400 my-2 py-2 flex justify-center items-center rounded-md hover:cursor-pointer'>
                {(adminLogin) ? <button onClick={logOutAdminHandle}  className=' font-extrabold'>LogOut</button> : <button onClick={() => navigate('/admin/signin')}  className=' font-extrabold'>LogIn</button>

                }
              </div>
            
          </div>
        </div>
        <div className='w-[80%] h-full' >
          <main> </main>
        </div>
      </div>
    </>
  )
}

export default AdminDashboard