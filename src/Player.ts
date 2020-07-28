
import { GuildMember } from "discord.js";
const prism = require("prism-media");
class Player {
  version: string;
  constructor() {
    this.version = require("../package.json").version;
  }
  async play(member: any, stream: string, options?: any) {
    if (!stream)
      throw new Error("(discord-radio-player) No Stream URL was Provided");
    if (member instanceof GuildMember === false)
      throw new Error(
        "(discord-radio-player) Member is not an instance of GuildMember"
      );
    if (!member.voice.channel)
      throw new Error("(discord-radio-player)Member is not in voice channel");
    let connection = await member.voice.channel.join();
    let FFmpeg: string[] = [
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
      FFmpeg = FFmpeg.concat(options.filter);
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
    connection.play(out);
    return connection;
  }
}
export default Player;
