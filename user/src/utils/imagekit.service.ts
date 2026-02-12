import ImageKit from "imagekit";
import { v4 as uuidv4 } from "uuid";
import { env } from "../config/env";

export const imagekit = new ImageKit({
  publicKey: env.IMAGEKIT_PUBLIC_KEY,
  privateKey: env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: env.IMAGEKIT_URL_ENDPOINT,
});

interface UploadImageParams {
  buffer: Buffer;
  folder?: string;
}

interface UploadImageResponse {
  url: string;
  thumbnail: string;
  id: string;
}

export const uploadImage = async ({
  buffer,
  folder = "/pfp",
}: UploadImageParams): Promise<UploadImageResponse> => {
  const res = await imagekit.upload({
    file: buffer,
    fileName: uuidv4(),
    folder,
  });

  return {
    url: res.url,
    thumbnail: res.thumbnailUrl || res.url,
    id: res.fileId,
  };
};
