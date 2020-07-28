# discord-radio-player
A radio player module for discord which has custom ffmpeg args support.
# Installation
```bash
npm i discord-radio-player
```
# Searching Radio
```js
const radio = require('discord-radio-player')
const search = await radio.Radio.search({serchterm:'kissfm',limit:1})
```
# Playing Radio from search results
```js
const radio = require('discord-radio-player')
const search = await radio.Radio.search({serchterm:'kissfm',limit:1})
let streamUrl = search[0].url_resolved
let stream = radio.Radio.getStream(streamUrl)
message.member.voice.channel.join().then(c=>c.play(stream,{type:'opus'}))
//starts playing radio
```
# Adding Custom FFmpeg filters
This is an example for enabling bassboost filter
```js
const radio = require('discord-radio-player')
const search = await radio.Radio.search({serchterm:'kissfm',limit:1})
let streamUrl = search[0].url_resolved
// loading filters
let FFmpegfilters = [
    "-af","bass=g=20,dynaudnorm" //bassboost filter for example
]
let stream = radio.Radio.getStream(streamUrl,{filters:FFmpegfilters}) //defining filters 
message.member.voice.channel.join().then(c=>c.play(stream,{type:'opus'}))
//starts playing radio
```
# Pre Existing Filters
- Bassboost
```js
const radio = require('discord-radio-player')
const search = await radio.Radio.search({serchterm:'kissfm',limit:1})
let streamUrl = search[0].url_resolved
// Adding bassboost effect
let stream = radio.Radio.getStream(streamUrl,{bassboost:30}) //sets the bassboost to 30DB
// bassboost with normalizer
let stream = radio.Radio.getStream(streamUrl,{bassboost:30,normalizer:true}
message.member.voice.channel.join().then(c=>c.play(stream,{type:'opus'}))
//starts playing radio
```
- 8D
```js
let streamUrl = search[0].url_resolved
// Adding 8D effect
let stream = radio.Radio.getStream(streamUrl,{'8d':true}) //generates 8d effect x)
```
