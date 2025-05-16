import { Request, Response } from "express";
import { Pool } from "../actor/middleware/Pool";
import { Responder } from "../actor/middleware/Responder";

export class Actor {
  static async getFilteredProducts(req: Request, res: Response) {
    try {
      const { title, filter_items, order, filter, offset, limit } = req.body;

      const products = await Pool.conn.product.findMany({
        where: {
          AND: [
            title ? { title: { contains: title, mode: "insensitive" } } : {},
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
        take: limit || 3,
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
