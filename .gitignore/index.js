const Discord = require('discord.js');
const bot = new Discord.Client();
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const client = new Discord.Client();

const adapter = new FileSync('database.json');
const db = low(adapter);

db.defaults({ histoires: [], xp: []}).write()

var prefix = ("$")

bot.on('ready', function() {
    bot.user.setGame("Command: $help");
    console.log("Connected");
});

bot.login(process.env.TOKEN);

bot.on('message', message => {

    if (message.content === prefix + "help"){
        var help = new Discord.RichEmbed()
            .setTitle(`Voici les commandes que tu as demandé ${message.author.username}`)
            .setDescription("-$help | Affiche les commandes -$xp | Affiche votre nombre d'xp ")
            .setColor('#F3DB00')
            .addField("Bot created by Sasaki Haise")
            .setFooter("Enjoy :p")
        message.channel.send({embed: help});
        
    }

    var msgauthor =  message.author.id;

    if(message.author.bot)return;

    if(!db.get("xp").find({user: msgauthor}).value()){
        db.get("xp").push({user: msgauthor, xp: 1}).write();
    }else{
        var userxpdb = db.get("xp").filter({user: msgauthor}).find('xp').value();
        console.log(userxpdb);
        var userxp = Object.values(userxpdb)
        console.log(userxp)
        console.log(`Nombre d'xp: ${userxp[1]}`)

        db.get("xp").find({user: msgauthor}).assign({user: msgauthor, xp: userxp[1] += 1}).write();

    if (message.content === prefix + "xp"){
        var xp = db.get("xp").filter({user: msgauthor}).find('xp').value()
        var xpfinal = Object.values(xp);
        var xp_embed = new Discord.RichEmbed()
            .setTitle(`Stat des Xp de ${message.author.username}`)
            .setColor('F4D03F')
            .setDescription("Affichage des Xp")
            .addField("XP:", `${xpfinal[1]} xp`)
            .setFooter("Enjoy :p")
        message.channel.send({embed: xp_embed});

    if (message.content === "Salut"){
         message.reply("Bien le bonjour. :)");
         console.log("Commande Salut effectuer");

    }

}}})

bot.on("guildMemberAdd", member => {
    member.guild.channels.find("name", "acceuil").send(`Un grand Bienvenue à ${member} ;) !`)
})
        
bot.on("guildMemberRemove", member => {
    member.guild.channels.find("name", "acceuil").send(`${member} vien de quitter le serveur dommage ;(`)
})
        
bot.on('guildMemberAdd', member => {
    var role = member.guild.roles.find('name', 'Membre :)');
    member.addRole(role)
})
