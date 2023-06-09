import {CommandLike} from "../commandLoader";
import {SlashCommandBuilder} from "discord.js";
import {summarize} from "../lib/queryAI";
import {createErrorEmbed, createInfoEmbed} from "../lib/embedGenerator";
import {fetchHumanMessages, getName} from "../lib/messageHelper";

let now = 0;

export default {
    data: new SlashCommandBuilder()
        .setName("summarize")
        .setDescription("Summarize a Discord conversation"),
    handle: async (interaction) => {
        if (!interaction.channel) {
            await interaction.reply({
                embeds: [createErrorEmbed("This command must be run in a server.")]
            });
            return;
        } else if (!interaction.guild) {
            await interaction.reply({
                embeds: [createErrorEmbed("This command must be run in a server, or this bot has no permission to view members.")]
            });
            return;
        }

        if (now + 30000 > Date.now()) {
            await interaction.reply({
                embeds: [createErrorEmbed(
                    "Due to API rate limitations, this command can only be run once every 30 seconds. Please try again in a little bit!"
                )]
            });
            return;
        }

        await interaction.reply({
            embeds: [createInfoEmbed("Collecting messages...")]
        });

        // fetch and map messages to string format
        const messages = (await fetchHumanMessages(interaction.channel.messages, 25))
            .map<Promise<ReducedMessage>>(async msg => {
                if (!msg.guild) {
                    throw new Error("Operation not completed in a server");
                }
                return {
                    authorName: await getName(msg.author, msg.guild),
                    messageContent: msg.content,
                    timestamp: msg.createdTimestamp
                }
            });
        const stringMessages = (await Promise.all(messages))
            .map<string>(msg => {
                return `${msg.authorName}: ${msg.messageContent}`;
            });
        console.debug(stringMessages);
        
        // reduce to one string
        let context = "";
        stringMessages.forEach(message => context += message + "\n");
        
        await interaction.editReply({
            embeds: [createInfoEmbed("Summarizing (please wait up to 3 minutes)")]
        });
        const {summary_text, success} = await summarize(context, interaction);
        if (!interaction.channel) {
            await interaction.editReply("Unable to respond, as this is not a valid text channel");
            return;
        }
        if (!success) {
            return;
        }
        await interaction.editReply({
            embeds: [createInfoEmbed(`
                # Summary of ${interaction.channel.toString()}
                ${summary_text}
            `)]
        });
        now = Date.now();
    }
} as CommandLike;

interface ReducedMessage {
    authorName: string;
    messageContent: string;
    timestamp: number
}