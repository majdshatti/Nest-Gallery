import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class S3Service {
  private readonly s3: S3;
  private readonly bucketName: string;

  constructor() {
    this.s3 = new S3({
      region: process.env.AWS_BUCKET_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    });

    this.bucketName = process.env.AWS_BUCKET_NAME;
  }

  uploadFile = (file: Express.Multer.File, path: string) => {
    return this.s3
      .upload({
        Bucket: this.bucketName,
        Body: file.buffer,
        Key: `${path}/` + file.originalname,
      })
      .promise();
  };
}
