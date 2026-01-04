import { Client, GatewayIntentBits } from "discord.js";
import http from "http";

// ==============================
// Discord client
// ==============================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// ==============================
// Ready
// ==============================
client.once("ready", () => {
  console.log(`✅ Bot connecté en tant que ${client.user.tag}`);
});

// ==============================
// Exemple message handler
// ==============================
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "!ping") {
    await message.reply("🏓 Pong !");
  }
});

// ==============================
// Login Discord
// ==============================
client.login(process.env.DISCORD_TOKEN);

// ==============================
// HTTP server (OBLIGATOIRE pour Railway)
// ==============================
const PORT = process.env.PORT || 3000;

http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("OK");
  })
  .listen(PORT, () => {
    console.log(`🌐 HTTP server listening on port ${PORT}`);
  });

// ==============================
// Graceful shutdown (Railway)
// ==============================
process.on("SIGTERM", async () => {
  console.log("🛑 SIGTERM received, shutting down gracefully");
  try {
    await client.destroy();
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("🛑 SIGINT received, shutting down gracefully");
  try {
    await client.destroy();
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
});

// ==============================
// Keep process alive
// ==============================
setInterval(() => {}, 60 * 60 * 1000);
