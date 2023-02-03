import { DataTypes } from "sequelize";
import sequelize from "../../db.js";
import CategoriesModel from "../categories/model.js";
import ProductsCategoriesModel from "./productsCategoriesModel.js";

const ProductModel = sequelize.define("product", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  image: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.FLOAT,
  },
});

ProductModel.belongsToMany(CategoriesModel, {
  through: ProductsCategoriesModel,
  foreignKey: { name: "productId", allowNull: false },
});

CategoriesModel.belongsToMany(ProductModel, {
  through: ProductsCategoriesModel,
  foreignKey: { name: "categoryId", allowNull: false },
});

export default ProductModel;
