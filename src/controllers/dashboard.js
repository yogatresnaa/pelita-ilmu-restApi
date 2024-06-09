const moment = require("moment");
const helpers = require("../helpers");
const { customErrorApi } = require("../helpers/CustomError");
const { promiseHandler } = require("../middleware/promiseHandler");
const dashboardModel = require("../models/dashboard");

module.exports = {
  getDataDashboard: promiseHandler(async (req, res, next) => {
    const resultSiswa = await dashboardModel.getAllActiveSiswa();
    const newResult = {
      jumlah_siswa_aktif: resultSiswa.jumlah_siswa_aktif,
    };

    return helpers.response(res, 200, "Get All Alumni Successfully", newResult);
  }),
};
