const fs = require('fs');
const { MessageEmbed, MessageActionRow, MessageAttachment } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
	name: 'leave',
	description: 'leave voice',
	async execute(interaction){
		await interaction.deferReply();
		
		const connection = getVoiceConnection(interaction.guild.id);
		if(connection){
			connection.destroy();
			interaction.editReply({content:'Goodbye!',ephemeral:true});
		}
		else{
			interaction.editReply({content:'There is no active connection!',ephemeral:true});
		}
	}
}