import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

export async function uploadToCloudinary(
  file: File,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<UploadResult> {
  try {
    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    const uploadOptions = {
      resource_type: resourceType,
      folder: 'gift-box',
      transformation: resourceType === 'image' 
        ? [{ quality: 'auto', width: 1200, crop: 'limit' }]
        : resourceType === 'video'
        ? [{ quality: 'auto', duration: 30 }]
        : undefined,
    };

    return new Promise((resolve) => {
      cloudinary.uploader.upload(
        dataUri,
        uploadOptions,
        (error, result) => {
          if (error) {
            resolve({ success: false, error: error.message });
          } else if (result) {
            resolve({
              success: true,
              url: result.secure_url,
              publicId: result.public_id,
            });
          } else {
            resolve({ success: false, error: 'Upload failed' });
          }
        }
      );
    });
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch {
    return false;
  }
}

export function getCloudinaryUrl(publicId: string, transformations?: object): string {
  return cloudinary.url(publicId, {
    secure: true,
    ...transformations,
  });
}

export { cloudinary };

