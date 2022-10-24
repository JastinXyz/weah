const {
  default: makeWASocket,
  DisconnectReason,
  useSingleFileAuthState,
  getContentType,
} = require("@adiwajshing/baileys");
const { Boom } = require("@hapi/boom");
const P = require("pino");

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
        console.log(JSON.stringify(m, undefined, 2))
    })
}

connectToWhatsApp()