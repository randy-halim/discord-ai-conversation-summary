import {Colors, EmbedBuilder} from "discord.js";
import {version} from "../../package.json";

const createBaseEmbed = () => new EmbedBuilder()
    .setAuthor({
        name: "AI Conversation Summarizer (github.com)",
        url: "https://github.com/randy-halim/discord-ai-conversation-summary"
    })
    .setFooter({
        text: `Built by randy <3 - version ${version}`,
    })

export const createErrorEmbed = (msg = "An unknown error occured.") => {
    return createBaseEmbed()
        .setColor(Colors.Red)
        .setDescription(msg)
        .toJSON();
}

export const createWarnEmbed = (msg: string) => {
    return createBaseEmbed()
        .setColor(Colors.Yellow)
        .setDescription(msg)
        .toJSON()
}

export const createInfoEmbed = (msg: string) => {
    return createBaseEmbed()
        .setColor(Colors.Aqua)
        .setDescription(msg)
        .toJSON()
}