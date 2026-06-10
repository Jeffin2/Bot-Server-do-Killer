require("dotenv").config();

const fs = require("fs");
const path = require("path");

const {
    Client,
    Collection,
    GatewayIntentBits
} = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "src", "commands");
const commandFiles = fs.readdirSync(commandsPath);

for (const file of commandFiles) {

    if (!file.endsWith(".js")) continue;

    const command = require(path.join(commandsPath, file));

    client.commands.set(command.data.name, command);

    console.log(`✅ Comando carregado: ${command.data.name}`);
}

client.once("ready", () => {

    console.log(`🤖 ${client.user.tag} online!`);
});

client.on("interactionCreate", async interaction => {

    if (!interaction.isChatInputCommand()) return;

    const command =
        client.commands.get(interaction.commandName);

    if (!command) return;

    try {

        await command.execute(interaction);

    } catch (error) {

        console.error(error);

        if (interaction.replied || interaction.deferred)
            return;

        interaction.reply({
            content: "❌ Ocorreu um erro.",
            ephemeral: true
        });
    }
});

client.login(process.env.TOKEN);