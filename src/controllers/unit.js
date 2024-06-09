const helpers = require("../helpers");
const { customErrorApi } = require("../helpers/CustomError");
const { promiseHandler } = require("../middleware/promiseHandler");
const unitModel = require("../models/unit");

module.exports = {
  getAllUnitByUser: promiseHandler(async (req, res, next) => {
    const { token } = req;
    console.log(token);
    const result = await unitModel.getUnitByUser(token?.user_id);
    return helpers.response(
      res,
      200,
      "Get All Unit By User Successfully",
      result
    );
  }),
};
