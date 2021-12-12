const fs = require('fs');
const { joinVoiceChannel,NoSubscriberBehavior , createAudioPlayer, AudioPlayerStatus, VoiceConnectionStatus, entersState, StreamType ,getVoiceConnection, createAudioResource } = require('@discordjs/voice');
const { createReadStream } = require('fs');

module.exports = {
	name: 'join',
	description: 'join voice',
	async execute(interaction){
		await interaction.deferReply();
		
		const channel = interaction.member?.voice.channel;
		if(channel){
			try{
				const connection = await connectToChannel(channel);
				console.log('ok!');
				playAudio(connection);
				interaction.editReply({content:'Hello!',ephemeral:true});
			}
			catch(error){
				interaction.editReply({content:'Something went wrong...',ephemeral:true})
			}
		}
		else{
			interaction.editReply({content:'Join a voice channel first!',ephemeral:true});
		}
	}
}

async function connectToChannel(channel){
	const connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: channel.guild.voiceAdapterCreator,
	});
	try{
		console.log('waiting to enter ready');
		await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
		return connection;
	}
	catch(error){
		console.log(error)
		connection.destroy();
		throw error;
	}
}

async function playAudio(connection){
	const player = createAudioPlayer({
		behaviors: {
			noSubscriber: NoSubscriberBehavior.Pause,
		},
	});
	let resource = createAudioResource(createReadStream(`./sounds/laugh0.webm`, {
		inputType: StreamType.OggOpus,
	}));
	player.play(resource);
	
	try{
		await entersState(player, AudioPlayerStatus.Playing, 5e3);
		connection.subscribe(player);
		
		const filecount = fs.readdirSync('./sounds').length
		console.log(`filecount: ${filecount}`);
		player.on(AudioPlayerStatus.Idle, () => {
			//wait and play next thing
			let randomSample = Math.floor(Math.random() * filecount);
			// 900000 is 15 mins
			// 60000 is 1 min
			let randomTime = Math.floor(Math.random() * 900000) + 900000;
			let currentTime = Date.now();
			currentTime += randomTime;
			console.log(`done playing, sleeping for ${randomTime} then playing laugh${randomSample}.webm`);
			while(currentTime > Date.now()){
				//do nothing
			}
			resource = createAudioResource(createReadStream(`./sounds/laugh${randomSample}.webm`, {
				inputType: StreamType.OggOpus,
			}));
			player.play(resource);
		});
	}
	catch(error){
		console.log(error);
		throw error;
	}	
}