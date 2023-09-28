import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from './models/User'
import express, {Express, Request, Response} from "express";

const app: Express = express()
mongoose.connect('mongodb://localhost:27017/auth_expressjs')
    .then(() => console.log('connected to MongoDB'))
    .catch(err => console.error(err))


app.post('/account/register', async (req: Request, res: Response) => {
    const {email, password} = req.query;
    if (!(email || password) || email == "" || password == "") return res.status(400).json({message: 'please enter email and password'})

    const userExisting = await User.findOne({email: email})
    if (userExisting) return res.status(400).json({message: `${email} already exists`})

    const hashedPass = await bcrypt.hash(password as string, 10)
    const user = new User({email: email, password: hashedPass})

    await user.save()

    return res.status(201).send('user registered successfully.')


})

app.post('/account/extraInfo', async (req: Request, res: Response) => {
    const {firstName, lastName, phoneNumber, email} = req.query;
    if (!(firstName || lastName || phoneNumber || email) || email == "") return res.status(400).json({message: 'please enter phone number and first name and last name'})
    await User.findOneAndUpdate({email: email}, {phoneNumber: phoneNumber, firstName: firstName, lastName: lastName})
    return res.status(200).json({message: "user updated successfully!"})
})


app.post('/account/login', async(req: Request, res: Response) => {
    const {email , password} = req.query
    if (!(email || password)) return res.status(400).json({ message: 'enter the correct username and password' })
    const user = await User.findOne({email: email })
    if (!user) return res.status(400).json({ message: 'user does not exist' })
    const passwordMatch = await bcrypt.compare(password as string, user.password)
    if (!passwordMatch) return res.status(401).json({message : "password is incorrect!"})
    const token = jwt.sign({email: user.email},'', {expiresIn: '1h'})
    if (!token) return res.status(500).json({ message: 'something went wrong!' })
    return res.status(200).json(token)
})

app.listen(5000)