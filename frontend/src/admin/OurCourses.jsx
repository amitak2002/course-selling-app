import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { BACKEND_URL } from '../assets/backendurl.js';


function OurCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const [loading , setLoading] = useState(true)

  let admin = JSON.parse(localStorage.getItem('admin'));
  let token = admin?.token; // Use optional chaining to avoid errors if admin is null

  useEffect(() => {
    setLoading(true)
    console.log(admin)
    if (!token) {
      console.log('please signin first admin');
      toast.error("first admin login", { autoClose: 1000 })
      setTimeout(() => {
        navigate('/admin/signin');
      }, 4000);
      return;
    }

    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/courses/allcourses`, { withCredentials: true });
        console.log(response.data);
        setCourses(response.data);

        if ((response.data).length == 0) {
          toast.error('No course in database' , {autoClose : 1000})
          setTimeout(() => (navigate("/admin/dashboard")) , 4000)
          return;
        }
        setLoading(false)
        toast.success("successfully fetched admin courses", { autoClose: 1000 });
        navigate("/admin/our-courses");
      } catch (error) {
        console.log('error comes at admin our courses.jsx : ', error);
        toast.error("error to fetch admin courses", { autoClose: 1000 });
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 4000);
      }
    };

    fetchCourses();
  }, []); // Add token and navigate to dependency array


  // handle logout
  const handleDelete = async (courseId) => {
    try {
      const response = await axios.delete(`${BACKEND_URL}/courses/delete/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      })

      console.log('deleted course is : ', response)
      const updatedCourses = courses.filter((course) => course._id !== courseId)
      setCourses(updatedCourses)
      console.log('updated course is : ', updatedCourses)
      toast.success("Course deleted successfully", { autoClose: 1000 })
    } catch (error) {
      console.log('error comes at deleted course admindashboard ', error)
      toast.error(error.response.data.errors, { autoClose: 1000 })
    }
  }  

  if (loading) {
    return <p className='font-extrabold text-2xl flex justify-center items-center'>Loading</p>
  }

  return (
    <>
      <ToastContainer position='top-center' />
      <Link to={"/admin/dashboard"} className='border-2 border-gray-300 bg-slate-700 px-4 py-2 mx-[46%] rounded-md  font-bold text-white hover:bg-pink-500 transition duration-700 hover:scale-x-50'>Dashboard</Link> 
      <main className='w-full h-screen flex justify-center items-start flex-wrap overflow-y-auto'>
        {courses.map((course) => (
          <div key={course._id} className='h-[59%] w-[22%] border-2 border-gray-400 transition duration-500 hover:scale-75 bg-slate-100 m-2 p-2 font-bold my-4 mx-4 overflow-hidden rounded-md'>
            <img src={course?.image?.url} alt={course.title} className='w-[350px] h-[300px]'/>
            <h3 className='my-2'>Title: {course.title}</h3>
            <div className='flex justify-between items-center w-full'>
              <p className='w-full overflow-hidden'>Description: {(course.description).slice(0,15)+".."}</p>
              <p className='text-red-500'>₹_
              {course.price}</p>
            </div>
            <div className='w-full my-2 flex justify-between items-center text-white'>
              <Link to={`/admin/update-course/${course._id}`} className='px-2 border-2 border-white py-2 rounded-md bg-green-500'>Update</Link>
              <button onClick = {() => handleDelete(course._id)} className='px-2 border-2 border-white py-2 rounded-md bg-red-500'>Delete</button>
            </div>
          </div>
        ))}
      </main>
    </>
  );
}

export default OurCourses;