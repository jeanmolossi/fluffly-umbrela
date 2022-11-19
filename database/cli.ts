import { format } from 'util';

// const black = '\u001b[30m';
const red = '\u001b[31m';
const green = '\u001b[32m';
const yellow = '\u001b[33m';
// const blue = '\u001b[34m';
// const magenta = '\u001b[35m';
const cyan = '\u001b[36m';
// const white = '\u001b[37m';
const reset = '\u001b[0m';

export const println = {
	fatal(...args) {
		console.log(`${red}[FATAL]\t%s${reset}`, format(...args));
		process.exit();
	},
	error(...args) {
		console.log(`${red}[ERROR]\t%s${reset}`, format(...args));
	},
	info(...args) {
		console.log(`${cyan}[INFO]\t%s${reset}`, format(...args));
	},
	warn(...args) {
		console.log(`${yellow}[WARN]\t%s${reset}`, format(...args));
	},
	log(...args) {
		console.log(`${green}[_LOG]\t%s${reset}`, format(...args));
	},
	debug(...args) {
		console.log(`${green}[DEBUG]\t%s${reset}`, format(...args));
	}
};

function isValid<T extends object>(params: T, options: CliOptions<T>) {
	return options.required
		.flatMap(flag => {
			const param = params[flag];

			const caster = options.schema[flag];
			const cast_param = caster(param);

			if (!param && typeof cast_param !== 'boolean') {
				println.error(`${String(flag)} é um parâmetro obrigatório`);
				println.warn(`Tente utilizar --${String(flag)}=valor`);
				return [];
			}

			params[flag] = cast_param;
			return true;
		})
		.filter(Boolean)
		.at(0);
}

type CliOptions<T extends object> = {
	schema: { [Key in keyof T]: Function };
	required?: (keyof T)[];
	usage?: string;
};

export function cli<T extends object>(
	obj: CliOptions<T> = {} as CliOptions<T>
): T {
	const flags = process.argv.slice(2, process.argv.length);

	println.info('Cli iniciada');
	println.info(`${flags.length} parametros identificados`);

	if (!flags.length) {
		const message = obj.usage || 'Argumentos incorretos';
		println.fatal(message);
	}

	const params: T = {} as T;

	flags.forEach(param => {
		// match all on the patter:
		// --flag=value
		// --flag
		const { groups } = param.match(
			/^--((?<flag>\w+)([=\s])?((?<value>[\w\d]+))?)$/
		);

		Object.assign(params, {
			[groups.flag]: groups.value || true
		});
	});

	const schema = {} as T;

	Object.keys(obj.schema).forEach(k => {
		Object.assign(schema, { [k]: params[k] });
	});

	if (!isValid(params, obj)) {
		println.fatal('uso da Cli incorreto');
	}

	return schema;
}
