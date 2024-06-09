const moment = require("moment");
const helpers = require("../helpers");
const { customErrorApi } = require("../helpers/CustomError");
const { promiseHandler } = require("../middleware/promiseHandler");
require("dotenv").config();

const axios = require("axios");
const alumniModel = require("../models/alumni");
const { encryptData } = require("../utils/encrypt");

module.exports = {
  postMessage: promiseHandler(async (req, res, next) => {
    const { students } = req.body;
    const key = process.env.WOOWA_KEY;

    try {
      for (let i = 0; i < students.length; i++) {
        await setTimeout(async () => {
          console.log(`+62${students[i].student_parent_phone.substring(1)}`);
          const encData = encryptData(students[i].student_id.toString());
          await axios.post("http://116.203.191.58/api/async_send_message", {
            phone_no: `+62${students[i].student_parent_phone.substring(1)}`,
            key,
            skip_link: false,
            flag_retry: "on",
            pendingTime: 3,
            message: `Assalamualaikum wr.wb. orang tua / wali siswa, kami dari STIKes Pelita Ilmu Depok ingin menginformasikan bahwa :  
            
Nama   :  ${students[i].student_full_name}
NIS    :  ${students[i].student_nis}
Kelas  :  ${students[i].class_name}
            
Memiliki tagihan sebesar Rp. ${helpers.rupiahConvert(
              parseInt(students[i].total_tagihan)
            )}

Detail tagihan : ${process.env.REACT_URL}/tagihan?iv=${
              encData.iv
            }&encryptedData=${encData.encryptedData}

*) Silahkan simpan nomor ini jika link tidak aktif.
             `,
            deliveryFlag: true,
          });
        }, 10000);
      }
    } catch (error) {
      console.log(error);
      return helpers.response(res, 404, "error", error);
    }

    return helpers.response(res, 200, "Send Message Successfully", {});
  }),
};
