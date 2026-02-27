const express = require("express");
const app = express();

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
});

app.get("/", (req, res) => {
  res.send("Bot está online");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor web ativo");
});

client.login(process.env.TOKEN);

// ================= CONFIG =================

const TOKEN = process.env.TOKEN;
const PIX = "COLOQUE_SUA_CHAVE_PIX";
const MEDIADOR = "1476397553363849277";
const CATEGORIA = "1476425541174427720";

// ==========================================

const filas = {

 "1v1": { mediador:null, jogadores:[], max:2, preco:2 },

 "2v2": { mediador:null, jogadores:[], max:4, preco:4 },

 "3v3": { mediador:null, jogadores:[], max:6, preco:6 },

 "4v4": { mediador:null, jogadores:[], max:8, preco:8 }

};

// BOT ONLINE

client.on('ready', ()=>{

});

// CRIAR PAINEL

client.on("messageCreate", async msg=>{

 if(msg.content === "!painel"){

 if(!msg.member.permissions.has(PermissionsBitField.Flags.Administrator))
 return;

 const embed = new EmbedBuilder()

 .setTitle("🎮 FILAS DISPONÍVEIS")

 .setDescription("Clique para entrar")

 .setColor("Green");

 const row = new ActionRowBuilder()

 .addComponents(

 new ButtonBuilder()

 .setCustomId("1v1")

 .setLabel("1v1")

 .setStyle(ButtonStyle.Primary),

 new ButtonBuilder()

 .setCustomId("2v2")

 .setLabel("2v2")

 .setStyle(ButtonStyle.Primary),

 new ButtonBuilder()

 .setCustomId("3v3")

 .setLabel("3v3")

 .setStyle(ButtonStyle.Primary),

 new ButtonBuilder()

 .setCustomId("4v4")

 .setLabel("4v4")

 .setStyle(ButtonStyle.Primary)

 );

 msg.channel.send({

 embeds:[embed],
 components:[row]

 });

 }

});

// INTERAÇÃO

client.on("interactionCreate", async i=>{

 if(!i.isButton()) return;

 const tipo = i.customId;

 const fila = filas[tipo];

 const membro = i.member;

// MEDIADOR

 if(membro.roles.cache.has(MEDIADOR)){

 fila.mediador = i.user.id;

 i.reply({

 content:"✅ Mediador entrou",

 ephemeral:true

 });

 return;

 }

// SEM MEDIADOR

 if(!fila.mediador){

 i.reply({

 content:"❌ Sem mediador",

 ephemeral:true

 });

 return;

 }

// ADD

 if(fila.jogadores.includes(i.user.id)){

 i.reply({

 content:"❌ Já entrou",

 ephemeral:true

 });

 return;

 }

 fila.jogadores.push(i.user.id);

 i.reply({

 content:"✅ Entrou",

 ephemeral:true

 });

// COMPLETAR

 if(fila.jogadores.length >= fila.max){

 criarPagamento(i.guild, tipo);

 }

});

// CANAL PAGAMENTO

async function criarPagamento(guild,tipo){

 const fila = filas[tipo];

 const canal = await guild.channels.create(

 name = pagamento-$,{tipo},

 parent=CATEGORIA,

 permissionOverwrites,[
    
 {

 id:guild.id,

 deny:["ViewChannel"]

 },

 {

 id:fila.mediador,

 allow:["ViewChannel"]

 },

 ...fila.jogadores.map(id=>({

 id,

 allow:["ViewChannel"]

 }))

 ]

 );

// MSG

 canal.send({

 embeds:[

 new EmbedBuilder()

 .setTitle("💰 PAGAMENTO")

 .setDescription(

`Modo: ${tipo}

Valor: R$${fila.preco}

PIX:

${PIX}

Envie comprovante`

 )

 .setColor("Green")

 ]

 });

// RESET

 fila.mediador=null;

 fila.jogadores=[];

}

client.login(TOKEN);



