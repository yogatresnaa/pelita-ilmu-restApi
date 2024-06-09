const connection = require("../config/db.config");

module.exports = {
  getAllPaymentType: (query = "") =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM view_payment ${query}`,
        (error, result) => {
          if (!error) {
            return resolve(result);
          }
          return reject(error);
        }
      );
    }),
  getPaymentTypeById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM payment where payment_id=?",
        id,
        (error, result) => {
          if (!error) {
            return resolve(result[0]);
          }
          return reject(error);
        }
      );
    }),

  postPaymentType: (setData) =>
    new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO payment SET ?",
        setData,
        (error, result) => {
          if (!error) {
            const newData = {
              account_id: parseInt(result.insertId, 10),
              ...setData,
            };
            return resolve(newData);
          }
          return reject(error);
        }
      );
    }),
  putPaymentType: (id, setData) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE payment SET ? where payment_id=?",
        [setData, id],
        (error, result) => {
          if (!error) {
            const newData = {
              account_id: id,
              ...setData,
            };
            return resolve(newData);
          }
          return reject(error);
        }
      );
    }),
  deletePaymentType: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "DELETE from payment where payment_id=?",
        id,
        (error, result) => {
          if (!error) {
            const newData = {
              account_id: id,
            };
            return resolve(newData);
          }
          return reject(error);
        }
      );
    }),
};
