import { Args, Module } from 'src/Modules/ModulesRegister';

export function publicMethod(name: string) {
	return function <T extends Module>(
		target: any,
		key: string,
		descriptor: PropertyDescriptor
	) {
		console.log({ target });
		target.registerPublicMethod({
			name,
			method: (args: Args) => descriptor.value(args),
		});
	};
}
