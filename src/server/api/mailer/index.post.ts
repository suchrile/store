import MailService from '@/server/services/mail.service'
import { mailSchema } from '@/server/schemas/mail'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { value: dto, error } = mailSchema.validate(body)

  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }

  return await MailService.sendPriceRequest(dto)
})
