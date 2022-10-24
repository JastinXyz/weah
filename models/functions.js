exports.reply = async(d, n) => {
	await d.sock.sendMessage(d.msg.key.remoteJid, n, { quoted: d.msg })
}

exports.Quoted = (d) => {
	let i = d.msg.message.extendedTextMessage? d.msg.message.extendedTextMessage.contextInfo.quotedMessage? true : false : false;
	let type = i? require('@adiwajshing/baileys').getContentType(d.msg.message.extendedTextMessage.contextInfo.quotedMessage) : null
	let data = {
		isQuoted: i,
		type,
		data: i? d.msg.message.extendedTextMessage.contextInfo.quotedMessage[type] : null
	}

	return data;
}