import { Controller, Get } from "@nestjs/common";
import {
	ApiOkResponse, ApiOperation, ApiProperty, ApiTags
} from "@nestjs/swagger";

class Pong {
	@ApiProperty({ example: "pong", description: "message when is up" })
	message: string;
}

@Controller()
@ApiTags("root")
export class AppController {
	@Get("/ping")
	@ApiOperation({ summary: "Check if application is up" })
	@ApiOkResponse({ status: 200, description: "API is up!", type: Pong })
	ping() {
		return { message: "pong" };
	}
}
