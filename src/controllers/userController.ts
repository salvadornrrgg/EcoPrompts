import { type Request, type Response } from 'express';
import * as userService from '../services/userService.ts';

export const getUsers = async (req: Request, res: Response) => {
    const users = await userService.findAllUsers();
    res.json(users);
};

export const createUserController = async (req: Request, res: Response) => {
    try {
        const { username, email, password, userType } = req.body;
        const newUser = await userService.createUser(username, email, password, parseInt(userType));
        res.status(201).json(newUser);
        
    } catch (error: any) {
        console.error(error); // mostra no terminal
        res.status(400).json({ error: error.message || "Error" });
    }
};

export const getUser = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    try {
        const user = await userService.findUser(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ error: "Invalid User ID" });
    }
    
};