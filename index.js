import { Client, GatewayIntentBits, Events } from "discord.js";
import http from "http";

// =====================
// DISCORD CLIENT
// =====================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // ⚠️ nécessite l’intent activé sur le portal
  ],
});

client.once(Events.ClientReady, () => {
  console.log(`✅ Bot connecté en tant que ${client.user.tag}`);
});

// Exemple simple : répondre à !ping
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  if (message.content === "!ping") {
    await message.reply("🏓 Pong !");
  }
});

// Connexion Discord
if (!process.env.DISCORD_TOKEN) {
  console.error("❌ DISCORD_TOKEN manquant");
  process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);

// =====================
// HTTP SERVER (Railway)
// =====================
const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("OK");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🌍 HTTP server listening on port ${PORT}`);
});

// =====================
// GRACEFUL SHUTDOWN
// =====================
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM reçu, arrêt propre...");
  server.close(() => process.exit(0));
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT reçu, arrêt propre...");
  server.close(() => process.exit(0));
});
