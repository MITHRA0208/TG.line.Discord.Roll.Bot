"use strict";
if (!process.env.DISCORD_CHANNEL_SECRET) {
	return;
}
const togGGToken = process.env.TOPGG;

const channelSecret = process.env.DISCORD_CHANNEL_SECRET;
const {
	ShardingManager
} = require('discord.js');

const manager = new ShardingManager('./modules/discord_bot.js', {
	token: channelSecret,
	totalShards: "auto",
	spawnTimeout: -1,
	respawn: true
});

//TOP.GG 
if (togGGToken) {
	const { AutoPoster } = require('topgg-autoposter');
	const poster = AutoPoster(togGGToken, manager);
	try {
		poster.on('posted', (stats) => { // ran when succesfully posted
			console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`)
		})
	} catch (error) {
		console.error('DBL TOP.GG error')
	}
}

manager.on('shardCreate', shard => {
	console.log(`Launched shard #${shard.id}`);
	shard.on('ready', () => {
		console.log(`Shard ready. Shard Count: #${shard.manager.totalShards}`)
	});
	shard.on('disconnect', (a, b) => {
		console.log('Shard disconnected');
		console.log(a);
		console.log(b);
	});
	shard.on('reconnecting', (a, b) => {
		console.log('Shard reconnecting');
		console.log(a);
		console.log(b);
	});
	shard.on('death', (a, b) => {
		console.log('Shard died');
		console.log(a);
		console.log(b);
	});
	shard.on('error', (error) => {
		console.error('core-discord error #53', error)
	})
});
manager.spawn();