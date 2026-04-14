import { Request, Response } from 'express';
import * as categoryService from '../services/categoryService.ts';
import { createCategorySchema, categoryIdSchema, categorySearchSchema } from '../schemas/categorySchema.js';

// GET /categories - Devolve todas as categorias
export const getAllCategories = async (req: Request, res: Response) => {
    const categories = await categoryService.findAllCategories();
    res.json(categories);
};

// POST /categories - Cria categoria
export const createCategoryController = async (req: Request, res: Response) => {
    const result = createCategorySchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            error: "Dados inválidos",
            errors: result.error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message
            }))
        });
    }

    try {
        const newCategory = await categoryService.createCategory(result.data.name);
        res.status(201).json(newCategory);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message || "Erro ao criar categoria" });
    }
};

// GET /categories/search?q= - Pesquisa categorias
export const searchCategories = async (req: Request, res: Response) => {
    const result = categorySearchSchema.safeParse({ q: req.query.q });

    if (!result.success) {
        return res.status(400).json({
            error: "Parâmetro inválido",
            errors: result.error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message
            }))
        });
    }

    try {
        const categories = await categoryService.searchCategoryByName(result.data.q);
        res.json(categories);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message || "Erro ao pesquisar categorias" });
    }
};

// GET /categories/:id - Devolve categoria por ID
export const getCategoryById = async (req: Request, res: Response) => {
    const result = categoryIdSchema.safeParse({ id: req.params.id });

    if (!result.success) {
        return res.status(400).json({
            error: "ID inválido",
            errors: result.error.issues.map((issue) => issue.message)
        });
    }

    try {
        const category = await categoryService.findCategoryById(parseInt(result.data.id));
        
        if (!category) {
            return res.status(404).json({ error: "Categoria não encontrada" });
        }
        
        res.json(category);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message || "Erro ao procurar a categoria" });
    }
};

// GET /categories/:id/prompts - Devolve lista de prompts pertencentes a uma determinada categoria
export const getPromptsByCategoryId = async (req: Request, res: Response) => {
    const result = categoryIdSchema.safeParse({ id: req.params.id });

    if (!result.success) {
        return res.status(400).json({
            error: "ID inválido",
            errors: result.error.issues.map((issue) => issue.message)
        });
    }

    try {
        const categoryId = parseInt(result.data.id);
        const prompts = await categoryService.getPromptsByCategoryId(categoryId);
        res.json(prompts);
    } catch (error: any) {
        console.error(error);
        const status = error.message === 'Category not found' ? 404 : 500;
        res.status(status).json({ error: error.message || "Erro ao procurar prompts da categoria" });
    }
};