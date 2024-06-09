const { dateConvert, rupiahConvert } = require("../../helpers");

module.exports = {
  tableHtmlRincianPembayaran: function (data, index, datas) {
    return `<tr>
        <td>${index + 1}</td>
        <td>${data.pos_pay_name} T.A ${datas.period_start}/${datas.period_end}${
      data.month_name
        ? `(${data.month_name} ${
            parseInt(data.month_month_id) - 6 <= 0
              ? `${datas.period_start}`
              : `${datas.period_end}`
          })`
        : " (bebas)"
    }</td>
        <td>${
          data.payment_rate_date_pay
            ? dateConvert(data.payment_rate_date_pay)
            : "-"
        }</td>
        <td>${rupiahConvert(
          data.payment_rate_status == 0
            ? data.payment_rate_total_pay || data.payment_rate_bill
            : "-"
        )}</td>
        <td>${data.payment_rate_status == 1 ? "Lunas" : "Belum Lunas"}</td>
        <td>${
          data.payment_type == "BULANAN"
            ? data.payment_rate_via_name || "-"
            : "-"
        }</td>
    </tr>`;
  },
  tableTagihanPembayaran: (data, index, datas) => `  <tr>
  <td>${index + 1}</td>
  <td>${data.pos_pay_name} T.A ${data.period_start}/${data.period_end}${
    data.month_name ? `(${data.month_name})` : " (bebas)"
  }</td>
  <td>${rupiahConvert(parseInt(data.payment_rate_bill, 10))}</td>

</tr>`,
  tableKasKredit: (data, index) => `  <tr>
  <td>${index + 1}</td>
  <td>${data.account_cost_account_code}-${data.account_cost_account_desc}</td>
  <td>${data.kredit_information}
</td>
  <td>${rupiahConvert(parseInt(data.kredit_value, 10))}</td>

</tr>`,
  tableKasDebit: (data, index) => `  <tr>
  <td>${index + 1}</td>
  <td>${data.account_cost_account_code}-${data.account_cost_account_desc}</td>
  <td>${data.debit_information}
  </td>
  <td>${rupiahConvert(parseInt(data.debit_value, 10))}</td>

</tr>`,
  tableKwitansiPembayaran: (data, index, datas) => `  <tr>
  <td>${index + 1}</td>
  <td>${data.pos_pay_name} T.A ${data.period_start}/${data.period_end}${
    data.month_name ? `(${data.month_name})` : " (bebas)"
  }</td>
  <td>${rupiahConvert(
    parseInt(
      (data.month_month_id
        ? data.payment_rate_bill
        : data.payment_rate_bill - data.payment_rate_discount) ?? 0,
      10
    )
  )}</td>
  <td>${rupiahConvert(
    parseInt(
      (data.payment_rate_bebas_pay_bill || data.payment_rate_bill) ?? 0,
      10
    )
  )}</td>
  <td>${rupiahConvert(
    parseInt(data.payment_rate_bebas_pay_remaining ?? "-", 10)
  )}</td>

</tr>`,

  tableLaporanPerTanggal: () => `
<section style="display: flex; flex-direction: column;">
<table>
    <thead>
        <th>NO.</th>
        <th>NIS</th>
        <th>NAMA SISWA</th>
        <th>TAGIHAN</th>
        <th>SUDAH BAYAR</th>
        <th>KEKURANGAN</th>
        <th>KETERANGAN</th>
    </thead>
    <tbody>
        VALUE_TABEL_PEMBAYARAN_PER_TANGGAL
    </tbody>
</table>
<div style="width: 100%; align-self: flex-end; margin-top: 1rem;background-color: lightgray;">
    <div style="display: flex;">
        <p style="flex: 1;"><strong>TOTAL PEMBAYARAN SISWA</strong></p>
        <p style="flex:1;"><strong>VALUE_TOTAL_PEMBAYARAN_SISWA</strong></p>

    </div>

</div>
</section>


<section
style="margin-top: 3rem; padding-inline: 2rem; display: flex; justify-content: flex-end; align-items: flex-end; flex-direction: column;">
<div style="flex: 1; justify-self: flex-end;">

    <p>VALUE_TANGGAL_DOKUMEN</p>
    <p>Bendahara</p>
    <p style="margin-top: 3rem;">
        <strong>TOMY HARIANTO</strong>
    </p>
    <p>NIP. VALUE_NIP</p>
</div>
</section>`,
};
