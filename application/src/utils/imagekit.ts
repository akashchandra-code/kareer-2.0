import ImageKit from "imagekit";
import { v4 as uuidv4 } from "uuid";
import { env } from "../config/env"; 

const imagekit = new ImageKit({
  publicKey: env.IMAGEKIT_PUBLIC_KEY,
  privateKey: env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: env.IMAGEKIT_URL_ENDPOINT,
});

interface uploadParams {
  buffer: Buffer;
  folder?: string;
}
interface uploadResult {
    url: string;
    fileId: string;
    name: string;
    
}

const uploadImage = async ({ buffer, folder = "resume" }: uploadParams): Promise<uploadResult> => {
    const res = await imagekit.upload({
        file: buffer,
        fileName:uuidv4(),
        folder,
    })
    return {
        url: res.url,
        fileId: res.fileId,
        name: res.name,
    }
}

export default uploadImage;