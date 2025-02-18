import React , {useState , useEffect} from 'react' 
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../public/logo.jpg'
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut, IoLogIn } from "react-icons/io5";
import {Link} from 'react-router-dom'
import {useNavigate} from 'react-router-dom'



function Purchase() {

  const [purchases , setPurchases] = useState([])
  const [isLoggedIn , setISLoggedIn] = useState(false)
  const [loading , setLoading] = useState(true)
  const navigate = useNavigate()
  console.log(purchases)

  // access token
  
  // fetch purchases course
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Check if user is not logged in
    if (!user) {
        setISLoggedIn(false);
        toast.error("please login first", { autoClose: 1000 }); // Show error toast
        setLoading(false); // Set loading to false immediately
        setTimeout(() => (
            navigate("/courses") // Navigate after 2 seconds
        ), 5000)
        return; // Exit the useEffect
    }

    const token = user.token;
    
    // Check if token is not present
    if (!token) {
        console.log('!token useeffect2');
        setISLoggedIn(false);
        toast.error("please login first", { autoClose: 200 }); // Show error toast
        setLoading(false); // Set loading to false immediately
        setTimeout(() => (
            navigate("/courses") // Navigate after 2 seconds
        ), 5000);
        return; // Exit the useEffect
    }

    // Fetch purchases if user is logged in
    const fetchPurchases = async () => {
        try {
            setLoading(true); // Start loading
            const response = await axios.get("http://localhost:2002/api/v1/user/purchase", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true,
            });
            console.log('purchased courses are: ', response.data.courseData);
            setPurchases(response.data.courseData);
            toast.success('Successfully fetched purchased courses', { autoClose: 1000 });
        } catch (error) {
            console.log('Error fetching purchases: ', error);
            toast.error(error.response.data.message, { autoClose: 1000 });
            setTimeout(() => (
                navigate('/courses') // Navigate after error
            ), 5000);
        } finally {
            setLoading(false); // End loading
        }
    };

    fetchPurchases(); // Call the fetch function
    setISLoggedIn(true); // Set logged in state to true
}, []); 

    //logout
    const handleLogout = async (e) => {
      e.preventDefault()
      try {
        setLoading(true)
          const response = await axios.get("http://localhost:2002/api/v1/user/logout" ,
            {withCredentials : true},
          )
          console.log(response.data)
          setTimeout(() => (setISLoggedIn(false)) , 2000)
          localStorage.removeItem("user")
          toast.success("log out successfully" , {autoClose : 2000})
          setTimeout(() => (navigate("/")) , 3000)  
      } 
      catch (error) {
        console.log('error comes at home.jsx in handlelogout ',error) 
        toast.error("error during log out") 
      }
    }

  return (
    <>
      <ToastContainer position='top-center'/>
      <aside className='w-64 bg-gray-100 h-screen p-5 fixed font-extrabold '>
        <div className='flex items-center mb-10'>
          <img src={logo} alt='profile' className='rounded-full h-12 w-12'/>
        </div>

        <nav>
          <ul>
            <li className='mb-4'>
              <a href='/' className='flex items-center'>
              <span className='material-icon mr-2'>
                <RiHome2Fill className="mr-2"/>
              </span>{" "}
              Home
              </a>
            </li>

            <li className='mb-4'>
              <a href='/courses' className='flex items-center'>
              <span className='material-icon mr-2'>
                <FaDiscourse className="mr-2"/>
              </span>{" "}
              Courses
              </a>
            </li>

            <li className='mb-4'>
              <a href='/purchases' className='flex items-center'>
              <span className='material-icon mr-2'>
                <FaDownload className="mr-2"/>
              </span>{" "}
              Purchases
              </a>
            </li>


            <li>
              {isLoggedIn ? (
                <button onClick={handleLogout} className='flex items-center'>
                <span className='material-icon mr-2'>
                  <IoLogOut className="mr-2"/>
                </span>{" "}
                LogOut
                </button>
              ) : (
                <Link to ={"/login"} className='flex items-center'>
              <span className='material-icon mr-2'>
                <IoLogIn className="mr-2"/>
              </span>{" "}
              LogIn
              </Link>
              )}
            </li>

          </ul>
        </nav>
      </aside> 

      {/* header  */}

      <header className='w-full bordere-2 bg-slate-100 p-4 rounded-md flex justify-end align-middle'>
        <h1 className='font-semibold font-serif flex justify-start'>Purchased_Courses :- </h1>
        <div className='w-1/2  h-full flex justify-end align-middle '>
          <input placeholder='search' className='w-1/2 h-full  rounded-md border-gray-200 text-2xl py-2 text-center'/>
        </div>
      </header>

    <section className='flex justify-end items-start border-2 border-l-orange-700 w-full p-4'>
    <main className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-[80%] h-auto  p-4'>
      {loading ? (
        <p className=' text-4xl flex justify-center items-center py-24 my-6'>Data Is Fetching, Loading .....</p>
      ) : (
        purchases.length === 0 ? (
          <p className='w-full h-full text-4xl flex justify-center py-24 my-6'>No Courses are Purchases</p>
      ) : (
        purchases.map((purchase) => (
          <div key={purchase._id} className='border border-gray-300 rounded-lg p-4 bg-white shadow-md hover:scale-75 transition duration-500 hover:shadow-lg '>
            <img src={purchase.image.url} alt={purchase.title} className='w-full h-[300px] object-cover rounded-md mb-2' />
            <h2 className='text-xl font-semibold'>Title: {purchase.title}</h2>
            <p className='text-gray-700'>Description: {purchase.description}</p>
            <div className='mt-2 flex justify-between items-center'>
              <p className='font-bold'>Price: {purchase.price}</p>
              {/* <Link to={`/buy/${purchases._id}`} className='mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>Buy</Link> */}
            </div>
            
          </div>
        ))
      )
    )}
    </main>
    </section>

    </>
  )
}

export default Purchase