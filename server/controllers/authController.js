import * as jwt from "@hono/hono/jwt";
import { hash, verify } from "scrypt";
import * as authRepository from "../repositories/authRepository.js";


const JWT_SECRET = Deno.env.get("JWT_SECRET");

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}



const register = async (c) => {
    const user = await c.req.json();
    const foundUser = await authRepository.findByEmail(user.email);
    if (foundUser) {
        return c.json({message:`Confirmation email sent to address ${user.email}.`});
    }
    user.password_hash = hash(user.password);
    const _newUser = await authRepository.create(user);
    return c.json({message:`Confirmation email sent to address ${user.email}.`});
};

const login = async (c) => {
    const user = await c.req.json();
    
    const foundUser = await authRepository.findByEmail(user.email);
    if (!foundUser) {
        return c.json({ message: "Incorrect email or password." }, 401);
    }

    const isValid = verify(user.password, foundUser.password_hash);
    if (!isValid) {
        return c.json({ message: "Incorrect email or password." }, 401);
    }

    const payload = {email : user.email, id: foundUser.id, exp: Math.floor(Date.now() / 1000) + 60*10}; // Token expires in 10 minute };
    const token = await jwt.sign(payload, JWT_SECRET);
    return c.json({
        message: "Login successful!",
        user: payload,
        token: token,
    });

};


export { login, register };
