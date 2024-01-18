const { addonBuilder } = require("stremio-addon-sdk");
const magnet = require("magnet-uri");

const manifest = { 
    "id": "org.stremio.helloworld",
    "version": "1.0.0",

    "name": "Hello World Addon",
    "description": "Sample addon providing a few public domain movies",

    "resources": [
        "catalog",
        "stream"
    ],

    "types": ["movie", "series"],
    
    "catalogs": [
        {
            type: 'movie',
            id: 'helloworldmovies'
        },
        {
            type: 'series',
            id: 'helloworldseries'
        }
    ],

    "idPrefixes": [ "tt" ]

};

const dataset = {
    "tt0032138": { name: "The Wizard of Oz", type: "movie", infoHash: "24c8802e2624e17d46cd555f364debd949f2c81e", fileIdx: 0 },
    "tt0017136": { name: "Metropolis", type: "movie", infoHash: "dca926c0328bb54d209d82dc8a2f391617b47d7a", fileIdx: 1 },
    "tt0063350": fromMagnet("Night of the Living Dead", "movie", "magnet:?xt=urn:btih:A7CFBB7840A8B67FD735AC73A373302D14A7CDC9&dn=night+of+the+living+dead+1968+remastered+bdrip+1080p+ita+eng+x265+nahom&tr=udp%3A%2F%2Ftracker.publicbt.com%2Fannounce&tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce"),
    "tt0051744": { name: "House on Haunted Hill", type: "movie", infoHash: "9f86563ce2ed86bbfedd5d3e9f4e55aedd660960" },
    "tt1254207": { name: "Big Buck Bunny", type: "movie", url: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" },
    "tt0031051": { name: "The Arizona Kid", type: "movie", ytId: "m3BKVSpP80s" },
    "tt0137523": { name: "Fight Club", type: "movie", externalUrl: "https://www.netflix.com/watch/26004747" },
    "tt1748166:1:1": { name: "Pioneer One", type: "series", infoHash: "07a9de9750158471c3302e4e95edb1107f980fa6" },
    
    // Se añaden seis nuevas opciones con URLs externas
    "tt1234567": { name: "A Walk To Remember", type: "movie", externalUrl: "https://es.stripchat.com/CrazyTori" },
    "tt2345678": { name: "A Walk To Remember", type: "movie", externalUrl: "https://es.stripchat.com/Wet__Bunny" },
    "tt3456789": { name: "A Walk To Remember", type: "movie", externalUrl: "https://es.stripchat.com/KateJonson" },
    "tt4567890": { name: "A Walk To Remember", type: "movie", externalUrl: "https://es.stripchat.com/dreams4u" },
    "tt5678901": { name: "A Walk To Remember", type: "movie", externalUrl: "https://es.stripchat.com/CrazyTori" },
    "tt6789012": { name: "A Walk To Remember", type: "movie", externalUrl: "https://es.stripchat.com" },
};

function fromMagnet(name, type, uri) {
    const parsed = magnet.decode(uri);
    const infoHash = parsed.infoHash.toLowerCase();
    const tags = [];
    if (uri.match(/720p/i)) tags.push("720p");
    if (uri.match(/1080p/i)) tags.push("1080p");
    return {
        name: name,
        type: type,
        infoHash: infoHash,
        sources: (parsed.announce || []).map(function(x) { return "tracker:"+x }).concat(["dht:"+infoHash]),
        tag: tags,
        title: tags[0],
    }
}

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(function(args) {
    if (dataset[args.id]) {
        return Promise.resolve({ streams: [dataset[args.id]] });
    } else {
        return Promise.resolve({ streams: [] });
    }
});

const METAHUB_URL = "https://images.metahub.space";

const generateMetaPreview = function(value, key) {
    const imdbId = key.split(":")[0];
    return {
        id: imdbId,
        type: value.type,
        name: value.name,
        poster: METAHUB_URL+"/poster/medium/"+imdbId+"/img",
    };
};

builder.defineCatalogHandler(function(args, cb) {
    const metas = Object.entries(dataset)
        .filter(([_, value]) => value.type === args.type)
        .map(([key, value]) => generateMetaPreview(value, key));

    return Promise.resolve({ metas: metas });
});

module.exports = builder.getInterface();

