const radioOpts = require("radio-browser");
const prism = require("prism-media");
export default class {
  static async search(options: any) {
    if (!options)
      throw new Error("(discord-radio-player) No search options were provided");
    if (typeof options !== "object")
      throw new Error(
        `(discord-radio-player) Expected Search options type object but recieved ${typeof options}`
      );
    if (!options.searchterm)
      throw new Error(`(discord-radio-player) No search term was provided`);
    if (!options.by) options.by = "tag";
    if (!options.limit) options.limit = 5;
    try {
      return await radioOpts.getStations(options);
    } catch (e) {
      throw e;
    }
  }
  static getStream(streamURL: string, options?: any) {
    if (!streamURL)
      throw new Error("(discord-radio-player) No stream link was provided");
    let FFmpeg: string[] = [
      "-i",
      streamURL,
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
    if (options && options.bassboost && !isNaN(options.bassboost)) {
      let bass = options.bassboost;
      let bassSetting = ["-af", `bass=g=${bass}`];
      if (options.normalizer)
        bassSetting = ["-af", `bass=g=${bass},dynaudnorm=f=200`];
      FFmpeg = FFmpeg.concat(bassSetting);
    }
    if (options && options["8d"]) {
      let setting = ["-af", "apulsator=hz=0.08"];
      FFmpeg = FFmpeg.concat(setting);
    }
    if (options && options.pulsator) {
      let setting = ["-af", "apulsator=hz=1"];
      FFmpeg = FFmpeg.concat(setting);
    }
    if (options && options.karaoke) {
      let setting = ["-af", "stereotools=mlev=0.03"];
      FFmpeg = FFmpeg.concat(setting);
    }
    const transcoder = new prism.FFmpeg({
      args: FFmpeg,
    });
    const opus = new prism.opus.Encoder({
      rate: 48000,
      channels: 2,
      frameSize: 960,
    });
    let out = transcoder
      .pipe(
        new prism.VolumeTransformer({
          type: "s16le",
          volume: options.volume ? options.volume : 1,
        })
      )
      .pipe(opus);
    out.on("close", () => {
      transcoder.destroy();
      opus.destroy();
    });
    return out;
  }
}
