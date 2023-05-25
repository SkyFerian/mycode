import {
  Controller,
  Post,
  Body,
  Get,
  Res,
  Param,
  Delete,
  Patch,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { PDFService } from './pdf.service';
@Controller('files')
//@UseGuards(JwtAuthGuard)
export class PDFController {
  constructor(private readonly pdfService: PDFService) {}

  @Post('/pdf')
  async generatePDF(@Body() data: any, @Res() res: Response) {
    const filename = await this.pdfService.generatePDF(data);
    res.sendFile(filename, {
      root: path.join(
        __dirname,
        '..',
        '..',
        '..',
        'apps',
        'codex-api',
        'src',
        'assets',
        'uploads'
      ),
    });
  }
  @Post('/preview')
  async previewPDF(@Body() data: any, @Res() res: Response) {
    const fileBuffer = await this.pdfService.previewPDF(data, res);

    res.setHeader('Content-Type', 'application/pdf');
    res.send(fileBuffer);
  }
  @Delete('remove/:filename')
  async removePDF(@Param('filename') filename: string): Promise<void> {
    await this.pdfService.removePDF(filename);
  }
  @Get('download/:filename')
  downloadPDF(@Param('filename') filename: string, @Res() res: Response) {
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

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  }
}
