'use strict';
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Joi = require('@hapi/joi');
const Wreck = require('@hapi/wreck');

const wreck = Wreck.defaults({
    headers: { 'User-Agent': 'node.js' }
});

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

const swaggerOptions = {
    info: {
        title: 'Pomelo Assignment Documentation',
        version: '0.0.1',
    },
};

/**
 * Assignment 1
 * Json Transformation with Recursion
 */
server.route({
    method: 'POST',
    path: '/assignment1',
    options: {
        handler: (req, reply) => {
            try {
                const payload = req.payload;
                transformJson(payload);
                return transformJson(payload);
            } catch(err) {
                throw new Error(err);
            }
        },
        description: 'Assignment 1',
        notes: 'Transform json',
        tags: ['api'],
    },
});

/**
 * Assignment 2
 * I am not very clear about this assignment. 
 * From my opinion, it means we call the github api and apply the pagination on our backend.
 * Please correct me if I am wrong.
 */
server.route({
    method: 'GET',
    path: '/assignment2',
    options: {
        handler: async (req, reply) => {
            try {
                const query = req.query;
                let page = 1;
                if (query && query.page > 1) {
                    page = query.page;
                } 
                try {
                    const results = await getGitSearchResults(page);
                    
                    if (!results) {
                        console.log('results');
                    } else {
                        let items = results.items;
                        let totalPage = parseInt(results.total_count / 10);

                        return reply.view('index.html', {
                            totalPage: totalPage,
                            items: items,
                            currentPage: page
                        });
                    }
                } catch (err) {
                    return err;
                } 
            } catch(err) {
                throw new Error(err);
            };
        },
        description: 'Assignment 2',
        notes: 'Pagination for Github Search API',
        tags: ['api'],
        validate: {
            query: Joi.object({page: Joi.number()})
        }
    }
});

server.route({
    method:'GET',
    path:'/',
    handler: function (req, reply) {
        return "Testing hapi with mocha and chai";
      }
})

const transformJson = (inputJson) => {
    try {
        let onelayer = [];
        let result = [];
        // divide the items into two level 1 arrays with parent_id and non-parent_id
        for (var i in inputJson) {
            let arrayItems = inputJson[i];
            for (var j in arrayItems) {
                let currentItem = arrayItems[j];
                if (!currentItem.parent_id) {
                    result.push(currentItem);
                } else {
                    onelayer.push(currentItem);
                }
            }
        }
        result = recursiveAdd(result, onelayer);
        return result;
    } catch (err) {
        throw(err);
    }
}

// use recursion to add to the result
const recursiveAdd = (result, onelayer) => {
    for(var i in result) {
        let items = onelayer.filter(e => e.parent_id == result[i].id);
        if (items.length > 0) {
            result[i].children = items;
            recursiveAdd(items, onelayer);
        }
    }
    return result;
}

// call gitsearch api
const getGitSearchResults = async (page) => {
    let url = `https://api.github.com/search/repositories?q=nodejs&page=${page}&per_page=10`
    const { res, payload } = await wreck.get(url);
    return JSON.parse(payload);
}

async function start () {  
    // start your server
    try {
        await server.register([
            Inert,
            Vision,
            {
                plugin: HapiSwagger,
                options: swaggerOptions
            }
        ]);
      
        server.views({
            engines: {
                html: {
                    module: require('handlebars'),
                    compileMode: 'sync' // engine specific
                }
            },
            compileMode: 'async' // global setting
        });
        await server.start();
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
    console.log('Server running');
}
start();

module.exports = server;