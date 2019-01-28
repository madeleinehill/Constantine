



const Datastore = require('@google-cloud/datastore');
const config = require('../../config');

// [START config]
const ds = Datastore({
    projectId: config.get('GCLOUD_PROJECT'),
});

const kind = 'Agent';
// [END config]


// Translates from Datastore's entity format to 
// the format expected by the application

// Datastore format:
//   {
//     key: [kind, id],
//     data: {
//       property: value
//     }
//   }
//
// Application format:
//   {
//     id: id,
//     property: value
//   }
function fromDatastore(obj) {

    obj.id = obj[Datastore.KEY].id;

    return obj;
}


// Translates from the application's fromat to the datastore's
// extended entity property format.
//
// Application format:
//   {
//     id: id,
//     property: value,
//     unindexedProperty: value
//   }
//
// Datastore extended format:
//   [
//     {
//       name: property,
//       value: value
//     },
//     {
//       name: unindexedProperty,
//       value: value,
//       excludeFromIndexes: true
//     }
//   ]
// (queries that order or filter on a property p will ignore entities where p is unindexed)
function toDatastore(obj, nonIndexed) {
    nonIndexed = nonIndexed || [];
    const results = [];
    Object.keys(obj).forEach(k => {
      if (obj[k] === undefined) {
        return;
      }
      results.push({
        name: k,
        value: obj[k],
        excludeFromIndexes: nonIndexed.indexOf(k) !== -1,
      });
    });
    return results;  
}


// Lists all agents in the Datastore sorted alphabetically by Name.
// The ``limit`` argument determines the maximum amount of results to
// return per page. The ``token`` argument allows requesting additional
// pages. The callback is invoked with ``(err, books, nextPageToken)``.
function list(limit, token, cb) {
    // Prepare the query variable
    const q = ds
        .createQuery([kind])
        .limit(limit)
        .order('name')
        .start(token);

    // Run the query
    ds.runQuery(q, (err, entities, nextQuery) => {
        if (err) {
            cb(err);
            return;
        }

        const hasMore = 
            nextQuery.moreResults !== Datastore.NO_MORE_RESULTS
                ? nextQuery.endCursor
                : false;

        cb(null, entities.map(fromDatastore), hasMore);
    })

}




// Creates a new agent or updates an existing agent with new data.
// The provided data is automatically translated into Datastore format.
function update(id, data, cb) {

    // Work out the key
    let key;

    // If we are actually updating
    if (id) {
        key = ds.key([kind, parseInt(id, 10)]); //10 is just the base of the number.

    // If we are about to create a new agent
    } else {
        key = ds.key(kind);
    }


    // Work out an entity object
    const entity = {
        key: key,
        // remember that we don't need to index the agent's description
        // [data can be any JSON object, in fact...]
        // toDatastore will prepare as extended Datastore format.
        data: toDatastore(data, ['description']),
    };


    // Save the entity in datastore
    ds.save(entity, err => {
        data.id = entity.key.id;
        cb(err, err ? null : data);
    });


}

function create(data, cb) {
    update(null, data, cb);
}

function read(id, cb) {

    // prepare the key in the right format
    const key = ds.key([kind, parseInt(id,10)]);
    // get the object from datastore
    ds.get(key, (err, entity) => {
        if (!err && !entity) {
            err = {
                code: 404,
                message: 'Not found',
            };
        }

        if (err) {
            cb(err);
            return;
        }

        // transform to application format
        cb(null, fromDatastore(entity));
    });
    


}

function _delete(id, cb) {
    // work out the key in datastore format
    const key = ds.key([kind, parseInt(id, 10)]);
    ds.delete(key, cb);

}



// [START exports]
module.exports = {
    create,
    read,
    update,
    delete: _delete,
    list,
};


