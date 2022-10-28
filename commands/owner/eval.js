let { ownerNumbers } = require('../../config.json');
exports.run = async(d) => {
	if(ownerNumbers.includes(d.f.decodeJid(d.f.sender(d)).replace("@s.whatsapp.net", ""))) {
		try {
	      var evaled = await eval(d.args.join(" "));
	      return d.f.reply(d, {text:require("util").inspect(evaled, { depth: 0 })})
	    } catch (err) {
	      return d.f.reply(d, {text: `${err}!`});
	    }
	} else {
		d.f.react(d, "👀")
	}
}

exports.help = {
	name: "Eval",
	aliases: ['e'],
	description: "evaling code",
	usage: "{prefix}eval <code>"
}