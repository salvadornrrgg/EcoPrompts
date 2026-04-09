import { Request, Response } from 'express';
import * as categoryService from '../services/categoryService.js';


//  Obtém todas as categorias da base de dados.

 

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await categoryService.findAllCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: "Erro ao procurar categorias" });
    }
};



// Cria categoria

export const createCategoryController = async (req: Request, res: Response) => {
    const { name } = req.body;

    // Validação de dados de entrada (Requisito de Engenharia [cite: 16, 65])
    if (!name || name.trim() === '') {
        return res.status(400).json({ error: "O nome da categoria é obrigatório" });
    }

    try {
        const newCategory = await categoryService.createCategory(name.trim());
        res.status(201).json(newCategory);
    } catch (error: any) {
        // Tratamento consistente de erros, como categorias duplicadas [cite: 66]
        res.status(400).json({ error: error.message || "Erro ao criar categoria" });
    }
};



// Procura categorias por nome

export const searchCategories = async (req: Request, res: Response) => {
    const categoryName = String(req.query.q);
    try {
        const categories = await categoryService.searchCategoryByName(categoryName);
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: "Erro ao pesquisar categorias" });
    }
};



// Obtem categorias por Id

export const getCategoryById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const category = await categoryService.findCategoryById(Number(id));
        if (!category) {
            return res.status(404).json({ error: "Categoria não encontrada" });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: "Erro ao procurar a categoria" });
    }
};