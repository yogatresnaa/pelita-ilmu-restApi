const connection = require("../config/db.config");

module.exports = {
  getAllActiveSiswa: (query) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT count(student_id) as jumlah_siswa_aktif FROM view_student where student_status=1`,
        (error, result) => {
          if (!error) {
            resolve(result[0]);
          } else {
            reject(error);
          }
        }
      );
    }),
};
