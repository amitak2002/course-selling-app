import React ,{useState} from 'react'
import { ToastContainer , toast} from 'react-toastify'
import {Link} from 'react-router-dom'
import Logo from '../../public/logo.jpg'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'


function Login() {

  const [email , setEmail] = useState("")
  const [password , setPassword] = useState("")
  const [error , setError] = useState("")

  const navigate = useNavigate()

  const handleSignIn = async (e) => {
    e.preventDefault()

    try {
        let response = await axios.post("http://localhost:2002/api/v1/user/login" ,
          {email , password},
          {withCredentials : true,
            "Content-type" : "application/json"
          }
        )
        console.log('response : ',response)
        toast.success("sign in sucessfully" , {autoClose : 2000})
        
        const {token} = response.data
        localStorage.setItem("user" , JSON.stringify(response.data))
        console.log('token of user is : ',token)
      
        setTimeout(() => {
          navigate("/");
        }, 3000);
    } 
    catch (err) {
      console.log("error comes at login.jsx page ,",err) 
      let ans = ""
      for (let i in err.response.data) {
        ans += err.response.data[i]+ " "
      }
      console.log(err.response.data)
      setError(ans)
      console.log(ans)
      toast.error(ans) 
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
              <img src={Logo} alt="Logo" className="h-[50px] w-[70px] rounded-md" />
              <h1 className="font-poppins text-2xl mx-4 text-orange-600 font-bold">Course_Seller</h1>
            </div>
            <div className="flex items-center">
              <Link to="/signup" className="border-2 border-white mx-2 py-2 px-4 rounded-md font-bold hover:bg-orange-600 transition duration-300">
                Signup
              </Link>
              <Link to="/" className="border-2 border-white mx-2 py-2 px-4 rounded-md font-bold hover:bg-orange-600 transition duration-300">
                join now
              </Link>
            </div>
          </header>
        </div>

        {/* {Sign up Page} */}

        <form className=' w-full flex justify-center items-center text-white' 
        onSubmit={handleSignIn}
          >
          <div className='py-12 px-8 border-2 border-gray-600 rounded-md bg-gray-800'>
            <div className='flex justify-center items-center'>
              <div>
                <h1 className='font-bold text-4xl'>Welcome to <span className='text-orange-600'>Course_Seller_</span></h1>
                <p className='text-md font-semibold flex justify-center items-center my-2 text-gray-500'>Just_Login_</p>
              </div>
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
}

export default Login