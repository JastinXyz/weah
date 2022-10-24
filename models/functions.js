exports.reply = async(d, n) => {
	await d.sock.sendMessage(d.msg.key.remoteJid, n, { quoted: d.msg })
}