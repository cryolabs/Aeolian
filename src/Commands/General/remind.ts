import { ApplicationCommandOptionType, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { reminded } from '@Helpers/reminderUtils.js';
import { Reminders } from '@Schemas';
import ms from 'ms';

@Discord()
export class Remind {
	@Slash({
		name: 'remind',
		description: 'Sets a reminder for you.',
	})
	remind(
		@SlashOption({
			name: 'task',
			description: 'What should I remind you of?',
			type: ApplicationCommandOptionType.String,
			required: true,
		})
		@SlashOption({
			name: 'time',
			description: 'When should I remind you?',
			type: ApplicationCommandOptionType.String,
			required: true,
		})
			task: string,
			time: string,
			interaction: ChatInputCommandInteraction,
	) {
		const { guild, channel, user } = interaction;
		const convertedTime = ms(time);
		const embed = new EmbedBuilder().setColor('Blurple').setTimestamp();
		const unixTime = Math.floor(Date.now() / 1000) + convertedTime / 1000;

		if (isNaN(convertedTime))
			return interaction.reply({
				embeds: [
					embed.setDescription('🔹 | An invalid time has been provided.'),
				],
				ephemeral: true,
			});

		interaction
			.reply({
				embeds: [
					embed
						.setTitle('Reminder set!')
						.setDescription(
							`Okay, I'll remind you to \`${task}\` <t:${unixTime}:R>.`,
						),
				],
				fetchReply: true,
			})
			.then(async (message) => {
				await Reminders.create({
					guildId: guild.id,
					channelId: channel.id,
					messageId: message.id,
					userId: user.id,
					scheduledTime: parseInt(String(Date.now() + convertedTime / 1000)),
					reminder: task,
					hasBeenReminded: false,
				}).then((data) => {
					setTimeout(async () => {
						if (!data.hasBeenReminded) await reminded(message);
					}, convertedTime);
				});
			});
	}
}
