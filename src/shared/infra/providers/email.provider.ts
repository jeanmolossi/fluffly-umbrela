import { InternalServerErr } from "@/shared/domain/http-errors";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { readFileSync } from "fs";
import {
	createTestAccount, createTransport,
	getTestMessageUrl,
	SentMessageInfo, Transporter
} from 'nodemailer';
import Mail from "nodemailer/lib/mailer";

type From = { name: string; email: string };

@Injectable()
export class EmailProvider {
	private _transporter: Transporter<SentMessageInfo>;
	private _from: string;
	private _to: string;
	private _subject: string;
	private _text: string;
	private _html: string;
	private _sender: string = undefined;
	private _replyTo: string = undefined;
	private _inReplyTo: string = undefined;

	private _headers: Mail.Headers = undefined;
	private _list: Mail.ListHeaders = undefined;

	private _htmlSet: boolean = false;

	constructor(private readonly config: ConfigService) {}

	public async init(): Promise<EmailProvider> {
		const account = this.config.get("NODE_ENV") == "development"
			? await createTestAccount()
			: {
				user: this.config.get("SMTP_USER"),
				pass: this.config.get("SMTP_PASS"),
				smtp: {
					host: this.config.get("SMTP_HOST"),
					port: +this.config.get("SMTP_PORT"),
					secure: Boolean(this.config.get("SMTP_SECURE")),
				}
			}

		this._transporter = createTransport({
			host: account.smtp.host,
			port: account.smtp.port,
			secure: account.smtp.secure,
			auth: {
				user: account.user,
				pass: account.pass,
			},
		})

		return this
	}

	public setFrom(from: From): EmailProvider {
		this._from = `"${from.name}" <${from.email}>`
		return this
	}

	public setTo(...to: string[]): EmailProvider {
		this._to = to.join(', ')
		return this;
	}

	public setSubject(subject: string): EmailProvider {
		this._subject = subject
		return this;
	}

	public setText(text: string): EmailProvider {
		this._text = text
		return this;
	}

	public setReplyTo(replyTo: string): EmailProvider {
		this._replyTo = replyTo;
		return this;
	}

	public setInReplyTo(inReplyTo: string): EmailProvider {
		this._inReplyTo = inReplyTo;
		return this;
	}

	public setHtml(html: string): EmailProvider {
		this.alreadyDefinedHtml()
		this._html = html
		return this;
	}

	public setHtmlTemplate(path: string): EmailProvider {
		this.alreadyDefinedHtml()

		try { this._html = readFileSync(path).toString() }
		catch (e) {
			throw new InternalServerErr(`fail reading file path ${path}: ${e.message}`)
		}

		return this
	}

	private alreadyDefinedHtml() {
		if (this._htmlSet) {
			throw new Error("already defined html. Please use setHtml or setHtmlTemplate, do not use both!")
		}

		this._htmlSet = true
	}

	public setHeaders(headers: Mail.Headers): EmailProvider {
		this._headers = headers
		return this
	}

	public setList(list: Mail.ListHeaders): EmailProvider {
		this._list = list
		return this
	}

	public async send(): Promise<string> {
		this.validate()

		const result = await this._transporter.sendMail({
			from: this._from,
			to: this._to,
			subject: this._subject,
			text: this._text,
			html: this._html,
			sender: this._sender,
			headers: this._headers,
			list: this._list,
			replyTo: this._replyTo,
			inReplyTo: this._inReplyTo,
		})

		console.log(`Message sent: %s`, result.messageId)
		const previewURL = getTestMessageUrl(result) || "Message not sent"
		console.log(`Preview URL: %s`, previewURL)

		return previewURL
	}

	private validate() {
		if (!this._from)
			throw new Error("You should call setFrom")


		if (!this._to)
			throw new Error("You should call setTo")


		if (!this._subject)
			throw new Error("You should call setSubject")


		if (!this._text)
			throw new Error("You should call setText")


		if (!this._htmlSet)
			throw new Error("You should call setHtml or setHtmlTemplate")
	}
}
