const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const db = require("../database/database");

const KC = "<:KillerCoin1:1514372933144019154>";

module.exports = {

    data: new SlashCommandBuilder()
        .setName("trabalhar")
        .setDescription("Trabalhe e ganhe Killer Coins"),

    async execute(interaction) {

        const userId = interaction.user.id;

        let user = db.prepare(`
            SELECT * FROM users WHERE user_id = ?
        `).get(userId);

        // ✅ CORREÇÃO IMPORTANTE AQUI
        if (!user) {

            db.prepare(`
                INSERT INTO users (user_id, wallet, bank, xp, level)
                VALUES (?, 0, 0, 0, 1)
            `).run(userId);

            user = db.prepare(`
                SELECT * FROM users WHERE user_id = ?
            `).get(userId);
        }

        const reward = Math.floor(Math.random() * 150) + 50;

        db.prepare(`
            UPDATE users
            SET wallet = wallet + ?
            WHERE user_id = ?
        `).run(reward, userId);

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("👷 Trabalho concluído!")
            .setDescription(`Você ganhou **${reward} ${KC}**`)
            .setTimestamp();

        return interaction.reply({
            embeds: [embed]
        });
    }
};