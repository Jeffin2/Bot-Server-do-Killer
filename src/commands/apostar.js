const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const db = require("../database/database");

const KC = "<:KillerCoin1:1514372933144019154>";

module.exports = {

data: new SlashCommandBuilder()
    .setName("apostar")
    .setDescription("Cara ou coroa")
    .addStringOption(opt =>
        opt
            .setName("escolha")
            .setDescription("cara ou coroa")
            .setRequired(true)
            .addChoices(
                { name: "cara", value: "cara" },
                { name: "coroa", value: "coroa" }
            )
    )
    .addIntegerOption(opt =>
        opt
            .setName("quantia")
            .setDescription("Quantidade apostada")
            .setRequired(true)
    ),

async execute(interaction) {

    const userId = interaction.user.id;

    const escolha = interaction.options.getString("escolha");
    const amount = interaction.options.getInteger("quantia");

    if (amount <= 0)
        return interaction.reply({
            content: "Valor inválido",
            ephemeral: true
        });

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

    if (!user || user.wallet < amount) {
        return interaction.reply({
            content: "Saldo insuficiente",
            ephemeral: true
        });
    }

    const resultado =
        Math.random() < 0.5 ? "cara" : "coroa";

    let win = escolha === resultado;

    if (win) {

        db.prepare(`
            UPDATE users
            SET wallet = wallet + ?
            WHERE user_id = ?
        `).run(amount, userId);

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(
                        `🪙 Deu **${resultado}**!\n` +
                        `🎉 Você ganhou ${amount} ${KC}`
                    )
            ]
        });

    } else {

        db.prepare(`
            UPDATE users
            SET wallet = wallet - ?
            WHERE user_id = ?
        `).run(amount, userId);

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(
                        `🪙 Deu **${resultado}**!\n` +
                        `💀 Você perdeu ${amount} ${KC}`
                    )
            ]
        });
    }
}
};