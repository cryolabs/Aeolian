import {
	ChatInputCommandInteraction,
	ModalSubmitInteraction,
	EmbedBuilder,
	ButtonInteraction,
	UserContextMenuCommandInteraction,
	MessageContextMenuCommandInteraction,
} from 'discord.js';
import { GuildDB as DB } from '../structures/schemas/guild.js';
import { UserBlacklist as UB } from '../structures/schemas/userBlacklist.js';

/** Checks to see if the user or guild who / where this command was executed is blacklisted. */
export async function isBlacklisted(
	interaction:
		| ChatInputCommandInteraction
		| ModalSubmitInteraction
		| ButtonInteraction
		| UserContextMenuCommandInteraction
		| MessageContextMenuCommandInteraction,
) {
	const { user, guildId } = interaction;
	const embed = new EmbedBuilder().setColor('Blurple');

	const userBlacklist = await UB.findOne({
		userId: user.id,
	});

	const guildData = await DB.findOne({
		id: guildId,
	});

	if (userBlacklist)
		return interaction.reply({
			embeds: [
				embed
					.setTitle('Blacklisted')
					.setDescription(
						'You have been blacklisted from using Evelyn, the reason behind this decision and the time this has occured is attached below. ',
					)
					.addFields(
						{
							name: 'Reason',
							value: `> ${userBlacklist.reason}`,
							inline: true,
						},
						{
							name: 'Time',
							value: `> <t:${userBlacklist.time / 1000}:R>`,
							inline: true,
						},
					),
			],
		});

	if (guildData.blacklist?.isBlacklisted === true)
		return interaction.reply({
			embeds: [
				embed
					.setTitle('Server Blacklisted')
					.setDescription(
						'This server has been blacklisted from using Evelyn, the reason behind this decision and the time this has occured is attached below. ',
					)
					.addFields(
						{
							name: 'Reason',
							value: `> ${guildData.blacklist.reason}`,
							inline: true,
						},
						{
							name: 'Time',
							value: `<t:${guildData.blacklist.time / 1000}:R>`,
							inline: true,
						},
					),
			],
		});
}