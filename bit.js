const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { token, clientSecret, botIDs } = require('./config.json');

if(!token) {
	console.log("Bit Core failed to start: Token is not defined.")
	process.exit(1)
}

if(!botIDs.client) {
	console.log("Bit Core failed to start: Client ID is not defined.")
	process.exit(1)
}

if(!botIDs.owner) {
	console.log("Owner ID is not defined, some bot functions will never work.")
}

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildEmojisAndStickers,
    ]
})
var thisSentence = false;

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
})

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	if('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
console.log("Loading "+commandFiles.length+" commands")

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for(const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if(event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
console.log("Loading "+eventFiles.length+" events")

const pluginPath = path.join(__dirname, 'plugins');
const pluginFiles = fs.readdirSync(pluginPath).filter(file => file.endsWith('.js'));

for(const file of pluginFiles) {
	const filePath = path.join(pluginPath, file);
	const plugin = require(filePath);
	if(plugin.once) {
		client.once(plugin.name, (...args) => plugin.execute(...args));
	} else {
		client.on(plugin.name, (...args) => plugin.execute(...args));
	}
}
console.log("Loading "+pluginFiles.length+" plugins")

const loggingPath = path.join(__dirname, 'logging');
const loggingFiles = fs.readdirSync(loggingPath).filter(file => file.endsWith('.js'));

for(const file of loggingFiles) {
	const filePath = path.join(loggingPath, file);
	const logs = require(filePath);
	if(logs.once) {
		client.once(logs.name, (...args) => logs.execute(...args));
	} else {
		client.on(logs.name, (...args) => logs.execute(...args));
	}
}

console.log("Loading "+loggingFiles.length+" logging functions")

client.login(token);