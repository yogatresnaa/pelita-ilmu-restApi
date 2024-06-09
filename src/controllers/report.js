const { promiseHandler } = require("../middleware/promiseHandler");
const monthlyPaymentModel = require("../models/monthly-payment");
const freePaymentModel = require("../models/free-payment");
const helpers = require("../helpers");

module.exports = {
  laporanPembayaranPerKelas: promiseHandler(async (req, res, next) => {
    const { unit_id, class_id, period_id, payment_type } = req.query;
    const resultMonthly =
      await monthlyPaymentModel.getTagihanMonthlyPaymentAllStudentByPaymentQuery(
        unit_id,
        class_id,
        period_id,
        payment_type
      );
    const resultFree = await freePaymentModel.getTagihanFreePaymentAllStudent(
      unit_id,
      class_id,
      period_id
    );
    const idsMonthly = [
      ...new Set(resultMonthly.map((item) => item.payment_rate_id)),
    ].join(",");

    const monthlyPaymentType =
      idsMonthly.length > 0
        ? await monthlyPaymentModel.getMonthlyPaymentTypeAllStudentByPaymentQuery(
            idsMonthly
          )
        : [];

    const idsFree = [
      ...new Set(resultMonthly.map((item) => item.payment_rate_id)),
    ].join(",");
    console.log(class_id);
    console.log(resultMonthly);
    console.log(resultFree);
    const freePaymentType =
      idsFree.length > 0
        ? await freePaymentModel.getFreePaymentTypeAllStudentByPaymentQuery(
            idsFree
          )
        : [];
    const freeType = {
      free_type: freePaymentType.map((item) => ({
        ...item,
        detail_payment: resultFree
          .filter(
            (itemFree) => item.payment_rate_id === itemFree.payment_rate_id
          )
          .map((item) => ({
            ...item,
            payment_rate_bill: parseInt(item.payment_rate_bill),
          })),
      })),
    };

    const total = [...resultFree, ...resultMonthly].reduce(
      (accumulator, currentValue) =>
        accumulator + parseInt(currentValue.payment_rate_bill, 10),
      0
    );
    const newResult = {
      monthly_type: monthlyPaymentType.map((item) => ({
        ...item,
        monthly_payment: resultMonthly
          .filter(
            (itemMonthly) =>
              item?.payment_rate_id === itemMonthly.payment_rate_id
          )
          .map((item) => ({
            ...item,
            payment_rate_bill: parseInt(item.payment_rate_bill),
          })),
      })),
      ...freeType,
      total_tagihan: parseInt(total),
    };
    return helpers.response(
      res,
      200,
      "get Data Laporan pembayaran per kelas berhasil",
      newResult
    );
  }),
};
