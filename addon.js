const { addonBuilder } = require("stremio-addon-sdk");
const magnet = require("magnet-uri");

const manifest = { 
    "id": "org.stremio.latinomovies",
    "version": "2.0.0",

    "name": "Latino Movies",
    "description": "Explora un universo de emocionantes películas en español con nuestro complemento Stremio. Desde éxitos de taquilla hasta joyas cinematográficas ocultas, disfruta de una amplia variedad de géneros. Nuestra colección en constante crecimiento ofrece streaming de alta calidad y opciones para todos los gustos. Descubre el cine en español desde la comodidad de tu pantalla. ¡Instala nuestro addon y sumérgete en un mundo de entretenimiento sin límites! 🎬🍿",

    "resources": [
        "catalog",
        "stream"
    ],

    "types": ["movie", "series"],
    
    "catalogs": [
        {
            type: 'movie',
            id: 'latinomoviesmovies'
        },
        {
            type: 'series',
            id: 'latinomoviesseries'
        }
    ],

    "idPrefixes": [ "tt" ]

};

const dataset = {
    "tt5678901": { name: "A Walk To Remember", type: "movie", externalUrl: "https://truelovequest.live/s?a=6420&sm=38105&mt=7&s1=6437965&s2=771670508667409264" },
    "tt5678901:1:1": { name: "A Walk To Remember", type: "movie", externalUrl: "https://es.stripchat.com/CrazyTori" },
    // Agrega más películas con sus respectivos enlaces externos aquí
};

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
        poster: METAHUB_URL + "/poster/medium/" + imdbId + "/img",
    };
};

builder.defineCatalogHandler(function(args, cb) {
    const metas = Object.entries(dataset)
        .filter(([_, value]) => value.type === args.type)
        .map(([key, value]) => generateMetaPreview(value, key));

    return Promise.resolve({ metas: metas });
});

module.exports = builder.getInterface();

