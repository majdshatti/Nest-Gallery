import { Injectable, PipeTransform } from '@nestjs/common';
import * as path from 'path';
import * as sharp from 'sharp';
import { sanitizeString } from 'src/common/utils';

@Injectable()
export class ImageOptimizerPipe implements PipeTransform {
  async transform(image: Express.Multer.File): Promise<Express.Multer.File> {
    const originalName = path.parse(image.originalname).name;
    const filename =
      sanitizeString(originalName) +
      '_' +
      Date.now() +
      path.parse(image.originalname).ext;

    const buffer = await sharp(image.buffer).resize(800).toBuffer();

    image.originalname = filename;
    image.buffer = buffer;

    return image;
  }
}
