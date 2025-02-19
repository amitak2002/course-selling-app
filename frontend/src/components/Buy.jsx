import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Link} from 'react-router-dom'
import { useElements, useStripe, CardElement } from '@stripe/react-stripe-js';
import { BACKEND_URL } from '../assets/backendurl.js';


function Buy() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [course , setCourse] = useState({})
  const [clientSecret , setClientSecret] = useState("")
  const [error , setError] = useState("")

  const [cardError , setCardError] = useState("")

  const stripe = useStripe();
  const elements = useElements();

  //yaha check krna hai ok
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token // Retrieve the token directly

  console.log('Token in purchase.jsx :', token); // Log the token for debugging

  //fetch buyCourses data when different id of different courses comes
  
  useEffect(() => {
    const fetchBuyCourseData = async () => {
      if (!token) {
        toast.error("Please login first" , {autoClose : 2000});
        setTimeout(() => {
          navigate('/login')
        }, 4000);
        return;
      }
      try {
        const response = await axios.post(
          `${BACKEND_URL}/courses/buy/${courseId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        console.log('Successfully purchased course:', response.data);
        setCourse(response.data.course)
        setClientSecret(response.data.clientSecret)
        console.log('course is : ',response.data.course)
        console.log('client secret is : ',response.data.clientSecret)
        setLoading(false)
      } 
      catch (err) {
        setLoading(false);
        console.error("Error during course purchase:", err);
        
        if (err.response && err.response.data) {
          const { message } = err.response.data;
          if (message === "invalid token or expired token") {
            toast.error("Your session has expired. Please log in again.", { autoClose: 3000 });
            setTimeout(() => { navigate("/login"); }, 5000);
          } else {
            toast.error(message , {autoClose : 2000});
            setTimeout(() => {
              navigate('/courses')
            }, 4000);
          }
        } else {
          toast.error('Error during course purchase');
          setTimeout(() => {
            navigate('/courses')
          }, 4000);
        }
      } 
    }
    
    fetchBuyCourseData()
  },[courseId])  

  const handlePurchase = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log('Stripe or Element Not found')
      return;
    }

    setLoading(true)
    const card = elements.getElement(CardElement);

    if (card == null) {
      console.log('card element not found : ')
      setLoading(false)
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      console.log('Stripe paymentMethod Error : ', error);
      setLoading(false)
      setCardError(error.message)
    } else {
      console.log('[PaymentMethod Created ]', paymentMethod);
    }
    if (!clientSecret) {
      console.log('no client secret found')
      setLoading(false)
      return
    }
    const {paymentIntent, error : confirmError} = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: card,
          billing_details: {
            name: user?.user?.firstName,
            email : user?.user?.email
          },
        },
      },
    );
    if (confirmError) {
      setCardError(confirmError.message)
      setLoading(false) //ye rha

    } else if (paymentIntent.status === 'succeeded')  {
      console.log('Payment sucedded : ',paymentIntent)
      setCardError("your paymentId : ",paymentIntent.id)
      const paymentInfo = {
        course : course.title,
        email : user?.user?.email,
        userId : user.user._id,
        courseId : courseId,
        paymentId : paymentIntent.id,
        amount : paymentIntent.amount,
        status : paymentIntent.status
      }
      console.log('Payment Info : ',paymentInfo)
      await axios.post(`${BACKEND_URL}/order` ,
       paymentInfo , 
       {headers : {
        Authorization : `Bearer ${token}`
       } , withCredentials : true})
       .then(response => {
        console.log('response after paymentInfo : ',response.data)
       })
       .catch((error) => {
        console.log("error comes after paymentInfo : ",error)
        toast.success('error after paymenyInfo' , {autoClose : 1000})
       })
      toast.success('payment successfully done' , {autoClose : 1000})
      setLoading(false)
      setTimeout(() => {navigate("/purchases") },4000)
    }
  };

  return (
    <>
      <ToastContainer position='top-center'/>
      
      {error ? (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
            <p className="text-lg font-semibold">{error}</p>
            <Link
              className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center"
              to={"/purchases"}
            >
              Purchases
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row my-40 container mx-auto">
          <div className="w-full md:w-1/2">
            <h1 className="text-xl font-semibold underline">Order Details</h1>
            <div className="flex items-center text-center space-x-2 mt-4">
              <h2 className="text-gray-600 text-sm">Total Price</h2>
              <p className="text-red-500 font-bold">${course.price}</p>
            </div>
            <div className="flex items-center text-center space-x-2">
              <h1 className="text-gray-600 text-sm">Course name</h1>
              <p className="text-red-500 font-bold">{course.title}</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4">
                Process your Payment!
              </h2>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm mb-2"
                  htmlFor="card-number"
                >
                  Credit/Debit Card
                </label>
                <form onSubmit={handlePurchase}>
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                        invalid: {
                          color: "#9e2146",
                        },
                      },
                    }}
                  />

                  <button
                    type="submit"
                    disabled={!stripe || loading} // Disable button when loading
                    className="mt-8 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200"
                  >
                    {loading ? "Processing..." : "Pay"}
                  </button>
                </form>
                {cardError && (
                  <p className="text-red-500 font-semibold text-xs">
                    {cardError}
                  </p>
                )}
              </div>

              <button className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center">
                <span className="mr-2">🅿️</span> Other Payments Method
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Buy;