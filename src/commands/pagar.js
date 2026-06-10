const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const db = require("../database/database");

const KC = "<:KillerCoin1:1514372933144019154>";

module.exports = {

data: new SlashCommandBuilder()
    .setName("pagar")
    .setDescription("Pagar outro usuário")
    .addUserOption(opt =>
        opt.setName("usuario").setRequired(true)
    )
    .addIntegerOption(opt =>
        opt.setName("quantia").setRequired(true)
    ),

async execute(interaction) {

    const userId = interaction.user.id;
    const target = interaction.options.getUser("usuario");
    const amount = interaction.options.getInteger("quantia");

    if (amount <= 0)
        return interaction.reply({ content: "Valor inválido", ephemeral: true });

    const user = db.prepare(`SELECT * FROM users WHERE user_id = ?`).get(userId);

    if (!user || user.wallet < amount)
        return interaction.reply({ content: "Saldo insuficiente", ephemeral: true });

    db.prepare(`UPDATE users SET wallet = wallet - ? WHERE user_id = ?`).run(amount, userId);
    db.prepare(`UPDATE users SET wallet = wallet + ? WHERE user_id = ?`).run(amount, target.id);

    return interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`💸 Você pagou **${amount} ${KC}** para ${target}`)
        ]
    });
}
};