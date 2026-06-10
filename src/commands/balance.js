const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const db = require("../database/database");

// Troque pelo ID real do seu emoji
const KC = "<:KillerCoin1:1514372933144019154>";

module.exports = {

    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Ver saldo de Killer Coins"),

    async execute(interaction) {

        const userId = interaction.user.id;

        let user = db.prepare(`
            SELECT *
            FROM users
            WHERE user_id = ?
        `).get(userId);

        if (!user) {

            db.prepare(`
                INSERT INTO users
                (user_id, wallet, bank, xp, level)
                VALUES (?, 0, 0, 0, 1)
            `).run(userId);

            user = db.prepare(`
                SELECT *
                FROM users
                WHERE user_id = ?
            `).get(userId);
        }

        const embed = new EmbedBuilder()
            .setColor("Gold")
            .setTitle("💰 Banco do Hospício")
            .setThumbnail(interaction.user.displayAvatarURL())
            .addFields(
                {
                    name: "👛 Carteira",
                    value: `${user.wallet} ${KC}`,
                    inline: true
                },
                {
                    name: "🏦 Banco",
                    value: `${user.bank} ${KC}`,
                    inline: true
                },
                {
                    name: "⭐ Nível",
                    value: `${user.level}`,
                    inline: true
                }
            )
            .setFooter({
                text: "Hospício do Killer"
            })
            .setTimestamp();

        return interaction.reply({
            embeds: [embed]
        });
    }
};