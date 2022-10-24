exports.run = async(sock, msg, args) => {
	await sock.sendMessage(msg.key.remoteJid, { text: 'pong!' })
}

exports.help = {
	name: "Ping",
	aliases: ['pong'],
	description: "Ping Pong!",
	usage: "{prefix}ping"
}