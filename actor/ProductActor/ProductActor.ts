import { Request, Response } from "express";
import { Responder } from "../middleware/Responder";
import { Pool } from "../middleware/Pool";

export class ProductActor {
    static async createProduct(req: Request, res: Response) {
        try {
            const {title, price, description} = req.body
            const product = await Pool.conn.product.create({
                data: {
                    title, price, description
                }
            })
            res.json(Responder.ok(product))
        } catch (e) {
            console.log(e)
            res.json(Responder.internal())
        }
    }
    static async createProductFeature(req: Request, res: Response) {}
    static async createProductFilter(req: Request, res: Response) {}
    static async createProductFilterItem(req: Request, res: Response) {}
    static async createProductImage(req: Request, res: Response) {}
    static async createProductType(req: Request, res: Response) {}

    static async getFilteredProducts(req: Request, res: Response) {
    try {
        const { title, filter_items, order, filter, offset, limit } = req.body;

        console.log("req.body =", req.body);

        const products = await Pool.conn.product.findMany({
        where: {
            AND: [
            title && title.trim() !== ""
                ? { title: { contains: title.trim(), mode: "insensitive" } }
                : {},
            filter_items?.length
                ? {
                    type: {
                    some: {
                        filters: {
                        some: {
                            items: {
                            some: {
                                id: { in: filter_items },
                            },
                            },
                        },
                        },
                    },
                    },
                }
                : {},
            ],
        },
        orderBy: filter && order ? { [filter]: order } : undefined,
        skip: offset || 0,
        take: limit || 10,
        include: {
            images: true,
            features: true,
            type: {
            include: {
                filters: {
                include: {
                    items: true,
                },
                },
            },
            },
        },
        });

        res.json(Responder.ok(products));
    } catch (error) {
        console.error(error);
        res.json(Responder.internal());
    }
    }



}