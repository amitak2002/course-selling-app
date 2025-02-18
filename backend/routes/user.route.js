import express from 'express'
import { login, logOut, signUp ,purchases } from '../controllers/user.controller.js'
import userMiddleware from '../middlewares/user.mid.js'


const router = express.Router()

router.post('/signup' , signUp)
router.post('/login' , login)
router.get('/logout' , logOut)

router.get('/purchase' , userMiddleware ,purchases)

export default router