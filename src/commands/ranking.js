const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const KC = "<:KillerCoin1:1514372933144019154>";
const db = require("../database/database");

module.exports = {

data: new SlashCommandBuilder()
    .setName("ranking")
    .setDescription("Top ricos do servidor"),

async execute(interaction) {

    const top = db.prepare(`
        SELECT * FROM users
        ORDER BY (wallet + bank) DESC
        LIMIT 10
    `).all();

    const desc = top.map((u, i) =>
        `**${i + 1}.** <@${u.user_id}> - ${u.wallet + u.bank} ${KC}`
    ).join("\n");

    return interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setColor("Gold")
                .setTitle("🏆 Ranking de Killer Coins")
                .setDescription(desc)
        ]
    });
}
};