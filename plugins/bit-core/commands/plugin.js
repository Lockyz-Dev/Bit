const { EmbedBuilder, version: discordVersion, SlashCommandBuilder } = require('discord.js')
const wait = require('node:timers/promises').setTimeout;
const fs = require('node:fs');
const path = require('node:path');
const moment = require('moment');
require('moment-duration-format');

module.exports = {
    // Sets if the command can be used with the bot as a user-installed app or a guild-installed app.
    integration_types: {
        user: false,
        guild: true,
    },

	data: new SlashCommandBuilder()
		.setName('plugin')
		.setDescription('Get information on a specific plugin')
        .setDMPermission(true),
	async execute(interaction) {
        
        var pluginNum = 0;
        var pluginCount;
        function countPlugins() {
            const pluginPath = "./plugins/";
            const plugins = fs.readdirSync(pluginPath)
            //var pluginCount = plugins.length;
    
            return plugins.length;
        }

        function listAllPlugins() {
            var pluginList = []
    
            const pluginPath = "./plugins/";
            const plugins = fs.readdirSync(pluginPath)
            pluginCount = plugins.length
    
            if(pluginPath && plugins) {
                for(const folder of plugins) {
                    const pluginInfo = require("./../../"+folder+"/plugin.json")
                    pluginList.push({
                        'name': pluginInfo.name,
                        'developer': pluginInfo.developer,
                        'version': pluginInfo.version,
                        'support': pluginInfo.support,
                        'hasEvents': pluginInfo.events,
                        'hasCommands': pluginInfo.commands
                    })
                    pluginNum += 1;
                }
    
                if(pluginNum === pluginCount) {
                    return pluginList;
                }
            } else {
                console.log("Error")
            }
        }

        const client = interaction.client
        interaction.deferReply()
        await wait(4000);
        var pluginCount2 = 0;
        var embedDescription = '';

        const embed = new EmbedBuilder()
            .setTitle('Plugin List')
        
        listAllPlugins().forEach(({ name, developer }) => {
            embedDescription += name+" by "+developer+"\n"
            pluginCount2+=1;
        })

        var pluginCount3 = countPlugins()

        if(pluginCount2 === pluginCount3) {
            embed.setDescription(embedDescription)
            interaction.editReply({ embeds: [embed] })
        }
	}
};