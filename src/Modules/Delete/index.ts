import { Message, MessageId, QuoteMap } from '@open-wa/wa-automate';
import { Args, Module } from '../ModulesRegister';

class Delete extends Module {
	constructor() {
		super();

		this.makePublic('default', this.default);
		this.makePublic('help', this.help);

		this.messagesPath = './src/Modules/Delete/messages.zap.md';
	}

	default(_: Args, requester: Message) {
		try {
			const myMessage = requester.quotedMsg;
			if (!myMessage || !myMessage.fromMe) {
				return this.sendMessageFromTemplate('OnlyMyMessages', requester);
			}

			if (!this.isResponseForCommand(requester.quoteMap, requester.id)) {
				return this.sendMessageFromTemplate('OnlyCommands', requester);
			}

			this.zaplify.deleteMessage(myMessage);
		} catch (e) {
			return this.sendMessageFromTemplate('Error', requester, {
				error: e,
			});
		}
	}

	async isResponseForCommand(quoteMap: QuoteMap, firstMessageId: MessageId) {
		let currMessage = quoteMap[firstMessageId];
		while (currMessage.quotes) {
			console.log(currMessage);
			currMessage = await this.zaplify.fetchMessageDetails(currMessage.quotes);

			if (currMessage.body.startsWith('!')) {
				return true;
			}
		}
		return false;
	}

	help(_: Args, requester: Message) {
		return this.sendMessageFromTemplate('Help', requester);
	}
}

export default Delete;
