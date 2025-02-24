import "dotenv/config"
import { Client, GatewayIntentBits } from "discord.js"
import fetch from "node-fetch"
import logger from "./logger1.js"


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages, //permission for sending messages
        GatewayIntentBits.MessageContent //permission for accessing message content 
    ]
}) //discord expects you to give permissions to the client bot. 

//below is an event listener, the client listens for the ready event 
//node.js uses an event driven architecture, making it possible for code to be executed when a specific even occurs
// the client class for discord already has a bunch of events associated with it so all you have to do is type in a string instead of having a
// individual event file and dynamically retrieving that even file and its functionality in your index file. 
client.on("ready", () => {
    logger.info(`Logged in as ${client.user.tag}!`)
})

client.on("messageCreate", async (message) => {
    try {
        logger.info(`Message received: ${message.content}`, { user: message.author.tag })
        if (message.content === "!error") {
            throw new Error('This is a test error!')
        }

        if (message.content === "ping") {
            const messageReply = "Pong!"
            message.reply(`${messageReply}`)
            logger.info(`replying with ${messageReply}`)
        }

        let splitMessage = message.content.split(" ")

        if(splitMessage[0] === "!gif") {
            const gifSearchText = splitMessage.slice(0, splitMessage.length).join(" ")

            const url = `http://api.giphy.com/v1/gifs/search?q=${gifSearchText}&api_key=${process.env.GIPHY_API_KEY}&limit=100`

            try{
                const res = await fetch(url)
                if (!res.ok) {
                    throw new Error('Failed to fetch from Giphy API')
                }

                const json = await res.json()

                const randomIndex = Math.floor(Math.random() * json.data.length)

                message.channel.send(json.data[randomIndex].url)
            } catch (error) {
                logger.error('Test error making api call to giphy', { error: error.message })
            }
        }
    } catch (error) {
        logger.error('Error processing message', { error: error.message })
    }
})

client.on('error', (error) => {
    logger.error('Discord client error', { error: error.message });
});

client.login(process.env.DISCORD_TOKEN).catch((error) => {
    logger.error('Failed to login to discord', { error: error.message })
});
