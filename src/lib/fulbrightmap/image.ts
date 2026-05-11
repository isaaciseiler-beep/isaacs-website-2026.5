const MAX_IMAGE_SIDE = 1400;
const JPEG_QUALITY = 0.78;

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

function canvasToBlob(canvas: HTMLCanvasElement, type = "image/jpeg") {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Could not compress this image."));
      },
      type,
      JPEG_QUALITY,
    );
  });
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read this image."));
    reader.readAsDataURL(blob);
  });
}

export function validateImageFile(file: File) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Please upload a JPG, PNG, WebP, or GIF image.";
  }

  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return "Please choose an image under 5MB.";
  }

  return null;
}

export async function compressImage(file: File) {
  const image = await createImageBitmap(file);
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("This browser could not process the image.");

  context.drawImage(image, 0, 0, width, height);
  image.close();

  return canvasToBlob(canvas);
}

export async function compressImageToDataUrl(file: File) {
  return blobToDataUrl(await compressImage(file));
}
