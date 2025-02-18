import React, { useEffect, useState } from "react";
import logo from "../../public/logo.jpg";
import { Link } from "react-router-dom";
import { FaSquareInstagram, FaSquareFacebook, FaSquareTwitter } from "react-icons/fa6";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";



function Home() {

  const [courses, setCourses] = useState([]);
  console.log(courses);
  const [isLoggedIn , setIsLogIn] = useState(false)
  const navigate = useNavigate()

  useEffect(()=> {
    const user = localStorage.getItem('user')
    console.log('user ',user)
    console.log(isLoggedIn)
    if (user) {
      setIsLogIn(true)
    }else{
      setIsLogIn(false)
    }
    // localStorage.removeItem('user')
  } , [])


  const handleLogout = async () => {
    
    const user = JSON.parse(localStorage.getItem('user'))
    const token = user.token
    
    if (!token){
      toast.error('please login user' , {autoClose : 1000})
      return;
    }

    localStorage.removeItem("user")
    toast.success("logout user" , {autoClose : 1000})
    setIsLogIn(false)
  }

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay : true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  console.log(isLoggedIn)
  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:2002/api/v1/courses/allcourses", {
        withCredentials: true,
      });
      console.log(response.data);
      setCourses(response.data);
    } catch (error) {
      console.log("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <>
    <ToastContainer position="top-center"/>
      <div className="bg-gradient-to-r from-black to-blue-900 min-h-screen">
        <div className="text-white container mx-auto">
          {/* Header */}
          <header className="flex justify-between items-center container mx-auto py-6">
            <div className="flex items-center">
              <img src={logo} alt="Logo" className="h-[50px] w-[70px] rounded-md" />
              <h1 className="font-poppins text-2xl mx-4 text-orange-600 font-bold">Course_Seller</h1>
            </div>
            
            <div className="flex items-center">
            <Link to={"/admin/dashboard"} className="border-2 border-white mx-2 py-2 px-4 rounded-md font-bold hover:bg-orange-600 transition duration-300">Admin</Link>
            </div>
            
            <div className="flex items-center">
              {isLoggedIn ? (<button  onClick={handleLogout} className="border-2 border-white mx-2 py-2 px-4 rounded-md font-bold hover:bg-orange-600 transition duration-300">
                Logout
              </button>) : (<>
                <Link to="/login" className="border-2 border-white mx-2 py-2 px-4 rounded-md font-bold hover:bg-orange-600 transition duration-300">
                Login
              </Link>
              <Link to="/signup" className="border-2 border-white mx-2 py-2 px-4 rounded-md font-bold hover:bg-orange-600 transition duration-300">
                Signup
              </Link>
              </>)}
            </div>
          </header>

          {/* Main Content */}
          <main className="flex flex-col items-center">
            {/* Hero Section */}
            <section className="my-4 text-center">
              <h1 className="font-bold text-4xl">Course_Selling_</h1>
              <p className="my-4 text-2xl font-thin">Buy Courses and become proficient in your field_</p>
              <div className="flex space-x-4 justify-center font-bold text-[15px]">
                <Link to={"/courses"} className="border-2 rounded-md py-3 px-10 text-[17px] bg-green-500 text-black hover:bg-white hover:text-red-600 transition duration-300">
                  Explore Courses
                </Link>
                <Link  to={'https://www.youtube.com/@LearnCodingOfficial'} className="border-2 rounded-md py-3 px-10 text-[17px] bg-green-500 text-black hover:bg-white hover:text-red-600 transition duration-300">
                  Create Videos
                </Link>
              </div>
            </section>

            {/* Courses Slider */}
            <section className="w-full px-4 my-6 ">
            <Slider {...settings}>
              {courses.map((course) => (
                <div key={course._id} className="p-4 ">
                  <div className="bg-white text-black rounded-lg shadow-lg overflow-hidden border-2">
                    <div>
                      <img
                        src={course?.image?.url || ""}
                        alt="Course Image"
                        className="w-full h-[250px] object-cover"
                      />
                    </div>
                    <div className="p-4 text-center ">
                      <h2 className="text-2xl font-extrabold">{course.title}</h2>
                      <p className="font-extrabold">{(course.description).slice(0,18)+".."}</p>
                      <button className="border-1 px-4 py-2 rounded-md my-2 bg-orange-600 text-white hover:bg-green-600 hover:text-white font-bold"
                      onClick={() => navigate("/courses")}
                      >Enroll Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
        </section>
          </main>

          {/* Footer */}
          <hr className="my-4 border-white" />
          <footer className="container mx-auto py-8 grid grid-cols-1 md:grid-cols-3 text-center md:text-left gap-8">
            {/* Logo and Socials */}
            <div className="flex flex-col items-center">
              <img src={logo} alt="Logo" className="h-[60px] w-[80px] rounded-md" />
              <h1 className="font-bold text-2xl text-orange-500 my-2">Course_Seller</h1>
              <h2 className="font-semibold">Follow Us On</h2>
              <div className="flex space-x-4 mt-2">
                <FaSquareInstagram className="text-2xl hover:bg-pink-700 transition duration-300 cursor-pointer" />
                <FaSquareFacebook className="text-2xl hover:bg-blue-700 transition duration-300 cursor-pointer" />
                <FaSquareTwitter className="text-2xl hover:bg-blue-400 transition duration-300 cursor-pointer" />
              </div>
            </div>

            {/* Connect Links */}
            <div className="flex flex-col items-center">
              <h1 className="font-extrabold my-2">Connect</h1>
              <p>📺 YouTube - Learn Code</p>
              <p>📢 Telegram - Learn Code</p>
              <p>💻 GitHub - Learn Code</p>
            </div>

            {/* Copyright & Policies */}
            <div className="flex flex-col items-center">
              <h1 className="font-extrabold my-2">© 2024 Course_Seller</h1>
              <p>📜 Terms & Conditions</p>
              <p>🔒 Privacy Policy</p>
              <p>💳 Refund & Cancellation</p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

export default Home;
