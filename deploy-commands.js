const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildIds, token } = require('./auth.json');

const commands = [
	new SlashCommandBuilder()
		.setName('join')
		.setDescription('Lets the bot in.'),
	new SlashCommandBuilder()
		.setName('leave')
		.setDescription('Kicks the bot out.'),
]
.map(command => command.toJSON());

const rest = new REST({version:'9'}).setToken(token);

for(let i=0;i<guildIds.length;i++){
	rest.put(Routes.applicationGuildCommands(clientId,guildIds[i]),{body:commands})
		.then(() => console.log('Registered application commands!'))
		.catch(console.error);
}

const { generateDependencyReport } = require('@discordjs/voice');

console.log(generateDependencyReport());