import {
  Client,
  GatewayIntentBits,
  Partials,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  Events,
  SlashCommandBuilder
} from "discord.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel]
});

const ACTIVITES = [
  "Randonnée",
  "Balade",
  "Trail",
  "Sortie nature",
  "Sortie famille"
];

client.once(Events.ClientReady, async () => {
  console.log(`✅ Bot connecté en tant que ${client.user.tag}`);

  const command = new SlashCommandBuilder()
    .setName("panel")
    .setDescription("Afficher le panneau pour créer une sortie");

  await client.application.commands.create(command);
});

client.on(Events.InteractionCreate, async interaction => {
  // Commande /panel
  if (interaction.isChatInputCommand() && interaction.commandName === "panel") {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("create_event")
        .setLabel("🥾 Créer une sortie")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({
      content: "🥾 **Proposer une randonnée**\nClique sur le bouton ci-dessous.",
      components: [row]
    });
  }

  // Bouton → formulaire
  if (interaction.isButton() && interaction.customId === "create_event") {
    const modal = new ModalBuilder()
      .setCustomId("event_modal")
      .setTitle("Créer une sortie");

    const date = new TextInputBuilder()
      .setCustomId("date")
      .setLabel("Date (ex: 12/04/2026)")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const lieu = new TextInputBuilder()
      .setCustomId("lieu")
      .setLabel("Lieu / Point de RDV")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const activite = new TextInputBuilder()
      .setCustomId("activite")
      .setLabel(`Activité (${ACTIVITES.join(" / ")})`)
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(date),
      new ActionRowBuilder().addComponents(lieu),
      new ActionRowBuilder().addComponents(activite)
    );

    await interaction.showModal(modal);
  }

  // Validation du formulaire
  if (interaction.isModalSubmit() && interaction.customId === "event_modal") {
    const date = interaction.fields.getTextInputValue("date");
    const lieu = interaction.fields.getTextInputValue("lieu");
    const activite = interaction.fields.getTextInputValue("activite");

    const message = await interaction.reply({
      content:
        `🥾 **${activite}**\n` +
        `📅 Date : ${date}\n` +
        `📍 Lieu : ${lieu}\n\n` +
        `Clique sur le thread ci-dessous pour discuter.`,
      fetchReply: true
    });

    await message.startThread({
      name: `Discussion – ${activite}`,
      autoArchiveDuration: 1440
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
// --- Railway keep-alive & restart workaround ---
process.on("SIGTERM", () => {
  console.log("SIGTERM received, forcing restart");
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, forcing restart");
  process.exit(1);
});

// Keep the process alive
setInterval(() => {}, 60 * 60 * 1000);

