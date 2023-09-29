import {NextFunction , Request , Response} from "express";
import jwt from "jsonwebtoken";
import secretKey from "../utils/generateSecretKey";
import AuthRequest from "../interfaces";
const checkToken =(req:AuthRequest ,res:Response ,next:NextFunction)=>{
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).send("unauthorized")

    try {
        jwt.verify(token, secretKey as string, (err: any, user: any) => {

            if (err) return res.sendStatus(403)

            req.user = user

            next()
        })
    }
    catch (err) {
        return res.status(401).send(`something went wrong : ${err}`)
    }
}

export default checkToken

