import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailProvider } from './infra/providers/email.provider';

@Module({
	imports: [ConfigModule],
	providers: [ConfigService, EmailProvider],
	exports: [EmailProvider]
})
export class SharedModule {}
