const { ChatInputCommandInteraction, Client, EmbedBuilder } = require("discord.js");

module.exports = {
	name: 'unban',
	permissions: 'BAN_MEMBERS',
	description: 'Unban a user from this server.',
	public: true,
	options: [
		{
			name: 'userid',
			description: 'Provide the ID of the person you would like to unban.',
			type: 3,
			required: true,
		},
	],
	/**
	 * @param {ChatInputCommandInteraction} interaction 
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		const targetID = interaction.options.getString('userid');

		const unbanEmbed = new EmbedBuilder()
			.setColor("Grey")
			.setAuthor({ name: `${client.user.username} | Moderation`, iconURL: client.user.avatarURL({ dynamic: true }) })
			.setDescription(`${targetID} has been unbanned.`)
			.setTimestamp()

		const failEmbed = new EmbedBuilder()
			.setColor("Grey")
			.setAuthor({ name: `${client.user.username}`, iconURL: client.user.avatarURL({ dynamic: true }) })
			.setDescription("Please provide a valid ID of a banned member.")
			.setTimestamp()

		interaction.guild.members
			.unban(targetID)
			.then(() => {
				interaction.reply({ embeds: [unbanEmbed], ephemeral: true });
			})
			.catch(() => {
				interaction.reply({ embeds: [failEmbed], ephemeral: true });
			});
	},
}
