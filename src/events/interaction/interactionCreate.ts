import {
	Client,
	ChatInputCommandInteraction,
	Events,
	EmbedBuilder,
} from 'discord.js';
import { Evelyn } from '../../structures/Evelyn';
import { Event } from '../../interfaces/interfaces';
//import importUtils from '../../modules/Utils/utils.js';
//import { isBlacklisted } from '../../functions/isBlacklisted.js';

export const event: Event = {
	name: "interactionCreate",
	execute(client: Evelyn, interaction: ChatInputCommandInteraction) {
		console.log(interaction.command)
		if(interaction instanceof ChatInputCommandInteraction) console.log("Interaction is an instace of ChatInput!")
		else console.log("It's not an instance of ChatInput!")
		if (!interaction?.isChatInputCommand()) return;
		const { options, commandName } = interaction;

		const embed = new EmbedBuilder().setColor('Blurple');

		// const utils = new importUtils(interaction);
		const command = client.commands.get(commandName);

		// if (await isBlacklisted(interaction)) return;

		if (!command)
			return interaction.reply({
				embeds: [embed.setDescription('This command is outdated.')],
				ephemeral: true,
			});

		//if (command.botPermissions) {
			//if (utils.check4Perms(command)) return;
		//}

		//const subCommand = options.getSubcommand(false);
		//if (subCommand) {
		//	const subCommandFile = client.subCommands.get(
			//	`${interaction.commandName}.${subCommand}`,
		//	);

		//	if (!subCommandFile)
		//		return interaction.reply({
		//			embeds: [embed.setDescription('This subcommand is outdated.')],
		//			ephemeral: true,
		//		});

	//		subCommandFile.execute(interaction, client);
	//	}
	//	else command.execute(interaction, client);
		command.execute(interaction, client);
	},
};