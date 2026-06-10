const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const KC = "<:KillerCoin1:1514372933144019154>";

module.exports = {

data: new SlashCommandBuilder()
    .setName("loja")
    .setDescription("Loja de itens"),

async execute(interaction) {

    return interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setColor("Purple")
                .setTitle("🛒 Loja do Hospício")
                .setDescription(
                    `🎭 VIP - 5000 ${KC}\n` +
                    `🎨 Cor especial - 2000 ${KC}\n` +
                    `📦 Caixa misteriosa - 1000 ${KC}`
                )
        ]
    });
}
};