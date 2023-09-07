const Discord = require('discord.js');
const {GatewayIntentBits, MessageEmbed,EmbedBuilder } = Discord ;
const dotenv = require("dotenv");
const checkAvailability = require('./stockChecker');
dotenv.config();
const client = new Discord.Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ]
  });

client.once('ready', () => {
    console.log('Logged in as ' + client.user.tag);
});

client.on('messageCreate', async message => {
    // Assuming the bot should not reply to itself
    if (message.author.bot) return;
    const userId = message.author.id;
  
    if (message.content.startsWith('!walmart')) {
        console.log(`<@${userId}> command received!`)
      let [command, UPC, ZIP] = message.content.split(' ');

      // Check for valid inputs
      if (!UPC || isNaN(UPC) || !ZIP || isNaN(ZIP)) {
        return message.channel.send(`<@${userId}> Please provide a valid numeric UPC and ZIP code. ex: !walmart 071641102231 10001`);
    }

    console.log(UPC, ZIP);
    message.channel.send(`<@${userId}> Request received! Please wait while I'm processing...`);


      try {
        const result = await checkAvailability(UPC, ZIP);

        console.log(result)

        const productEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle("Product Information:")
                .setURL(result.link)
                .setDescription(result.description)
                .addFields(
                    { name: 'Item', value: result.name },
                    { name: 'Price', value: `$${result.price}` },
                    { name: 'Availability', value: result.availability },
                    { name: 'Item ID', value: result.item_id },
                    { name: 'Product ID', value: result.product_id },
                    { name: 'UPC', value: result.upc },
                    { name: 'Store ID', value: result.store_id },
                    { name: 'Store Address', value: `${result.city}, ${result.state} ${result.zipcode}` }
                )
                .setTimestamp();
                
            
            message.channel.send(`<@${userId}> Product Data Received!, Check your DMs`)
            message.author.send({ embeds: [productEmbed] }).catch(error => {
                console.error(`Could not send DM to <@${userId}>.\n`, error);
                message.channel.send("I couldn't DM you! Please make sure your DMs are open.");
            });
    } catch (error) {
        message.channel.send(`<@${userId}> Sorry, I couldn't fetch the stock information right now. Check Your UPC and ZIP codes are Correct!`);
    }

    }
  
  });




client.login(process.env.TOKEN);
