import { CommandLike } from "../commandLoader";
import { SlashCommandBuilder } from "discord.js";
import { createInfoEmbed } from "../lib/embedGenerator";
import { version } from "../../package.json";

export default {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows information about this bot"),
  handle: async (interaction) => {
    await interaction.reply({
      embeds: [
        createInfoEmbed(`
                    ## Conversation Summarizer powered by AI
                    Version \`${version}\`
                    Built by [Randy Halim](https://fcrh.me)
                    Project Repository: [github.com](https://github.com/randy-halim/discord-ai-conversation-summary)

                    ## Commands
                    \`/summarize\` - Summarize recent messages
                    \`/ping\` - Test bot response
                    \`/help\` - Show this screen

                    ## Project motivation
                    See [this project's overview](https://github.com/randy-halim/discord-ai-conversation-summary#why).
                `),
      ],
    });
  },
  enabled: true,
} as CommandLike;
