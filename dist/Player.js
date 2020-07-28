"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const prism = require("prism-media");
class Player {
    constructor() {
        this.version = require("../package.json").version;
    }
    async play(member, stream, options) {
        if (!stream)
            throw new Error("(discord-radio-player) No Stream URL was Provided");
        if (member instanceof discord_js_1.GuildMember === false)
            throw new Error("(discord-radio-player) Member is not an instance of GuildMember");
        if (!member.voice.channel)
            throw new Error("(discord-radio-player)Member is not in voice channel");
        let connection = await member.voice.channel.join();
        let FFmpeg = [
            "-i",
            stream,
            "-f",
            "s16le",
            "-ar",
            "48000",
            "-ac",
            "2",
        ];
        if (options && options.filters && Array.isArray(options.filters)) {
            FFmpeg = FFmpeg.concat(options.filters);
        }
        const transcoder = new prism.FFmpeg({
            args: FFmpeg,
        });
        const opus = new prism.opus.Encoder({
            rate: 48000,
            channels: 2,
            frameSize: 960,
        });
        let out = transcoder.pipe(opus);
        out.on("close", () => {
            transcoder.destroy();
            opus.destroy();
        });
        connection.play(out, { type: "opus" });
        return connection;
    }
}
exports.default = Player;
//# sourceMappingURL=Player.js.map