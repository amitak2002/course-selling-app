import express from 'express'
import {adminLogin , adminSignUp , adminLogout} from '../controllers/admin.controller.js'

const router = express.Router()

router.post('/signup' , adminSignUp)
router.post('/login' , adminLogin)
router.get('/logout' , adminLogout)

export default router