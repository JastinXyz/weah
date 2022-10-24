let { prefix } = require('../../config.json');

exports.run = async(sock, msg, args, cmd) => {
	let val = Array.from(cmd.values());
	let dummy = {};
	val.forEach((e) => {
		dummy[e.name] = e;
	})

    if(!args[0]) {
    	await sock.sendMessage(msg.key.remoteJid, { text: `All Commands: *${Object.keys(dummy).join(', ')}*\n\n\`\`\`${prefix}help <command name>\`\`\` for details...` })
    } else {
    	let { name, aliases, description, usage } = dummy[args[0]];
    	await sock.sendMessage(msg.key.remoteJid, { text: `*${name}*\n\nAliases: ${aliases.join(", ")}\nDescription: ${description}\nUsage: \`\`\`${usage.replace('{prefix}', prefix)}\`\`\`` })
    }
}

exports.help = {
	name: "Help",
	aliases: ['menu', '?'],
	description: "Help menu.",
	usage: "{prefix}help"
}