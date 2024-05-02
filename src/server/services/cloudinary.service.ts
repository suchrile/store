/* eslint-disable import/named */

import { v2 as cloudinary } from 'cloudinary'

class CloudinaryService {
  protected readonly _cloudinary

  constructor () {
    const config = useRuntimeConfig()
    cloudinary.config({
      cloud_name: config.cloudinaryCloudName,
      api_key: config.cloudinaryApiKey,
      api_secret: config.cloudinaryApiSecret
    })
    this._cloudinary = cloudinary
  }

  upload (file: string) {
    return this._cloudinary.uploader.upload(file)
  }

  remove (publicId: string) {
    return this._cloudinary.uploader.destroy(publicId)
  }
}

export default new CloudinaryService()
