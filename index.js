const {
  default: makeWASocket,
  DisconnectReason,
  useSingleFileAuthState,
  getContentType,
} = require("@adiwajshing/baileys");
const { Boom } = require("@hapi/boom");
const P = require("pino");
let { prefix, autoRead } = require('./config.json');

async function connectToWhatsApp() {
    const { state, loadState, saveState } = useSingleFileAuthState('./session.json');
  
    const sock = makeWASocket({
        logger: P({ level: "fatal" }),
        printQRInTerminal: true,
        auth: state,
        browser: ["WeAh", "Safari", "1.0.0"],
    })

    sock.ev.on("creds.update", saveState);
  
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if(shouldReconnect) {
                connectToWhatsApp()
            }
        } else if(connection === 'open') {
            console.log('opened connection')
        }
    })

    sock.ev.on('messages.upsert', async m => {
        var msg = m.messages[0];
        if (!m || !msg.message) return;
        if (msg.key && msg.key.remoteJid === "status@broadcast") return;
        const type = getContentType(msg.message);
        var text =
            type === "conversation" && msg.message.conversation
              ? msg.message.conversation
              : type == "imageMessage" && msg.message.imageMessage.caption
              ? msg.message.imageMessage.caption
              : type == "documentMessage" && msg.message.documentMessage.caption
              ? msg.message.documentMessage.caption
              : type == "videoMessage" && msg.message.videoMessage.caption
              ? msg.message.videoMessage.caption
              : type == "extendedTextMessage" && msg.message.extendedTextMessage.text
              ? msg.message.extendedTextMessage.text
              : type == "listResponseMessage"
              ? msg.message.listResponseMessage.singleSelectReply.selectedRowId
              : type == "buttonsResponseMessage" &&
                msg.message.buttonsResponseMessage.selectedButtonId
              ? msg.message.buttonsResponseMessage.selectedButtonId
              : type == "templateButtonReplyMessage" &&
                msg.message.templateButtonReplyMessage.selectedId
              ? msg.message.templateButtonReplyMessage.selectedId
              : "";

        if(autoRead) {
            await sock.readMessages([{
                remoteJid: msg.key.remoteJid,
                id: msg.key.id,
                participant: msg.key.participant
            }])
        }

        if(text === `${prefix}ping`) {
            await sock.sendMessage(msg.key.remoteJid, { text: 'pong!' })
        }
    })
}

connectToWhatsApp()