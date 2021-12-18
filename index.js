const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] }); //<-- RICORDARSI QUESTO

client.login(process.env.token);

client.on("ready", () => {
    console.log("Il bot è ONLINE")
    client.user.setPresence({activity: { name: 'with discord.js' }, status: 'dnd'})
    .then(console.log)
    .catch(console.error)
})

//Prima di tutto mandare il messaggio del ticket
client.on("message", message => {
    if (message.content == "!new-ticket") {
        message.channel.send("Clicca sulla reazione per aprire un ticket")
            .then(msg => msg.react("📩")) //Personalizzare l'emoji della reaction
    }
})


client.on("messageReactionAdd", async function (messageReaction, user) {
    if (user.bot) return

    if (messageReaction.message.partial) await messageReaction.message.fetch();

    if (messageReaction._emoji.name == "📩") { //Personalizzare l'emoji della reaction
        if (messageReaction.message.channel.id == "921819187897331712") { //Settare canale
            messageReaction.users.remove(user);
            var server = messageReaction.message.channel.guild;
            if (server.channels.cache.find(canale => canale.topic == `User ID: ${user.id}`)) {
                user.send("Hai gia un ticket aperto").catch(() => { })
                return
            }

            server.channels.create(user.username, {
                type: "text"
            }).then(canale => {
                canale.setTopic(`User ID: ${user.id}`);
                canale.setParent("921819177998757918") //Settare la categoria
                canale.overwritePermissions([
                    {
                        id: server.id,
                        deny: ["VIEW_CHANNEL"]
                    },
                    {
                        id: user.id,
                        allow: ["VIEW_CHANNEL"]
                    }
                ])
                canale.send("Grazie per aver aperto un ticket")
            })
        }
    }
})

client.on("message", message => {
    if (message.content == "!close") {
        var topic = message.channel.topic;
        if (!topic) {
            message.channel.send("Non puoi utilizzare questo comando qui");
            return
        }

        if (topic.startsWith("User ID:")) {
            var idUtente = topic.slice(9);
            if (message.author.id == idUtente || message.member.hasPermission("MANAGE_CHANNELS")) {
                message.channel.delete();
            }
        }
        else {
            message.channel.send("Non puoi utilizzare questo comando qui")
        }
    }

    if (message.content.startsWith("!add")) {
        var topic = message.channel.topic;
        if (!topic) {
            message.channel.send("Non puoi utilizzare questo comando qui");
            return
        }

        if (topic.startsWith("User ID:")) {
            var idUtente = topic.slice(9);
            if (message.author.id == idUtente || message.member.hasPermission("MANAGE_CHANNELS")) {
                var utente = message.mentions.members.first();
                if (!utente) {
                    message.channel.send("Inserire un utente valido");
                    return
                }

                var haIlPermesso = message.channel.permissionsFor(utente).has("VIEW_CHANNEL", true)

                if (haIlPermesso) {
                    message.channel.send("Questo utente ha gia accesso al ticket")
                    return
                }

                message.channel.updateOverwrite(utente, {
                    VIEW_CHANNEL: true
                })

                message.channel.send(`${utente.toString()} è stato aggiunto al ticket`)
            }
        }
        else {
            message.channel.send("Non puoi utilizzare questo comando qui")
        }
    }
    if (message.content.startsWith("!remove")) {
        var topic = message.channel.topic;
        if (!topic) {
            message.channel.send("Non puoi utilizzare questo comando qui");
            return
        }

        if (topic.startsWith("User ID:")) {
            var idUtente = topic.slice(9);
            if (message.author.id == idUtente || message.member.hasPermission("MANAGE_CHANNELS")) {
                var utente = message.mentions.members.first();
                if (!utente) {
                    message.channel.send("Inserire un utente valido");
                    return
                }

                var haIlPermesso = message.channel.permissionsFor(utente).has("VIEW_CHANNEL", true)

                if (!haIlPermesso) {
                    message.channel.send("Questo utente non ha gia accesso al ticket")
                    return
                }

                if (utente.hasPermission("MANAGE_CHANNELS")) {
                    message.channel.send("Non puoi rimuovere questo utente")
                    return
                }

                message.channel.updateOverwrite(utente, {
                    VIEW_CHANNEL: false
                })

                message.channel.send(`${utente.toString()} è stato rimosso al ticket`)
            }
        }
        else {
            message.channel.send("Non puoi utilizzare questo comando qui")
        }
    }
})

var embed1 = new Discord.MessageEmbed()
    .setColor("BLUE")
    .setTitle("Regole")
    .setDescription(`✘ Nessun contenuto illegale.
    ✘ Nessun razzismo.
    ✘ Nessun tipo di spam.
    ✘ Nessuna pubblicità/link senza permesso.`)
    .setFooter("𝗔𝗧𝗧𝗘𝗡𝗭𝗜𝗢𝗡𝗘! Non rispettare le regole comporterà ad un ban immediato.")
var embed2 = new Discord.MessageEmbed()
    .setColor("GREEN")
    .setTitle("Help:")
    .setDescription(`✘ !assistenza
    ✘ Comando 2
    ✘ Comando 3
    ✘ Comando 4`)
var embed3 = new Discord.MessageEmbed()
    .setColor("RED")
    .setTitle("Email Assistenza:")
    .setDescription(`assistenza.yhiffiz@gmail.com`)
    .setFooter("Contattare 𝗦𝗢𝗟𝗢 𝗘𝗗 𝗘𝗦𝗖𝗟𝗨𝗦𝗜𝗩𝗔𝗠𝗘𝗡𝗧𝗘 per bug/consigli del server.")

client.on("message", message => {
    if (message.content == "!regole") {
        message.channel.send(embed1)
    }
})

client.on("message", message => {
    if (message.content == "!help") {
        message.channel.send(embed2)
    }
})

client.on("message", message => {
    if (message.content == "!assistenza") {
        message.channel.send(embed3)
    }
})