const connection = require("../config/db.config");

module.exports = {
  getFreePaymentByStudent: (id, period_start = "", period_end = "") =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT detail_payment_rate_bebas.*,view_payment.* FROM detail_payment_rate_bebas INNER JOIN payment_rate ON payment_rate.payment_rate_id=detail_payment_rate_bebas.payment_rate_id INNER JOIN view_payment ON view_payment.payment_id=payment_rate.payment_payment_id  WHERE payment_rate.student_student_id=? AND period_start LIKE '%${period_start}%' AND period_end LIKE '%${period_end}%'`,
        id,
        (error, result) => {
          if (!error) {
            resolve(
              result.map((item) => ({
                ...item,
                payment_rate_discount: parseInt(item.payment_rate_discount, 10),
                payment_rate_total_pay: parseInt(
                  item.payment_rate_total_pay,
                  10
                ),
              }))
            );
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getFreePaymentTypeByStudent: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM view_payment_type WHERE student_student_id=? AND payment_type='BEBAS'",
        id,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getDetailFreePaymentTypeByIdPayment: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM detail_payment_rate_bebas_pay WHERE detail_payment_rate_id =?",
        id,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getDetailFreePaymentTypeByReference: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT detail_payment_rate_bebas_pay.*,detail_payment_rate_bebas.*,view_payment.*,account.account_description as payment_rate_via_name FROM detail_payment_rate_bebas_pay LEFT JOIN account ON account.account_id=detail_payment_rate_bebas_pay.payment_rate_via INNER JOIN detail_payment_rate_bebas ON detail_payment_rate_bebas.detail_payment_rate_id=detail_payment_rate_bebas_pay.detail_payment_rate_id INNER JOIN payment_rate on payment_rate.payment_rate_id=detail_payment_rate_bebas.payment_rate_id INNER JOIN view_payment ON view_payment.payment_id=payment_rate.payment_payment_id WHERE payment_rate_bebas_pay_number =?",
        id,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getAllDetailFreePaymentTypeByIdPayment: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT detail_payment_rate_bebas_pay.*, SUM(detail_payment_rate_bebas_pay.payment_rate_bebas_pay_bill) as 'total_bayar' FROM detail_payment_rate_bebas_pay WHERE detail_payment_rate_id IN (${id}) group BY detail_payment_rate_id `,

        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),

  getHistoryFreePaymentIdPayment: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT detail_payment_rate_bebas.*,detail_payment_rate_bebas_pay.* FROM detail_payment_rate_bebas INNER JOIN payment_rate ON payment_rate.payment_rate_id=detail_payment_rate_bebas.payment_rate_id INNER JOIN detail_payment_rate_bebas_pay ON detail_payment_rate_bebas_pay.detail_payment_rate_id=detail_payment_rate_bebas.detail_payment_rate_id WHERE payment_rate.student_student_id=? ",
        id,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getTagihanFreePaymentAllStudent: (unitId, classId, periodId) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT detail_payment_rate_bebas.* FROM detail_payment_rate_bebas INNER JOIN payment_rate ON payment_rate.payment_rate_id=detail_payment_rate_bebas.payment_rate_id INNER JOIN payment ON payment.payment_id=payment_rate.payment_payment_id INNER JOIN student ON student.student_id=payment_rate.student_student_id WHERE student.unit_unit_id=? AND student.class_class_id=? AND payment.period_period_id=?",
        [unitId, classId, periodId],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getFreePaymentById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM detail_payment_rate_bebas WHERE detail_payment_rate_id =?",
        id,
        (error, result) => {
          if (!error) {
            resolve(result[0]);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getTagihanFreePaymentAllStudent: (unitId, classId, periodId) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT detail_payment_rate_bebas_pay.*,unit.unit_name, student.*, class.class_name,SUM(payment_rate_bill) as total_tagihan FROM student LEFT JOIN unit ON unit.unit_id = student.unit_unit_id LEFT JOIN payment_rate ON payment_rate.student_student_id=student.student_id LEFT JOIN detail_payment_rate_bebas ON payment_rate.payment_rate_id=detail_payment_rate_bebas.payment_rate_id INNER JOIN detail_payment_rate_bebas_pay ON detail_payment_rate_bebas.detail_payment_rate_id=detail_payment_rate_bebas_pay.detail_payment_rate_id LEFT JOIN class on class.class_id=student.class_class_id LEFT JOIN payment on payment.payment_id=payment_rate.payment_payment_id LEFT JOIN period ON period.period_id=payment.period_period_id WHERE payment_rate_status=0 AND student.unit_unit_id=? and class.class_id=? AND period.period_id=? GROUP BY payment_rate.student_student_id",
        [unitId, classId, periodId],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getFreePaymentTransactionNumber: (id, date) =>
    new Promise((resolve, reject) => {
      connection.query(
        `select DISTINCT detail_payment_rate_bebas_pay.payment_rate_bebas_pay_number from detail_payment_rate_bebas_pay INNER JOIN detail_payment_rate_bebas ON detail_payment_rate_bebas.detail_payment_rate_id=detail_payment_rate_bebas_pay.detail_payment_rate_id INNER JOIN payment_rate ON payment_rate.payment_rate_id=detail_payment_rate_bebas.payment_rate_id where detail_payment_rate_bebas_pay.payment_rate_bebas_pay_number IS NOT NULL AND payment_rate.student_student_id=${id} AND DATE (payment_rate_bebas_pay_created_at)='${date}'`,
        id,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getFreePaymentTypeByStudent: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM view_payment_type WHERE student_student_id=? AND payment_type='BEBAS'",
        id,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getFreePaymentTypeAllStudentByPaymentQuery: (ids) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM view_payment_type WHERE payment_rate_id IN(${ids}) AND payment_type='BEBAS'`,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  getTagihanFreePaymentIdPayment: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT detail_payment_rate_bebas.* FROM detail_payment_rate_bebas INNER JOIN payment_rate ON payment_rate.payment_rate_id=detail_payment_rate_bebas.payment_rate_id WHERE payment_rate.student_student_id=? ",
        id,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  putMonthlyPayment: (id, setData) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE detail_payment_rate_bulan set ? WHERE detail_payment_rate_id=?",
        [setData, id],
        (error, result) => {
          if (!error) {
            const newData = {
              detail_payment_rate_id: parseInt(id, 10),
              ...result,
              field: { id: parseInt(id, 10), ...setData },
            };
            resolve(newData);
          } else {
            reject(error);
          }
        }
      );
    }),
  putMonthlyPaymentById: (setData, id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE detail_payment_rate_bulan set ? WHERE detail_payment_rate_id=?",
        [setData, id],
        (error, result) => {
          if (!error) {
            const newData = {
              detail_payment_rate_id: parseInt(id, 10),
              ...result,
              field: { id: parseInt(id, 10) },
            };
            resolve(newData);
          } else {
            reject(error);
          }
        }
      );
    }),
  putDiscountFreePaymentById: (setData, id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE detail_payment_rate_bebas set ? WHERE detail_payment_rate_id=?",
        [setData, id],
        (error, result) => {
          if (!error) {
            const newData = {
              detail_payment_rate_id: parseInt(id, 10),
              ...result,
              field: { id: parseInt(id, 10) },
            };
            resolve(newData);
          } else {
            reject(error);
          }
        }
      );
    }),

  putPaymentFreePayment: (setData, id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE detail_payment_rate_bebas set ? WHERE detail_payment_rate_id=?",
        [setData, id],
        (error, result) => {
          if (!error) {
            const newData = {
              detail_payment_rate_id: parseInt(id, 10),
              ...result,
              field: { id: parseInt(id, 10) },
            };
            resolve(newData);
          } else {
            reject(error);
          }
        }
      );
    }),
  postDetailFreePayment: (setData) =>
    new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO detail_payment_rate_bebas_pay set ? ",
        [setData],
        (error, result) => {
          if (!error) {
            const newData = {
              detail_payment_rate_id: parseInt(result.insertId, 10),
              ...result,
              field: { id: parseInt(result.insertId, 10) },
            };
            resolve(newData);
          } else {
            reject(error);
          }
        }
      );
    }),
};
