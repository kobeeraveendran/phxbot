const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const bot = new Discord.Client();

bot.on("ready", async () => {
    console.log(`${bot.user.username} is online.`);
    // bot.user.setGame("Being Created");
    bot.user.setActivity("Under Development", {type: "WATCHING"});
})

// commands
bot.on("message", async message => {
    if(message.author.bot) return;

    if(message.channel.type === "dm") return;

    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    // $hello command
    if(command == `${botconfig.prefix}hello`) {
        return message.channel.send("Hello, " + message.author.username + "!");
    }

    // $botinfo command
    if(command === `${botconfig.prefix}botinfo`) {
        let boticon = bot.user.displayAvatarURL;
        let botembed = new Discord.RichEmbed();
        botembed.setDescription("Bot Information");
        botembed.setColor("#00b2ff");
        botembed.setThumbnail(boticon);
        botembed.addField("Bot Name", bot.user.username);
        botembed.addField("Bot ID", bot.user.id);
        botembed.addField("Creation Date", bot.user.createdAt);

        return message.channel.send(botembed);
    }

    // $serverinfo command
    if(command === `${botconfig.prefix}serverinfo`) {
        let servericon = message.guild.iconURL;
        let serverembed = new Discord.RichEmbed();
        serverembed.setDescription("Server Information");
        serverembed.setColor("#00b2ff");
        serverembed.setThumbnail(servericon);
        serverembed.addField("Server Name", message.guild.name);
        serverembed.addField("Created On", message.guild.createdAt);
        serverembed.addField("You Joined On", message.member.joinedAt);
        serverembed.addField("Total Members", message.guild.memberCount);

        return message.channel.send(serverembed);
    }

    // $getinfo <user> command
    if(command === `${botconfig.prefix}getinfo`) {
        let user = message.mentions.users.first();
        let usericon = user.displayAvatarURL;
        let userembed = new Discord.RichEmbed();
        userembed.setDescription("Target User Information");
        userembed.setColor("#00b2ff");
        userembed.setThumbnail(usericon);
        userembed.addField("Full Username", user.username + '#' + user.discriminator);
        userembed.addField("User ID", `${user.id}`);
        userembed.addField("You Joined On", message.member.joinedAt);

        message.channel.send(userembed);
        return;
    }

    // $report <user> <reason> command
    if(command === `${botconfig.prefix}report`) {
        // get user
        let targetuser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);

        if(!targetuser) {
            return message.channel.send("Could not find target user.");
        }

        // reason (each ID is 22 characters long)
        let reason = args.join(" ").slice(22);

        if(!reason) {
            message.channel.send("Please provide a reason for this report.");
            return;
        }

        // embed
        let reportEmbed = new Discord.RichEmbed();
        reportEmbed.setDescription("Reports");
        reportEmbed.setColor("#bb00ff");
        reportEmbed.addField("Reported User", `${targetuser} with ID: ${targetuser.id}`);
        reportEmbed.addField("Reported By", `${message.author} with ID: ${message.author.id}`);
        reportEmbed.addField("Channel", message.channel);
        reportEmbed.addField("Time", message.createdAt);
        reportEmbed.addField("Reason", reason);

        let reportsChannel = message.guild.channels.find(`name`, "reports");
        if(!reportsChannel) {
            return message.channel.send("Couldn't find reports channel");
        }

        message.delete().catch(O_o=>{});
        reportsChannel.send(reportEmbed);
        return;
    }

    // $kick <user> <reason> command
    if(command === `${botconfig.prefix}kick`) {
        // format: $kick <user> <reason>
        let kickuser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

        if(!kickuser) message.channel.send("Can't find user.");

        if(!message.member.hasPermission("MANAGE_MESSAGES")) {
            return message.channel.send("Insufficient power to perform action.");
        }

        if(kickuser.hasPermission("MANAGE_MESSAGES")) {
            message.channel.send("Target user is immune to kick.");
            return;
        }

        let kickreason = args.join(" ").slice(22);

        if(!kickreason) {
            message.channel.send("Please provide a reason for this kick.");
            return;
        }

        let kickEmbed = new Discord.RichEmbed();
        kickEmbed.setDescription("Kick");
        kickEmbed.setColor("#ffe100");
        kickEmbed.addField("User Kicked", `${kickuser} with ID: ` + kickuser.id);
        kickEmbed.addField("Kicked By", `${message.author.username} with ID: ` + message.author.id);
        kickEmbed.addField("Kicked from", message.channel);
        kickEmbed.addField("Time", message.createdAt);
        kickEmbed.addField("Reason for Kick", kickreason);

        let incidentchannel = message.guild.channels.find(`name`, "incidents");
        if(!incidentchannel) return message.channel.send("Coudln't find incidents channel.");

        message.guild.member(kickuser).kick(kickreason);
        incidentchannel.send(kickEmbed);

        return;
    }

    // $ban <user> <reason> command
    if(command === `${botconfig.prefix}ban`) {
        let banuser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

        if(!banuser) return message.channel.send("Couldn't find user.");

        if(!message.member.hasPermission("MANAGE_MESSAGES")) {
            return message.channel.send("Insufficient power to perform action.");
        }

        if(banuser.hasPermission("MANAGE_MESSAGES")) {
            message.channel.send("Target user is immune to kick.");
            return;
        }

        let banreason = args.join(" ").slice(22);

        if(!banreason) {
            message.channel.send("Please provide a reason for this ban.");
            return;
        }

        let banEmbed = new Discord.RichEmbed();
        banEmbed.setDescription("Ban");
        banEmbed.setColor("#ff2100");
        banEmbed.addField("User Banned", `${banuser} with ID: ` + banuser.id);
        banEmbed.addField("Banned By", `${message.author.username} with ID: ` + message.author.id);
        banEmbed.addField("Banned From", message.channel);
        banEmbed.addField("Time", message.createdAt);
        banEmbed.addField("Reason for Ban", banreason);

        let incidentchannel = message.guild.channels.find(`name`, "incidents");
        if(!incidentchannel) return message.channel.send("Coudln't find #incidents channel.");

        message.guild.member(banuser).ban(banreason);
        incidentchannel.send(banEmbed);

        return;
    }

    // $unban <user> <reason> command
    if(command === `${botconfig.prefix}unban`) {
        //let unbanuser = message.guild.member(message.mentions.user.first() || message.guild.members.get(args[0]));
        //let unbanuser = bot.users.get(args[0]);
        //let userID = bot.users.get('name', args[0]).id;
    
        //let unbanuser = bot.users.get(args[0]);

        let unbanuser = args[0];

        let userArray = unbanuser.split("#");
        let unbanusername = userArray[0];
        let unbanusertag = userArray[1];

        if(!unbanuser) return message.channel.send("Couldn't find user.");

        //let server = new Discord.Guild();
        
        let banlist = message.guild.fetchBans().all();

        let i = 0;

        let targetUser = banlist.find(val => {
            val.username === unbanusername;
            val.discriminator === unbanusertag;
        });
        
        // change later
        if(!message.member.hasPermission("VIEW_CHANNEL")) {
            message.channel.send("Insufficient power to perform requested action.");
        }

        let unbanreason = args.join(" ").slice(19);

        if(!unbanreason) {
            message.channel.send("Please provide a reason for this unban.");
            return;
        }

        let incidentchannel = message.guild.channels.find(`name`, "incidents");
        if(!incidentchannel) return message.channel.send("Couldn't find #incidents channel.");

        message.guild.unban(targetUser);
        //message.channel.unbanuser.send("Come back bby " + bot.generateInvite("[VIEW_CHANNEL]"));
        //bot.users.find('id', unbanuser).send("Come back bby: " + bot.generateInvite("[VIEW_CHANNEL]"));

        let unbanEmbed = new Discord.RichEmbed();
        unbanEmbed.setDescription("Welcome Back!");
        unbanEmbed.setColor("#33ff39");
        unbanEmbed.addField("User Unbanned", `${targetUser.username} with ID: ` + targetUser.id);
        unbanEmbed.addField("Unbanned By", `${message.author.username} with ID: ` + message.author.id);
        unbanEmbed.addField("Time", message.createdAt);
        unbanEmbed.addField("Reason for Unban", unbanreason);

        incidentchannel.send(unbanEmbed);

        return;
    }

    if(command === `${botconfig.prefix}pm`) {
        let recipient = message.mentions.users.first();

        recipient.send("Authomated invite PM test: ");
        recipient.send("https://discord.gg/jvd6B7u");
        message.channel()
    }

    if(command === `${botconfig.prefix}spam`) {
        let spamuser = message.mentions.users.first();
        let numTimes = args[0];
        let i = 0;

        if(numTimes > 10 && (message.member.nickname == "frostlich2")) {
            message.channel.send("Alex saw this coming. Pick a number 10 or less... fgt");
            return;
        }

        if(numTimes > 10) {
            message.channel.send("Not THAT much spam. Pick a value of 10 or less.");
            return;
        }

        if(!spamuser) return message.channel.send("Couldn't find user.");
/*
        if(!message.member.hasPermission("MANAGE_MESSAGES")) {
            message.channel.send("Insufficent power to perform requested action.");
            return;
        }
*/
        for(i = 0; i < numTimes; i++) {
            message.channel.send("REEEEEEEEEEEEEEEEEEEE " + `${spamuser}`);
        }

        return;
    }
})

bot.login(botconfig.token);