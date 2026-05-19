import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT || "http://blackbox-minio:9000",
  region: process.env.S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "blackbox_admin",
    secretAccessKey: process.env.S3_SECRET_KEY || "$tr0ngMinIO2024!",
  },
  forcePathStyle: true,
});

const BUCKET = process.env.S3_BUCKET || "blackbox-crm";

export async function uploadFile(key: string, body: Buffer, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  await s3Client.send(command);

  // Construct public URL — use external endpoint for browser access
  const endpoint = process.env.S3_PUBLIC_ENDPOINT || process.env.S3_ENDPOINT || "http://blackbox-minio:9000";
  const publicBase = process.env.S3_PUBLIC_BASE || endpoint;
  return `${publicBase.replace(/\/$/, "")}/${BUCKET}/${key}`;
}

export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  await s3Client.send(command);
}

export function generateProfilePicKey(userId: string, extension: string): string {
  return `profile-pictures/${userId}_${Date.now()}.${extension}`;
}
