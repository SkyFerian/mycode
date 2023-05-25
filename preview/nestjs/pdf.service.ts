import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { createWriteStream } from 'fs';
import PDFKit, { end } from 'pdfkit';
import * as path from 'path';
import * as fs from 'fs';
//https://github.com/stuyy/nestjs-typeorm-mysql-course-repository
import express, { Request, Response } from 'express';

@Injectable()
export class PDFService {
  async downloadPDF(filename: string): Promise<NodeJS.ReadableStream> {
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'apps',
      'codex-api',
      'src',
      'assets',
      'uploads',
      filename
    );

    return fs.createReadStream(filePath);
  }
  async generatePDF(data: any): Promise<string> {
    const doc = new PDFKit();
    const endX = doc.page.width - 20;

    const codelogoPath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'apps',
      'codex-api',
      'src',
      'assets',
      'logos',
      'codelogo5.png'
    );

    doc
      .image(codelogoPath, 425, 10, {
        fit: [170, 170],
        align: 'center',
      })
      .stroke();
    // Stel het lettertype en de grootte in
    doc.font('Helvetica-Bold');
    doc.fontSize(30);
    // Voeg tekst toe op de x- en y-coördinaten 100 en 100
    doc.text('Factuur', 20, 15);
    doc.fontSize(12);
    // Stel het lettertype in op normaal
    doc.lineWidth(1);

    doc.lineCap('line').moveTo(20, 88).lineTo(endX, 88).stroke();
    // Voeg meer tekst toe op de x- en y-coördinaten 100 en 150
    doc.text('Bankgegevens', 20, 111);
    doc.text(data.client, 430, 99);
    doc.text('Codex', 20, 99);
    doc.text('IBAN:', 20, 125);
    doc.text('BIC:', 20, 139);

    doc.text('Informatie over de opdracht of bestelling.', 20, 240);
    doc.lineCap('line').moveTo(20, 275).lineTo(endX, 275).stroke();
    doc
      .lineJoin('round')
      .rect(20, 172, endX - 20, 50)
      .stroke();
    doc.text('FacNR:', 50, 180);
    doc.text('Datum', 160, 180);
    doc.text('Vervaldatum', 280, 180);
    doc.text('Referentie:', 400, 180);
    //deel 3
    doc.text('Beschrijving', 20, 295);
    doc.text('Aantal', 120, 295);
    doc.text('Tarief', 180, 295);
    doc.text('Korting', 240, 295);
    doc.text('BTW%', 300, 295);
    doc.text('BTW', 360, 295);
    doc.text('Totaal excl btw', 430, 295);
    doc.text('Totaalbedrag', 375, 350);
    doc.lineCap('line').moveTo(20, 330).lineTo(endX, 330).stroke();

    doc.font('Helvetica');
    //deel 1
    doc.text(data.addressclient, 430, 111);
    doc.text(data.postalclient + ' ' + data.city, 430, 125);
    doc.text(data.land, 430, 139);
    doc.text(data.enterprisenumber, 430, 153);
    doc.text('BE12 3456 7891 0123', 54, 125);
    doc.text('NBEBBE22XXX', 47, 139);
    //deel2
    doc.text(data.facnr, 50, 200);
    doc.text(data.createdat, 160, 200);
    doc.text(data.duedate, 280, 200);
    doc.text(data.statement, 400, 200);
    doc.text(data.information, 20, 252);

    let berekening = data.variety * data.amount;
    const korting = (berekening * data.discount) / 100;
    berekening = berekening - korting;
    const btw = (berekening * data.btwprocent) / 100;
    //deel 3
    doc.text(data.description, 20, 315);
    doc.text(data.variety, 120, 315);
    doc.text(data.amount + ' €', 180, 315);
    doc.text(data.discount + ' %', 240, 315);
    doc.text(data.btwprocent + ' %', 300, 315);
    doc.text(data.btw + ' €', 360, 315);
    doc.text(berekening.toString() + ' €', 430, 315);
    doc.text(data.totalamount + ' €', 465, 350);
    doc.fontSize(7);
    doc.text('Testadres 12, 2800, Mechelen, Belgie', 45, 690);
    doc.lineCap('line').moveTo(20, 670).lineTo(endX, 670).stroke();

    doc.font('Helvetica-Bold');
    doc.text('Codex:', 20, 690);
    doc.text('Ondernemingsnummer: BE 0000.111.222', 20, 700);
    return new Promise<string>((resolve, reject) => {
      const filename = data.facnr + 'VF.pdf';
      const filePath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'apps',
        'codex-api',
        'src',
        'assets',
        'uploads',
        filename
      );

      const writeStream = createWriteStream(filePath);
      doc.pipe(writeStream);

      writeStream.once('finish', () => {
        resolve(filename);
      });

      writeStream.once('error', (error) => {
        console.error('Error saving PDF:', error);
        reject(error);
      });
      doc.end();
    });
  }

  async removePDF(filename: string): Promise<void> {
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'apps',
      'codex-api',
      'src',
      'assets',
      'uploads',
      filename
    );

    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      throw error;
    }
  }
  async previewPDF(data: any, res: Response): Promise<void> {
    const doc = new PDFKit();
    const endX = doc.page.width - 20;

    const codelogoPath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'apps',
      'codex-api',
      'src',
      'assets',
      'logos',
      'codelogo5.png'
    );

    doc.image(codelogoPath, 425, 10, {
      fit: [170, 170],
      align: 'center',
    });

    doc.font('Helvetica-Bold');
    doc.fontSize(30);
    doc.text('Factuur', 20, 15);
    doc.fontSize(12);
    doc.lineWidth(1);

    doc.lineCap('butt').moveTo(20, 88).lineTo(endX, 88).stroke();
    doc.text('Bankgegevens', 20, 111);
    doc.text(data.client, 430, 99);
    doc.text('Codex', 20, 99);
    doc.text('IBAN:', 20, 125);
    doc.text('BIC:', 20, 139);

    doc.text('Informatie over de opdracht of bestelling.', 20, 240);
    doc.lineCap('butt').moveTo(20, 275).lineTo(endX, 275).stroke();
    doc
      .lineJoin('round')
      .rect(20, 172, endX - 20, 50)
      .stroke();
    doc.text('FacNR:', 50, 180);
    doc.text('Datum', 160, 180);
    doc.text('Vervaldatum', 280, 180);
    doc.text('Referentie:', 400, 180);

    doc.text('Beschrijving', 20, 295);
    doc.text('Aantal', 120, 295);
    doc.text('Tarief', 180, 295);
    doc.text('Korting', 240, 295);
    doc.text('BTW%', 300, 295);
    doc.text('BTW', 360, 295);
    doc.text('Totaal excl btw', 430, 295);
    doc.text('Totaalbedrag', 375, 350);
    doc.lineCap('butt').moveTo(20, 330).lineTo(endX, 330).stroke();

    doc.font('Helvetica');
    doc.text(data.addressclient, 430, 111);
    doc.text(data.postalclient + ' ' + data.city, 430, 125);
    doc.text(data.land, 430, 139);
    doc.text(data.enterprisenumber, 430, 153);
    doc.text('BE12 3456 7891 0123', 54, 125);
    doc.text('NBEBBE22XXX', 47, 139);

    doc.text(data.facnr, 50, 200);
    doc.text(data.createdat, 160, 200);
    doc.text(data.duedate, 280, 200);
    doc.text(data.statement, 400, 200);
    doc.text(data.information, 20, 252);

    let berekening = data.variety * data.amount;
    const korting = (berekening * data.discount) / 100;
    berekening = berekening - korting;
    const btw = (berekening * data.btwprocent) / 100;

    doc.text(data.description, 20, 315);
    doc.text(data.variety, 120, 315);
    doc.text(data.amount + ' €', 180, 315);
    doc.text(data.discount + ' %', 240, 315);
    doc.text(data.btwprocent + ' %', 300, 315);
    doc.text(data.btw + ' €', 360, 315);
    doc.text(berekening.toString() + ' €', 430, 315);
    doc.text(data.totalamount + ' €', 465, 350);
    doc.fontSize(7);
    doc.text('Testadres 12, 2800, Mechelen, Belgie', 45, 690);
    doc.lineCap('butt').moveTo(20, 670).lineTo(endX, 670).stroke();

    doc.font('Helvetica-Bold');
    doc.text('Codex:', 20, 690);
    doc.text('Ondernemingsnummer: BE 0000.111.222', 20, 700);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=preview.pdf');
    doc.pipe(res);
    console.log(res);
  }
}
