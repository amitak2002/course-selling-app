import React , {useState} from 'react'
import logo from '../../public/logo.jpg'
import {Link} from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../assets/backendurl.js';



function Signup() {

  const [firstName , setFirstName] = useState("")
  const [lastName , setLastName] = useState("")
  const [email , setEmail] = useState("")
  const [password , setPassword] = useState("")
  const [error , setError] = useState("")

  console.log(firstName , lastName , email , password)
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // url for api calling , data , headers
      const response = await axios.post( `${BACKEND_URL}/user/signup` ,
        {
          firstName , lastName , email , password
        } , 
        {
          withCredentials : true,
          "Content-type" : "application/json"
        }
      )

      console.log('sign up sucessfull ,',response)
      toast.success('Sucessfully SignUp' , {autoClose : 2000})
  
      setEmail("")
      setError("")
      setFirstName("")
      setLastName("")
      setPassword("")

    } 
    catch (err) {
      console.log('error comes at signup.jsx : ',err)
      if (err.response) {

        const printErr = Array.isArray(err.response.data.errors)
        console.log(printErr)
        console.log(err.response.data)
        
        let ans = ""
        if (printErr == true) {
          err.response.data.errors.map((e) => ans += e+" ")
        } else {
          ans = (err.response.data.message)
        }
        console.log(ans)

        setError(ans || "signUp failed")
        toast.error(ans , {autoClose : 2000})
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    }
  }

  return (
  <>
    <ToastContainer position='top-center'/>
    <div className="bg-gradient-to-r from-black to-blue-900 min-h-screen">

      <div className="text-white container mx-auto">
          {/* Header */}
          <header className="flex justify-between items-center container mx-auto py-8">
            <div className="flex items-center">
              <img src={logo} alt="Logo" className="h-[50px] w-[70px] rounded-md" />
              <h1 className="font-poppins text-2xl mx-4 text-orange-600 font-bold">Course_Seller</h1>
            </div>
            <div className="flex items-center">
              <Link to="/login" className="border-2 border-white mx-2 py-2 px-4 rounded-md font-bold hover:bg-orange-600 transition duration-300">
                Login
              </Link>
              <Link to="/" className="border-2 border-white mx-2 py-2 px-4 rounded-md font-bold hover:bg-orange-600 transition duration-300">
                join now
              </Link>
            </div>
          </header>
        </div>

        {/* {Sign up Page} */}

        <form className=' w-full flex justify-center items-center text-white' onSubmit={handleSubmit}>
          <div className='py-12 px-8 border-2 border-gray-600 rounded-md bg-gray-800'>
            <div className='flex justify-center items-center'>
              <div>
                <h1 className='font-bold text-4xl'>Welcome to <span className='text-orange-600'>Course_Seller_</span></h1>
                <p className='text-md font-semibold flex justify-center items-center my-2 text-gray-500'>Just_Sign_Up_first_</p>
              </div>
            </div>

            <div className='my-2'>
              <label/>firstName<br></br>
              <input className='border-2 border-gray-600 w-full py-2 px-12 rounded-md text-black my-2'
              value={firstName}
              onChange={(e) => (setFirstName(e.target.value))}
              />
            </div>
            
            <div className='my-2'>
              <label/>lastName
              <input className='border-2 border-gray-600 w-full py-2 px-12 rounded-md text-black my-2'
              value={lastName}
              onChange={(e) => (setLastName(e.target.value))}
              />
            </div>

            <div className='my-2'>
              <label/>email
              <input className='border-2 border-gray-600 w-full py-2 px-12 rounded-md text-black my-2'
              value={email}
              onChange={(e) => (setEmail(e.target.value))}
              />
            </div>

            <div className='my-2'>
              <label/>password
              <input className='border-2 border-gray-600 w-full py-2 px-12 rounded-md text-black my-2'
              value={password}
              onChange={(e) => (setPassword(e.target.value))}
              />
            </div>

            <div className='my-2'>
              <button className='border-2 border-white bg-orange-500 w-full py-2 rounded-md font-semibold hover:cursor-pointer hover:bg-blue-500'
              
              >submit</button>
            </div>

          </div>
        </form>

    </div>

    </>
  )
};

export default Signup