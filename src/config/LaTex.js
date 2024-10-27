const PDFDocument = require('pdfkit-table');
const fs = require('fs');

class PDFGenerator {
    constructor() {
        this.storageUrl = 'public/files/pdf'
        if (!fs.existsSync(this.storageUrl)) fs.mkdirSync(this.storageUrl, { recursive: true });
    }

    async generateSlipGaji() {
        const doc = new PDFDocument({ margin: 30 });

        doc.pipe(fs.createWriteStream('slip-gaji.pdf'));

        doc
            .fontSize(20)
            .text('Sekolah Alam Depok', { align: 'center' })
            .fontSize(12)
            .text('Jl. Bungsan No. 80 Bedahan, Sawangan', { align: 'center' })
            .text('Kota Depok      Telp. 081905252073', { align: 'center' })
            .moveDown();

        // Add Employee Information
        doc.text('Slip Gaji - Mei 2024', { align: 'center' });
        doc.moveDown(2);
        doc.text('Nama: Yudi Rahman', { align: 'left' });
        doc.text('Jabatan: Staf HR BPJS', { align: 'left' });
        doc.moveDown();

        // Create the table for PENDAPATAN and POTONGAN
        const table = {
            headers: ['PENDAPATAN', 'POTONGAN'],
            rows: [
                ['Gaji Pokok 2 bln', '500.000Rp'],
                ['Tunj. Tetap BPJS', '-Rp'],
                ['Tunj. Fungsional 2 bln', '-Rp'],
                ['Tunj. Transport 1 bln', '-Rp'],
                ['Tunj. Jabatan', '-Rp'],
                ['BPJS', '-Rp'],
                ['Kantin 1 bln', '-Rp'],
                ['Lain-lain', '-Rp'],
            ],
        };

        // Draw the table
        doc.table(table, { width: doc.page.width - 60 });

        // Create the table for FASILITAS and FASILITAS LAINNYA
        const fasilitasTable = {
            headers: ['FASILITAS', 'POTONGAN'],
            rows: [
                ['Kantin', '-Rp'],
                ['Gaji pokok', '-Rp'],
                ['Transport', '-Rp'],
                ['Pinjaman', '-Rp'],
                ['Koperasi', '-Rp'],
                ['Catering Anak', '-Rp'],
                ['Kegiatan Anak', '-Rp'],
            ],
        };

        // Draw the table
        doc.moveDown();
        doc.table(fasilitasTable, { width: doc.page.width - 60 });

        // Add summary
        doc.moveDown();
        doc.text('TOTAL PENDAPATAN: 500.000Rp', { align: 'left' });
        doc.text('TOTAL POTONGAN: -Rp', { align: 'left' });
        doc.text('GAJI BERSIH: 500.000Rp', { align: 'left' });

        // Add Signature and Date
        doc.moveDown(2);
        doc.text('* 0 Depok, 10 Juni 2024', { align: 'left' });
        doc.text('Adri Prima Leily', { align: 'left' });
        doc.text('Lima Ratus Ribu Rupiah', { align: 'left' });

        // End the document
        doc.end();
    }
}

module.exports = PDFGenerator