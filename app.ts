import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from './models/User'
import express, {Express, Request, Response} from "express";
import checkToken from "./middleware/checkToken";
import AuthRequest from "./interfaces";
import crypto from "crypto"
import swaggerDocs from "./routes/auth.json"
import swaggerUiExpress from "swagger-ui-express"



export const secretKey = Object.freeze(crypto.randomBytes(64).toString("base64"))


const app: Express = express()

app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDocs, {explorer: true}))
mongoose.connect('mongodb://localhost:27017/auth_expressjs')
    .then(() => console.log('connected to MongoDB'))
    .catch(err => console.error(err))


app.post('/account/register', async (req: Request, res: Response) => {
    const {email, password} = req.query;
    if (!(email || password) || email == "" || password == "") return res.status(400).json({message: 'please enter email and password'})

    await User.findOne({email: email})
        .then((result) => {
            if (result) return res.status(409).json({message: `user already exists`})
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).json({message: `something went wrong`})
        })

    let hashedPass = null
    await bcrypt.hash(password as string, 10)
        .then((result) => {
            hashedPass = result
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).json({message: `something went wrong`})
        })

    const user = new User({email: email, password: hashedPass, firstName: null, lastName: null, phoneNumber: null})
    await user.save()
        .then(() => {
            return res.status(200).json({message: 'user registered successfully.'})
        })
        .catch((err) => {
            console.log(err)
            return res.status(400).json({message: 'request failed'})
        })
})

app.post('/account/extraInfo', checkToken, async (req: AuthRequest, res: Response) => {
    const {firstName, lastName, phoneNumber} = req.query;
    if (!(firstName || lastName || phoneNumber)) return res.status(400).json({message: 'please enter phone number and first name and last name'})
    await User.findOneAndUpdate({email: req.user.email}, {
        phoneNumber: phoneNumber,
        firstName: firstName,
        lastName: lastName
    }, {upsert: true})
        .then((data) => {
            return res.status(200).json({
                message: "user updated successfully!",
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
                email: data.email
            })
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).json({message: "something went wrong"})
        })
})


app.post('/account/login', async (req: Request, res: Response) => {
    const {email, password} = req.query
    if (!(email || password)) return res.status(400).json({message: 'enter the correct username and password'})
    try{
        const user = await User.findOne({email: email})
        console.log(email, password)
        if (!user || !(await bcrypt.compare(password as string, user.password as string))) return res.status(400).json({message: 'email or password is incorrect!'})
        const token = jwt.sign({email: user.email}, secretKey, {expiresIn: '1h'})
        return res.status(200).json({message: "login successful!", token})
    }catch(err){
        console.log(err)
        res.status(500).json({message: "something went wrong!"})
    }

})

app.get('/user/panel', checkToken, (req: AuthRequest, res: Response) => {
    User.findOne({email: req.user.email})
        .then((data) => {
            return res.status(200).send({
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
                email: data.email
            })
        })
        .catch((err) => {
            console.log(err)
            return res.status(500).send({message: `something went wrong!`})
        })

})

app.listen(5000)

