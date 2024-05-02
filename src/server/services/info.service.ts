import ObjectsRepository from '@/server/repositories/objects.repository'
import type { Info } from '@/interfaces'

class InfoService {
  private readonly _infoObjectId
  private readonly _repository

  constructor () {
    this._infoObjectId = 1
    this._repository = ObjectsRepository
  }

  async get () {
    const infoObject = await this._repository.findOne(this._infoObjectId)
    return infoObject && infoObject.data
  }

  async update (dto: Info) {
    const infoObject = await this._repository.upsert(this._infoObjectId, dto)
    return infoObject.data
  }
}

export default new InfoService()
