const express = require("express");
const authRoutes = require("./auth");
const prodiRoutes = require("./program-studi");
const kelasRoutes = require("./kelas");
const tahunAjaranRoutes = require("./tahun-ajaran");
const statusSiswaRoutes = require("./status-siswa");
const siswaRoutes = require("./siswa");
const alumniRoutes = require("./alumni");
const accountCostRoutes = require("./account-cost");
const posPayRoutes = require("./pos-pay");
const paymentTypeRoutes = require("./payment-type");
const piutangRoutes = require("./piutang");
const paymentRateRoutes = require("./payment-rate");
const paymentTransactionRoutes = require("./payment-transaction");
const whatsappRoutes = require("./whatsapp");
const detailFreePaymentRateRoutes = require("./detail-free-payment-transaction");
const dataDashboardRoutes = require("./dashboard");
const dokumenRoutes = require("./dokumen");
const unitRoutes = require("./unit");
const cashAccountRoutes = require("./cash-account");
const kreditRoutes = require("./kredit");
const debitRoutes = require("./debit");
const reportRoutes = require("./report");

const Routes = express.Router();

Routes.use("/auth", authRoutes);
Routes.use("/program-studi", prodiRoutes);
Routes.use("/kelas", kelasRoutes);
Routes.use("/tahun-ajaran", tahunAjaranRoutes);
Routes.use("/status-siswa", statusSiswaRoutes);
Routes.use("/siswa", siswaRoutes);
Routes.use("/alumni", alumniRoutes);
Routes.use("/account-cost", accountCostRoutes);
Routes.use("/pos-pay", posPayRoutes);
Routes.use("/payment-type", paymentTypeRoutes);
Routes.use("/piutang", piutangRoutes);
Routes.use("/payment-rate", paymentRateRoutes);
Routes.use("/payment-transaction", paymentTransactionRoutes);
Routes.use("/whatsapp", whatsappRoutes);
Routes.use("/detail-free-payment-rate", detailFreePaymentRateRoutes);
Routes.use("/dashboard", dataDashboardRoutes);
Routes.use("/dokumen", dokumenRoutes);
Routes.use("/unit", unitRoutes);
Routes.use("/cash-account", cashAccountRoutes);
Routes.use("/kredit", kreditRoutes);
Routes.use("/debit", debitRoutes);
Routes.use("/laporan", reportRoutes);

module.exports = Routes;
