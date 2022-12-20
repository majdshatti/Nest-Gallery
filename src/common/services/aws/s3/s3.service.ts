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

  /**
   * Uploads a file to s3 bucket
   * 
   * @param file Multer file
   * @param path the path of the object to be created or to be updated
   * @param flag marks if it's updating process
   * 
   * @returns S3.ManagedUpload.SendData
   */
  uploadFile = (file: Express.Multer.File, path: string, flag?: 'update') => {
    return this.s3
      .upload({
        Bucket: this.bucketName,
        Body: file.buffer,
        Key: flag === 'update' ? path : (path + '/' + file.originalname),
      })
      .promise();
  };

  /**
   * Deletes and object from aws s3 bucket
   * 
   * @param path the path of desired file
   * 
   * @returns PromiseResult<S3.DeleteObjectOutput, AWSError>
   */
  deleteFile = (path: string) => {
    return this.s3
      .deleteObject({
        Bucket: this.bucketName,
        Key: path,
      })
      .promise();
  }
}
