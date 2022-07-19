const { Client } = require("discord.js");
const mongoose = require("mongoose");
const { DB } = require("../../structures/config.json");
const { magenta, white, green, red } = require("chalk");
const { dash } = require("../../dashboard/dash.js");

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client 
     */
    execute(client) {
        console.log(magenta("[Discord API] ") + white("Logged in as ") +  green(`${client.user.tag}`));
        client.user.setStatus("online")
        client.user.setActivity({ name: "Game Over", type: 2 })

        require("../../systems/lockdownSystem.js")(client);
        
        dash(client);
        client.manager.init(client.user.id);
        client.lavasfy.requestToken();
        
        if (!DB) return console.log(magenta("[Aeolian Notification] ") + red("Couldn't connect to database, please check your config.json file."));

        mongoose.connect(DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log(magenta("[DB] ") + green(`${client.user.username} `) + white("has successfully connected to the database."))
        }).catch((err) => {
            console.log(err)
        });
    }
}