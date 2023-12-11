import { EmbedBuilder, ApplicationCommandOptionType, ChatInputCommandInteraction } from 'discord.js';
import { Discord, Guard, Slash, SlashOption } from 'discordx';
import { RateLimit, TIME_UNIT } from '@discordx/utilities';
import { injectable, inject } from 'tsyringe';
import { Kitsu } from '@Services';

@Discord()
@injectable()
export class Manga {
	private embed: EmbedBuilder;

	// eslint-disable-next-line no-empty-function
	constructor(@inject(Kitsu) private readonly kitsu: Kitsu) {}

	@Slash({
		description: 'Get info about a manga using Kitsu.io.',
		name: 'manga',
	})
	@Guard(
		RateLimit(TIME_UNIT.seconds, 30, {
			message: '🔹 | Please wait 30 seconds before re-running this command.',
			ephemeral: true,
		}),
	)
	async manga(
		@SlashOption({
			name: 'title',
			description: 'Provide the name of the manga.',
			type: ApplicationCommandOptionType.String,
			required: true,
		})
			title: string,
			interaction: ChatInputCommandInteraction,
	) {
		this.embed = new EmbedBuilder().setColor('Blurple').setTimestamp();

		await this.kitsu.fetchManga(title).then((manga) => {
			return interaction.reply({
				embeds: [
					this.embed
						.setTitle(manga.titles.en_us)
						.setThumbnail(manga.posterImage.original)
						.setDescription(manga.synopsis)
						.addFields(
							{
								name: 'Premiered on',
								value: `<t:${manga.startDateUnix}>`,
								inline: true,
							},
							{
								name: 'Ended on',
								value: `<t:${manga.endDateUnix}>`,
								inline: true,
							},
							{
								name: 'Japanese Title',
								value: `${manga.titles.ja_JP}`,
								inline: true,
							},
							{
								name: 'Status',
								value: manga.status,
								inline: true,
							},
						),
				],
			});
		}).catch(() => {
			return interaction.reply({
				embeds: [
					this.embed.setDescription(
						'🔹 | There was an error while fetching the information from the API.',
					),
				],
			});
		});
	}
}
