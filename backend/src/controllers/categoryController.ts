import { Request, Response, NextFunction } from 'express';
import * as categoryService from '../services/categoryService';
import { createCategorySchema, categoryIdSchema, categorySearchSchema } from '../schemas/categorySchema';

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await categoryService.findAllCategories();
        res.json(categories);
    } catch (error: any) {
        next(error);
    }
};

export const createCategoryController = async (req: Request, res: Response, next: NextFunction) => {
    const result = createCategorySchema.safeParse(req.body);
    if (!result.success) {
        const err: any = new Error('Dados inválidos');
        err.status = 400;
        err.zodErrors = result.error.issues;
        return next(err);
    }

    try {
        const newCategory = await categoryService.createCategory(result.data.name);
        res.status(201).json(newCategory);
    } catch (error: any) {
        next(error);
    }
};

export const searchCategories = async (req: Request, res: Response, next: NextFunction) => {
    const result = categorySearchSchema.safeParse({ q: req.query.q });
    if (!result.success) {
        const err: any = new Error('Parâmetro inválido');
        err.status = 400;
        err.zodErrors = result.error.issues;
        return next(err);
    }

    try {
        const categories = await categoryService.searchCategoryByName(result.data.q);
        res.json(categories);
    } catch (error: any) {
        next(error);
    }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    const result = categoryIdSchema.safeParse({ id: req.params.id });
    if (!result.success) {
        const err: any = new Error('ID inválido');
        err.status = 400;
        err.zodErrors = result.error.issues;
        return next(err);
    }

    try {
        const category = await categoryService.findCategoryById(parseInt(result.data.id));
        res.json(category);
    } catch (error: any) {
        if (error.message === 'Category not found') error.status = 404;
        next(error);
    }
};

export const getPromptsByCategoryId = async (req: Request, res: Response, next: NextFunction) => {
    const result = categoryIdSchema.safeParse({ id: req.params.id });
    if (!result.success) {
        const err: any = new Error('ID inválido');
        err.status = 400;
        err.zodErrors = result.error.issues;
        return next(err);
    }

    try {
        const prompts = await categoryService.getPromptsByCategoryId(parseInt(result.data.id));
        res.json(prompts);
    } catch (error: any) {
        if (error.message === 'Category not found') error.status = 404;
        next(error);
    }
};
