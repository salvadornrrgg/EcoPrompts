import { type Request, type Response } from 'express';
import * as userService from '../services/userService.js';
export const getUsers = async (req: Request, res: Response) => {
const users = await userService.findAllUsers();
res.json(users);
};

export const createUserController = async (req: Request, res: Response) => {
    try {
        const { fullName, email } = req.body;
        const newUser = await userService.createUser(username, email);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: "Invalid data or email already exists" });
    }
};

export const getFavAuthors = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    try {
        const authors = await userService.findFavAuthors(id);
        res.status(200).json(authors);
    } catch (error) {
        res.status(404).json({ error: "Invalid User ID" });
    }
    
};