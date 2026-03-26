import { Request, Response } from 'express';
import * as bookService from '../services/bookService.js';
export const getBooks = async (req: Request, res: Response) => {
    try {
        const books = await bookService.findAllBooks();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: "Error fetching books" });
    }
};

export const createBookController = async (req: Request, res: Response) => {
    const { title, authorId } = req.body;
    try {
        const newBook = await bookService.createBook(title, authorId);
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ error: "Invalid data or author not found" });
    }
};

export const searchBooks = async (req: Request, res: Response) => {
    const bookName = String(req.query.q);
    try {
        const book = await bookService.searchBookByName(bookName);
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: "Error fetching books" });
    }
};

export const recentBooks = async (req: Request, res: Response) => {
    try {
        const books = await bookService.findRecentBooks();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: "Error fetching books" });
    }
};