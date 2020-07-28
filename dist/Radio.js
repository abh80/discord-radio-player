"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const radioOpts = require("radio-browser");
const prism = require("prism-media");
class default_1 {
    static async search(options) {
        if (!options)
            throw new Error("(discord-radio-player) No search options were provided");
        if (typeof options !== "object")
            throw new Error(`(discord-radio-player) Expected Search options type object but recieved ${typeof options}`);
        if (!options.searchterm)
            throw new Error(`(discord-radio-player) No search term was provided`);
        if (!options.by)
            options.by = "tag";
        if (!options.limit)
            options.limit = 5;
        try {
            return await radioOpts.getStations(options);
        }
        catch (e) {
            throw e;
        }
    }
    static async getStream(streamURL, options) {
        if (!streamURL)
            throw new Error("(discord-radio-player) No stream link was provided");
        let FFmpeg = [
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
        return out;
    }
}
exports.default = default_1;
//# sourceMappingURL=Radio.js.map