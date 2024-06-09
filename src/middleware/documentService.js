const puppeteer = require("puppeteer");

const path = require("path");
const fs = require("fs");
const { dateConvert, rupiahConvert, terbilang_rupiah } = require("../helpers");
const moment = require("moment");
const {
  tableHtmlRincianPembayaran,
  tableTagihanPembayaran,
  tableKwitansiPembayaran,
  tableKasKredit,
  tableKasDebit,
} = require("../assets/htmlTemplate");
module.exports = {
  pdfGenerate: async function (htmlFile, opts = {}) {
    try {
      const {
        margin = {
          top: "0.4in",
          right: "0.4in",
          bottom: "0.4in",
          left: "0.4in",
        },
        format = "Letter",
      } = opts;
      // CREATE PDF USING PUPETEER
      const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const page = await browser.newPage();
      await page.setContent(htmlFile, { waitUntil: "domcontentloaded" });
      //   page = page.replace(/NAMA_BORROWER/g, borrower.nama_borrower);

      //   await page.emulateMedia("screen");
      const buffer = await page.pdf({
        printBackground: true,
        margin,
        format,
        preferCSSPageSize: true,
      });
      await browser.close();
      return buffer;
    } catch (err) {
      console.log(err);
    }
  },

  generateRincianPembayaran: async function (htmlFileUrl, datas) {
    console.log(datas);
    //baca file
    let html = fs.readFileSync(path.join(__dirname, htmlFileUrl), "utf-8");

    html = html.replace(
      "VALUE_TAHUN_AJARAN",
      `${datas.period_start}/${datas.period_end}`
    );
    html = html.replace(
      "VALUE_KELAS_SISWA",
      `${datas.majors_majors_name} - ${datas.class_class_name}`
    );
    html = html.replace("VALUE_NAMA_SISWA", datas.student_full_name);
    html = html.replace("VALUE_NIS_SISWA", datas.student_nis);
    html = html.replace(
      "VALUE_TANGGAL_DOKUMEN",
      `Depok, ${moment().locale("id").format("DD MMMM YYYY")}`
    );
    html = html.replace("VALUE_NIP", "");
    let tableRows = "";
    datas.data_payment.forEach((data, index) => {
      tableRows += tableHtmlRincianPembayaran(data, index, datas);
    });
    html = html.replace("VALUE_TABEL_PEMBAYARAN", tableRows);

    const buffer = await module.exports.pdfGenerate(html);
    return buffer;
  },
  generateTagihanPembayaran: async (htmlFileUrl, datas) => {
    let html = fs.readFileSync(path.join(__dirname, htmlFileUrl), "utf-8");
    html = html.replace("VALUE_NIS_SISWA", datas.student_nis);
    html = html.replace("VALUE_NAMA_SISWA", datas.student_full_name);
    html = html.replace("VALUE_KELAS_SISWA", datas.class_class_name);
    html = html.replace(
      "VALUE_TAHUN_AJARAN",
      `${datas.period_start}/${datas.period_end}`
    );
    let tableRows = "";
    datas.current_billing.bill.forEach((data, index) => {
      tableRows += tableTagihanPembayaran(data, index, datas);
    });
    html = html.replace("VALUE_TABEL_TAHUN_AJARAN_SEKARANG", tableRows);
    html = html.replace(
      "VALUE_TOTAL_TAGIHAN_SISWA_SEKARANG",
      rupiahConvert(datas.current_billing.total_bill)
    );

    let tableRowsLalu = "";
    console.log(datas.previous_billing);
    datas.previous_billing.bill.forEach((data, index) => {
      tableRowsLalu += tableTagihanPembayaran(data, index, datas);
    });
    console.log(tableRowsLalu);
    html = html.replace("VALUE_TABEL_TAHUN_AJARAN_LALU", tableRowsLalu);
    html = html.replace(
      "VALUE_TOTAL_TAGIHAN_SISWA_LALU",
      rupiahConvert(datas.previous_billing.total_bill)
    );
    html=html.replace("VALUE_TOTAL",rupiahConvert(datas.previous_billing.total_bill+datas.current_billing.total_bill))
    html = html.replace(
      "VALUE_TANGGAL_DOKUMEN",
      `Depok, ${moment().locale("id").format("DD MMMM YYYY")}`
    );
    html = html.replace("VALUE_NIP", "");

    const buffer = await module.exports.pdfGenerate(html);
    return buffer;
  },
  generateKwitansiPembayaran: async (htmlFileUrl, datas) => {
    let html = fs.readFileSync(path.join(__dirname, htmlFileUrl), "utf-8");
    html = html.replace("VALUE_NIS_SISWA", datas.student_nis);
    html = html.replace("VALUE_NAMA_SISWA", datas.student_full_name);
    html = html.replace("VALUE_KELAS_SISWA", datas.class_class_name);
    html = html.replace("VALUE_TAHUN_AJARAN", `${datas.tahun_ajaran}`);
    html = html.replace(
      "VALUE_TANGGAL_SISWA",
      `${dateConvert(
        datas.payment[0].payment_rate_date_pay ?? datas.payment[0].created_at
      )}`
    );
    html = html.replace("VALUE_NO_REFERENSI", `${datas.no_ref}`);
    html = html.replace(
      "VALUE_AKUN_KAS_SISWA",
      datas.payment[0]?.payment_rate_via_name
    );
    let tableRows = "";
    datas.payment.forEach((data, index) => {
      tableRows += tableKwitansiPembayaran(data, index, datas);
    });
    html = html.replace("VALUE_TABEL_PEMBAYARAN", tableRows);

    html = html.replace(
      "VALUE_TOTAL_PEMBAYARAN",
      `${rupiahConvert(datas.total)}`
    );
    html = html.replace(
      "VALUE_TERBILANG",
      `${terbilang_rupiah(datas.total)} Rupiah`
    );

    html = html.replace(
      "VALUE_TANGGAL_DOKUMEN",
      `Depok, ${moment().locale("id").format("DD MMMM YYYY")}`
    );
    html = html.replace("VALUE_NIP", "");

    const buffer = await module.exports.pdfGenerate(html);
    return buffer;
  },

  generateKredit: async (htmlFileUrl, datas) => {
    console.log(datas);
    let html = fs.readFileSync(path.join(__dirname, htmlFileUrl), "utf-8");
    html = html.replace("VALUE_TITLE_DOKUMEN", "Bukti Kas Keluar");
    html = html.replace(/VALUE_NO_REFERENSI/g, datas[0].kredit_no_ref);
    html = html.replace(
      "VALUE_AKUN_KAS",
      `${datas[0].account_cash_account_desc}`
    );
    html = html.replace(
      "VALUE_TANGGAL",
      dateConvert(datas[0].kredit_created_at)
    );
    html = html.replace("VALUE_RINCIAN", "pengeluaran");
    html = html.replace("VALUE_HEADER_JUMLAH", "Jumlah Pengeluaran");
    html = html.replace("VALUE_HEADER_TOTAL", "Jumlah Total Pengeluaran");
    html = html.replace(
      "VALUE_TERBILANG",
      `${terbilang_rupiah(datas[0].kredit_value)} Rupiah`
    );
    html = html.replace(
      "VALUE_TOTAL",
      rupiahConvert(parseInt(datas[0].kredit_value, 10))
    );

    let tableRows = "";
    datas.forEach((data, index) => {
      tableRows += tableKasKredit(data, index);
    });
    html = html.replace("VALUE_TABEL_KAS", tableRows);
    const buffer = await module.exports.pdfGenerate(html);
    return buffer;
  },

  generateDebit: async (htmlFileUrl, datas) => {
    console.log(datas);
    let html = fs.readFileSync(path.join(__dirname, htmlFileUrl), "utf-8");
    html = html.replace("VALUE_TITLE_DOKUMEN", "Bukti Kas Keluar");
    html = html.replace(/VALUE_NO_REFERENSI/g, datas[0].debit_no_ref);
    html = html.replace(
      "VALUE_AKUN_KAS",
      `${datas[0].account_cash_account_desc}`
    );
    html = html.replace(
      "VALUE_TANGGAL",
      dateConvert(datas[0].debit_created_at)
    );
    html = html.replace("VALUE_RINCIAN", "pengeluaran");
    html = html.replace("VALUE_HEADER_JUMLAH", "Jumlah Pemasukan");
    html = html.replace("VALUE_HEADER_TOTAL", "Jumlah Total Pemasukan");
    html = html.replace(
      "VALUE_TERBILANG",
      `${terbilang_rupiah(datas[0].debit_value)} Rupiah`
    );
    html = html.replace(
      "VALUE_TOTAL",
      rupiahConvert(parseInt(datas[0].debit_value, 10))
    );

    let tableRows = "";
    datas.forEach((data, index) => {
      tableRows += tableKasDebit(data, index);
    });
    html = html.replace("VALUE_TABEL_KAS", tableRows);
    const buffer = await module.exports.pdfGenerate(html);
    return buffer;
  },
};
