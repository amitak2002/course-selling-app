
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { BrowserRouter } from 'react-router-dom'

const stripePromise = loadStripe("pk_test_51QrvuyEbfL9uNJm5gBXZnkhVxlrjmkHsjmIfpFRDkbCb7D9EIsuGG8R6zu1RgvF9HksCP9ih2u1VZryGzmZkVyDa00pR2jrRgn");


createRoot(document.getElementById('root')).render(
    

  // <BrowserRouter>
  //   <App/>
  // </BrowserRouter>
    <Elements stripe={stripePromise}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>

    </Elements>
)
