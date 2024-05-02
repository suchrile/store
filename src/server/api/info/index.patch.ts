import { infoSchema } from '~/server/schemas/info'
import InfoService from '@/server/services/info.service'

export default defineEventHandler(async (event) => {
  if (!event.context.authed) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const body = await readBody(event)

  const { value: dto, error } = infoSchema.validate(body)

  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message
    })
  }

  return InfoService.update(dto)
})
