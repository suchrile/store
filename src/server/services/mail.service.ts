import { createTransport } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import type { RequestPriceMailDto } from '@/server/types/mail'

class MailService {
  private readonly _smtpBotUser
  private readonly _smtpInfoUser
  private readonly _smtpUserName
  private readonly _transporter

  constructor () {
    const config = useRuntimeConfig()
    this._smtpBotUser = config.smtpBotUser
    this._smtpInfoUser = config.smtpInfoUser
    this._smtpUserName = config.smtpUserName
    this._transporter = createTransport(
      {
        host: config.smtpHost,
        port: Number(config.smtpPort),
        secure: Number(config.smtpPort) === 465,
        auth: {
          user: this._smtpBotUser,
          pass: config.smtpBotPassword
        }
      },
      {
        from: {
          name: this._smtpUserName,
          address: this._smtpBotUser
        },
        replyTo: {
          name: this._smtpUserName,
          address: this._smtpInfoUser
        }
      }
    )
  }

  private async send (mailOptions: Mail.Options) {
    try {
      await this._transporter.sendMail(mailOptions)
      return { message: 'OK' }
    } catch (e) {
      throw createError({
        statusCode: 500,
        message: 'Произошла неизвестная ошибка'
      })
    }
  }

  async sendPriceRequest (dto: RequestPriceMailDto) {
    return await this.send({
      to: dto.email,
      replyTo: this._smtpInfoUser,
      subject: 'Мы получили от Вас запрос прайс-листа',
      html: `
<div style="width: 100%">
  <div style="padding: 15px 25px; color: white; text-align: center; background-color: #a855f7;">
    <h4 style="width: 100%; max-width: 400px; margin: 0 auto;">Ваши данные</h4>
  </div>
  <div style="background-color: #eff3f8">
    <div style="width: 100%; max-width: 400px; margin: 0 auto; padding: 40px 25px; font-size: 20px;">
      <div style="margin-bottom: 12px"><b>Имя:</b> ${dto.name}</div>
      <div style="margin-bottom: 12px"><b>Номер телефона:</b> ${
        dto.phone || '<span style="color: grey;">не заполнено</span>'
      }</div>
      <div style="margin-bottom: 12px"><b>Email:</b> ${dto.email}</div>
      <div style="margin-bottom: 12px"><b>Компания:</b> ${
        dto.company || '<span style="color: grey;">не заполнено</span>'
      }</div>
      <div style="margin-bottom: 12px"><b>Город:</b> ${
        dto.city || '<span style="color: grey;">не заполнено</span>'
      }</div>
      <div style="margin-bottom: 12px"><b>Комментарий:</b> ${
        dto.comment || '<span style="color: grey;">не заполнено</span>'
      }</div>
    </div>
  </div>
</div>
        `
    })
  }
}

export default new MailService()
