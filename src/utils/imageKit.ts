import { config } from "dotenv"
import ImageKit from "imagekit"

config()
const PublicKey: string = process.env.IMAGES_KIT_IO_PUBLIC_KEY || ''
const PrivateKey: string = process.env.IMAGES_KIT_IO_PRIVATE_KEY || ''
const UrlEndpoint: string = process.env.IMAGES_KIT_IO_URL_ENDPOINT || ''

export const imageKit = new ImageKit({
    publicKey: PublicKey,
    privateKey: PrivateKey,
    urlEndpoint: UrlEndpoint
})