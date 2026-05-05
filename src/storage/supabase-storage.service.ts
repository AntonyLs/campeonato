import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

type UploadedFile = {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

@Injectable()
export class SupabaseStorageService {
  private readonly s3Endpoint = process.env.SUPABASE_S3_ENDPOINT;
  private readonly region = process.env.SUPABASE_S3_REGION ?? 'us-west-2';
  private readonly accessKeyId = process.env.SUPABASE_S3_ACCESS_KEY_ID;
  private readonly secretAccessKey =
    process.env.SUPABASE_S3_SECRET_ACCESS_KEY;
  private readonly bucket = process.env.SUPABASE_STORAGE_BUCKET ?? 'players';
  private readonly projectUrl =
    process.env.SUPABASE_PROJECT_URL ?? this.deriveProjectUrlFromEndpoint();

  async uploadPlayerPhoto(file: UploadedFile) {
    this.ensureConfiguration();
    this.ensureImageFile(file);

    const extension = this.getFileExtension(file.originalname, file.mimetype);
    const objectPath = `players/${new Date().getFullYear()}/${randomUUID()}.${extension}`;
    const client = this.createClient();

    try {
      await client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: objectPath,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `No se pudo subir la foto a Supabase S3. ${this.stringifyError(error)}`,
      );
    }

    return {
      path: objectPath,
      publicUrl: `${this.projectUrl}/storage/v1/object/public/${this.bucket}/${objectPath}`,
    };
  }

  private ensureConfiguration() {
    if (
      !this.s3Endpoint ||
      !this.accessKeyId ||
      !this.secretAccessKey ||
      !this.projectUrl
    ) {
      throw new InternalServerErrorException(
        'Falta configurar SUPABASE_S3_ENDPOINT, SUPABASE_S3_ACCESS_KEY_ID, SUPABASE_S3_SECRET_ACCESS_KEY o SUPABASE_PROJECT_URL.',
      );
    }
  }

  private createClient() {
    return new S3Client({
      region: this.region,
      endpoint: this.s3Endpoint,
      credentials: {
        accessKeyId: this.accessKeyId!,
        secretAccessKey: this.secretAccessKey!,
      },
      forcePathStyle: true,
    });
  }

  private ensureImageFile(file?: UploadedFile) {
    if (!file) {
      throw new BadRequestException('Debes enviar una imagen.');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Solo se permiten archivos de imagen.');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException(
        'La imagen excede el maximo permitido de 5 MB.',
      );
    }
  }

  private getFileExtension(originalname: string, mimetype: string) {
    const fromName = originalname.split('.').pop()?.trim().toLowerCase();

    if (fromName) {
      return fromName;
    }

    const [, subtype = 'jpg'] = mimetype.split('/');
    return subtype.toLowerCase();
  }

  private deriveProjectUrlFromEndpoint() {
    if (!this.s3Endpoint) {
      return undefined;
    }

    try {
      const endpoint = new URL(this.s3Endpoint);
      const host = endpoint.host;

      if (!host.endsWith('.storage.supabase.co')) {
        return undefined;
      }

      const projectRef = host.replace('.storage.supabase.co', '');
      return `https://${projectRef}.supabase.co`;
    } catch {
      return undefined;
    }
  }

  private stringifyError(error: unknown) {
    if (error instanceof Error) {
      return error.message;
    }

    return String(error);
  }
}
