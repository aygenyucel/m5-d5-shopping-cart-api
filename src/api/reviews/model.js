import DataTypes from "sequelize";
import sequelize from "../../db.js";
import ProductModel from "../product/model.js";
import UsersModel from "../users/model.js";

const ReviewsModel = sequelize.define("review", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  review: {
    type: DataTypes.STRING,
    allowNull: null,
  },
});

UsersModel.hasMany(ReviewsModel);
ReviewsModel.belongsTo(UsersModel, { foreignKey: { allowNull: false } });

ProductModel.hasMany(ReviewsModel);
ReviewsModel.belongsTo(ProductModel, { foreignKey: { allowNull: false } });

export default ReviewsModel;
