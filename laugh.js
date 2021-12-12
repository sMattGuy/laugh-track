'use strict';
// Import the discord.js module and others
const { Client, Intents, Collection, Formatters } = require('discord.js');
const fs = require('fs');

// Create an instance of a Discord client
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES,Intents.FLAGS.GUILD_VOICE_STATES] });

// import token and database
const credentials = require('./auth.json');

client.commands = new Collection();
const commandFolders = fs.readdirSync('./js');

for(const folder of commandFolders){
	const commandFiles = fs.readdirSync(`./js/${folder}`).filter(file => file.endsWith(`.js`));
	for(const file of commandFiles){
		const command = require(`./js/${folder}/${file}`);
		client.commands.set(command.name,command);
	}
}

//sets ready presense
client.on('ready', async () => {
	client.user.setPresence({
		status: 'online',
	});
	//list server
	client.guilds.cache.forEach(guild => {
		console.log(`${guild.name} | ${guild.id}`);
	});
	console.log('I am ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	
	const command = client.commands.get(interaction.commandName);
	
	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login(`${credentials.token}`);
