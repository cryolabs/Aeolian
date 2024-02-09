import { reminderCheck } from '@/Utils/Helpers/reminderUtils.js';
import { check4Lockdowns } from '../../../Utils/Checks/check4Lockdowns.js';
import { Evelyn } from '../../../Evelyn.js';
import { ActivityType } from 'discord.js';
import { Discord, Once } from 'discordx';
import colors from '@colors/colors';
import { set } from 'mongoose';

@Discord()
export class Ready {
	@Once({
		event: 'ready',
	})
	async ready([client]: [Evelyn]) {
		const { magenta, white, green, red } = colors;
		const { user, config, manager } = client;

		console.info(
			`${magenta('Discord API')} ${white('· Logged in as')} ${green(
				`${client.user.tag}`,
			)}`,
		);

		user.setPresence({
			activities: [
				{
					name: 'it\'s morbin time baby :)',
					type: ActivityType.Streaming,
				},
			],
		});

		if (!config.database) {
			return console.error(
				`${magenta('Evelyn Notification')} ${white('·')} ${red(
					'Couldn\'t connect to database, please check your config.ts file.',
				)}`,
			);
		}

		await client.initApplicationCommands();
		manager.init(client);

		await set('strictQuery', false)
			.connect(config.database)
			.then(() => {
				console.info(
					`${magenta('Database')} ${white('·')} ${green(
						`${client.user.username}`,
					)} ${white('has successfully connected to the database.')}`,
				);
			})
			.catch((err) => {
				console.log(err);
			});

		await reminderCheck(client);
		await check4Lockdowns(client);
	}
}
