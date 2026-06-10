const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const db = require("../database/database");

const KC = "<:KillerCoin1:1514372933144019154>";

module.exports = {

data: new SlashCommandBuilder()
    .setName("apostar")
    .setDescription("Cara ou coroa")
    .addIntegerOption(opt =>
        opt.setName("quantia").setRequired(true)
    ),

async execute(interaction) {

    const userId = interaction.user.id;
    const amount = interaction.options.getInteger("quantia");

    const user = db.prepare(`SELECT * FROM users WHERE user_id = ?`).get(userId);

    if (!user || user.wallet < amount)
        return interaction.reply({ content: "Saldo insuficiente", ephemeral: true });

    const win = Math.random() < 0.5;

    if (win) {

        db.prepare(`UPDATE users SET wallet = wallet + ? WHERE user_id = ?`)
            .run(amount, userId);

        return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("Green")
                .setDescription(`🎉 Você ganhou ${amount} ${KC}!`)]
        });

    } else {

        db.prepare(`UPDATE users SET wallet = wallet - ? WHERE user_id = ?`)
            .run(amount, userId);

        return interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("Red")
                .setDescription(`💀 Você perdeu ${amount} ${KC}`)]
        });
    }
}
};
// adicionando comentário desnecessário