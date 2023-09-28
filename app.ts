import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import User from './models/User'
import express , {Express, Request, Response} from "express";

const app: Express = express()
mongoose.connect('mongodb://localhost:27017/auth_expressjs')
    .then(() => console.log('connected to MongoDB'))
    .catch(err => console.error(err))


app.post('/account/register', async (req:Request, res:Response) => {
    const {email, password} = req.query;
    if (!email || !password || email == "" || password == "") {
        return res.status(400).json({ message: 'please enter email and password' })
    }
    const userExisting = await User.findOne({email:email})
    if (userExisting) {
        return res.status(400).json({ message: `${email} already exists` })
    }
    const hashedPass = await bcrypt.hash(password as string, 10)
    const user = new User({email: email, password: hashedPass})

    await user.save()

    return res.status(201).send('user registered successfully.')


})

app.listen(5000)