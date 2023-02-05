import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import ProductsModel from "./model.js";
import UsersModel from "../users/model.js";
import ReviewsModel from "./../reviews/model.js";
import ProductsCategoriesModel from "./productsCategoriesModel.js";

const productsRouter = express.Router();

productsRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await ProductsModel.create(req.body);
    if (req.body.categories) {
      await ProductsCategoriesModel.bulkCreate(
        req.body.categories.map((category) => {
          return {
            categoryId: category,
            productId: id,
          };
        })
      );
    }

    res.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});
productsRouter.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.name) {
      query.name = { [Op.iLike]: `${req.query.name}%` };
    }
    if (req.query.priceMin && req.query.priceMax) {
      query.price = {
        [Op.and]: {
          [Op.gte]: req.query.priceMin,
          [Op.lte]: req.query.priceMax,
        },
      };
    }
    if (req.query.category) {
      query.category = {
        [Op.iLike]: `${req.query.category}%`,
      };
    }
    const products = await ProductsModel.findAll({
      where: { ...query },
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
});
productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductsModel.findByPk(req.params.productId, {
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: ReviewsModel,
          attributes: ["rating", "review"],
          include: {
            model: UsersModel,
            attributes: ["firstName", "lastName", "age", "country"],
          },
        },
      ],
    });

    if (product) {
      res.send(product);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});
productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await ProductsModel.update(
      req.body,
      { where: { id: req.params.productId }, returning: true }
    );

    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await ProductsModel.destroy({
      where: { id: req.params.productId },
    });
    if (numberOfDeletedRows === 1) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const product = await ProductsModel.findByPk(req.params.productId, {
      include: {
        model: ReviewsModel,
        attributes: ["userId", "rating", "review"],
      },
    });

    if (product) {
      res.send(product);
    } else {
      next(
        createHttpError(404, `Product with ${req.params.productId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.post("/:productId/addCategory", async (req, res, next) => {
  try {
    const product = await ProductsModel.findByPk(req.params.productId);
    if (product) {
      const response = await ProductsCategoriesModel.create({
        categoryId: req.body.categoryId,
        productId: req.params.productId,
      });
      res.status(201).send(response);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
