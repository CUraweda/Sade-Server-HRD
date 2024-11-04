const PDFDocument = require('pdfkit-table');
const { convertToIndonesianRupiahWords } = require('../helper/utils')
const fs = require('fs');
const constantData = require('../config/constant')

class PDFGenerator {
    constructor() {
        this.storageUrl = '/public/files/pdf'
        if (!fs.existsSync(this.storageUrl)) fs.mkdirSync(this.storageUrl, { recursive: true });
    }

    async generateSlipGaji(accountData, billData) {
        const doc = new PDFDocument({ margin: 60 });
        const documentFixed = { xStart: doc.opt.margin, yStart: doc.opt.margin, xEnd: doc.page.width - doc.opt.margin, yEnd: doc.page.width - doc.opt.margin }
        const urlToSave = `Slip-Gaji_${accountData.id}_${accountData.month_id}_${accountData.year}.pdf`
        const writeStream = fs.createWriteStream(urlToSave);
        const monthConstant = constantData.monthList

        doc.pipe(writeStream);
        doc.image('Sade Logo.png', documentFixed.xStart, documentFixed.yStart, { width: 50, height: 50 })

        doc
            .fontSize(20)
            .fillColor('#00af50')
            .text('Sekolah Alam Depok', { align: 'center' })
            .fillColor('#000000')
            .fontSize(12)
            .text('Jl. Bungsan No. 80 Bedahan, Sawangan', { align: 'center' })
            .text('Kota Depok      Telp. 081905252073', { align: 'center' })

        const slipGajiText = `Slip Gaji\n${monthConstant[accountData.month_id - 1]} 2024`
        doc.text(slipGajiText, documentFixed.xEnd - 100, documentFixed.yStart + (50 / 4), { align: 'center', width: 90 });
        doc.moveDown(2)
        doc.lineJoin('miter')
            .rect(documentFixed.xEnd - 100 - 5, documentFixed.yStart, 100, 50)
            .stroke();
        doc.lineCap('butt')
            .moveTo(documentFixed.xStart, doc.y)
            .lineTo(documentFixed.xEnd, doc.y)
            .stroke();

        doc.moveDown(1)
        doc.text(`Nama    : ${accountData.employee.full_name}`, documentFixed.xStart, doc.y, { align: 'left' });
        doc.text(`Jabatan : ${accountData.employee.occupation}`, { align: 'left' });
        doc.moveDown();

        // const tabelData = {
        //     headers: [" Pendapatan", "", " Potongan", ""],
        //     rows: billData.tableData
        // }
        // doc.table(tabelData, {
        //     width: doc.page.width - (doc.opt.margin * 2),

        //     prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        //         if(indexColumn)
        //         if (String(row[indexColumn]).startsWith(" ")) {
        //             doc.rect(rectCell.x, rectCell.y, rectCell.width * 2, rectCell.height).fill("#e1e1e1");
        //             doc.fillColor("#292929");
        //             doc.font('Helvetica-Bold');
        //         } else {
        //             doc.font('Helvetica');
        //             doc.fillColor("#292929");
        //         }
        //     }
        // });


        const tableData = {
            headers: [
                { label: "Pendapatan", property: 'title1' },
                { label: "", property: 'data1', renderer: (value, indexColumn, indexRow, row, rectRow, rectCell) => { return +value ? `Rp. ${Number(value).toLocaleString('id-ID')}` : '' } },
                { label: "Potongan", property: 'title2' },
                { label: "", property: 'data2', renderer: (value, indexColumn, indexRow, row, rectRow, rectCell) => { return +value ? `Rp. ${Number(value).toLocaleString('id-ID')}` : '' } },
            ],
            datas: billData.tableData
        }
        doc.table(tableData, {
            width: doc.page.width - (doc.opt.margin * 2),

            prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                if (String(row[indexColumn]).startsWith(" ")) {
                    doc.rect(rectCell.x, rectCell.y, rectCell.width * 2, rectCell.height).fill("#e1e1e1");
                    doc.fillColor("#292929");
                    doc.font('Helvetica-Bold');
                } else {
                    doc.font('Helvetica');
                    doc.fillColor("#292929");
                }
            }
        });

        doc.moveDown();
        doc.lineCap('butt')
            .moveTo(documentFixed.xStart, doc.y)
            .lineTo(documentFixed.xEnd, doc.y)
            .stroke();
        doc.moveDown(0.5);

        const tableTotalData = {
            headers: [
                { label: "", property: 'data1' },
                { label: "", property: 'data2', renderer: (value, indexColumn, indexRow, row, rectRow, rectCell) => { return `Rp. ${Number(value).toLocaleString('id-ID')}` } },
                { label: "", property: 'data3' },
                { label: "", property: 'data4', renderer: (value, indexColumn, indexRow, row, rectRow, rectCell) => { return value ? `Rp. ${Number(value).toLocaleString('id-ID')}` : '' } },
            ],
            datas: [
                { options: { separation: true }, data1: "bold:Total Pendapatan", data2: billData.totalPendapatan, data3: "bold:Total Potongan", data4: billData.totalPotongan },
                { data1: "bold:Gaji Bersih", data2: (billData.totalPendapatan - billData.totalPotongan) }
            ]
        }

        doc.table(tableTotalData, {
            width: doc.page.width - (doc.opt.margin * 2),
        });

        const indonesianString = convertToIndonesianRupiahWords(billData.totalPendapatan - billData.totalPotongan)
        doc.text(indonesianString, { align: "center" })
        doc.lineJoin('miter')
            .rect((doc.page.width / 2) - ((doc.widthOfString(indonesianString) / 2) + 10), doc.y - ((doc.heightOfString(indonesianString) / 2) + 10), doc.widthOfString(indonesianString) + 20, doc.heightOfString(indonesianString) + 10)
            .stroke();

        doc.moveDown(2);
        const currentDate = new Date()
        const locationTimeText = `Depok, ${currentDate.getDate()} ${monthConstant[currentDate.getMonth()].slice(0, 3)} ${currentDate.getFullYear()}`
        doc.text(locationTimeText, documentFixed.yEnd - doc.widthOfString(locationTimeText) - 20, doc.y, { align: 'center' });

        const sadeAssigner = "Adri Prima Leily"
        doc.text(sadeAssigner, { align: 'center' });
        doc.image('Sade TTD.png', documentFixed.xEnd - doc.widthOfString(sadeAssigner) - 20, doc.y, { width: doc.widthOfString(sadeAssigner), align: 'center' })

        doc.end();

        await writeStream.on('finish', () => { });
        return urlToSave
    }
}

const pdfGenerator = new PDFGenerator()

module.exports = pdfGenerator