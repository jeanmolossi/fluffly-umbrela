import { NotFoundErr } from "@/shared/domain/http-errors";
import { EmailProvider } from "@/shared/infra/providers/email.provider";
import { Users } from "@/users/domain";
import { OTP } from "@/users/domain/otp";
import { Inject, Injectable } from "@nestjs/common";
import { FindOneRepository } from "../repository/find-one.repository";

@Injectable()
export class RecoverAccountService{
	constructor(
		@Inject(FindOneRepository)
		private readonly findOne: Users.FindOneRepository,
		@Inject(EmailProvider)
		private readonly emailProvider: EmailProvider,
	) {}

	async run(email: string): Promise<OTP> {
		const user = await this.findOne.run({ email })

		if (!user) {
			throw new NotFoundErr('User not found')
		}

		const otp = new OTP({
			email,
			otp: Math.round(Math.random() * 1e6),
			timestamp: Date.now() + 1000 * 60 * 60 // +1 Hour
		})

		const sender = (await this.emailProvider.init())
			.setFrom({ name: 'Fluffy Umbrela Finances', email: 'suport@fluffy.com' })
			.setTo(email)
			.setSubject('E-mail de recuperação de conta')
			.setText(this.recoverMessage(otp))
			.setHtml(this.recoverHtml(otp))

		await sender.send()

		return otp
	}

	private getLink(otp: OTP): string {
		const host = `https://example.com`
		const urlEmail = encodeURIComponent(otp.email)
		return `${host}/recuperar-senha?otp=${otp.otp}&amp;timestamp=${otp.timestamp}&email=${urlEmail}&hash=${otp.generate()}`
	}

	private recoverMessage(otp: OTP): string {
		return `Seu link de recuperação de conta está aqui:\n\n${this.getLink(otp)}`
	}

	private recoverHtml(otp: OTP): string {
		const link = this.getLink(otp)
		return `Seu link de recuperação de conta está aqui:<br /><br />` +
			`<a href="${link}">${link}</a>`
	}
}
