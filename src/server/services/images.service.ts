import { prisma } from '@/server/repositories'
import CloudinaryService from '@/server/services/cloudinary.service'
import type {
  PrismaProductWithIncludes,
  ProductImageUpdateDto
} from '@/interfaces'

type ImageCreateDto = {
  productId: number;
  url: string;
  isPrimary: boolean;
};

type ImageDeleteDto = {
  id: number;
  publicId: string;
};

class ImagesService {
  private readonly _repository
  private readonly _cloudinaryService

  constructor () {
    this._repository = prisma.productImage
    this._cloudinaryService = CloudinaryService
  }

  private async _create (images: ImageCreateDto[]) {
    const promises = []
    for (const image of images) {
      const cloudImage = await this._cloudinaryService.upload(image.url)
      promises.push(
        this._repository.create({
          data: {
            productId: image.productId,
            publicId: cloudImage.public_id,
            url: cloudImage.secure_url,
            isPrimary: image.isPrimary
          }
        })
      )
    }
    return prisma.$transaction(promises)
  }

  private async _delete (images: ImageDeleteDto[]) {
    const promises = []
    for (const image of images) {
      await this._cloudinaryService.remove(image.publicId)
      promises.push(
        this._repository.delete({
          where: { id: image.id }
        })
      )
    }
    return prisma.$transaction(promises)
  }

  async updateImages (
    productId: number,
    productImages: PrismaProductWithIncludes['images'],
    dtoImages: ProductImageUpdateDto[]
  ) {
    const newImages = dtoImages.filter(img => !img.id)
    const imagesToDelete = productImages.filter(
      img => !dtoImages.some(el => img.id === el.id)
    )

    if (newImages.length) {
      const images = newImages.map(img => ({ ...img, productId }))
      await this._create(images)
    }

    if (imagesToDelete.length) {
      await this._delete(imagesToDelete)
    }
  }
}

export default new ImagesService()
