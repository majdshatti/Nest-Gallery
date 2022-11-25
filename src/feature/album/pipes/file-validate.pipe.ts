import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any) {
    const maximumFileSize = 1000 * 1024 * 50;

    return value.size < maximumFileSize;
  }
}
