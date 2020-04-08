'use strict';
const Hapi = require('@hapi/hapi');


const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

/**
 * Assignment 1
 * Json Transformation with Recursion
 */
server.route({
    method: 'POST',
    path: '/assignment1',
    handler: (request, reply) => {
        try {
            const payload = request.payload;
            transformJson(payload);
            return transformJson(payload);
        } catch(err) {
            throw new Error(err);
        }
    }
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
    handler: (request, reply) => {
        try {
            const query = request.query;
            let page = 1;
            if (query && query.page > 1) {
                page = query.page;
            } 
            return page;   
        } catch(err) {
            throw new Error(err);
        }
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

async function start () {  
    // start your server
    try {
      await server.start();
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
    console.log('Server running');
}
  
start();