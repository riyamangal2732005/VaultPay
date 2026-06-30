import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoicePDFFile = async (
  invoice: any,
  client: any
): Promise<string> => {
  const pdfDir = path.join(process.cwd(), "generated-pdfs");

  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
  }

  const fileName = `invoice-${invoice.invoiceNumber}.pdf`;

  const filePath = path.join(pdfDir, fileName);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();

    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(24).text("VaultPay", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(20).text("INVOICE", {
      align: "center",
    });

    doc.moveDown(2);

    doc.fontSize(14).text(
      `Invoice Number: ${invoice.invoiceNumber}`
    );

    doc.moveDown();

    doc.text(`Client Name: ${client.name}`);

    doc.text(`Email: ${client.email}`);

    doc.text(`Company: ${client.companyName}`);

    doc.moveDown();

    doc.text(`Amount: ₹${invoice.amount}`);

    doc.text(`Description: ${invoice.description}`);

    doc.text(`Status: ${invoice.status}`);

    doc.text(
      `Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`
    );

    doc.end();

    stream.on("finish", () => {
      resolve(filePath);
    });

    stream.on("error", reject);
  });
};