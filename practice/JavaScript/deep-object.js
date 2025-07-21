const data = {
    user: {
        profile: {
            name: 'joe',
            age: 21,
        }
    }
}

const data2 = {};


function getNestedValue (obj, path) {
    let finalValue = [];
    path.split('.').reduce((current, key) => {
            current && current[key] !== undefined ? current[key] : undefined;
        }, obj)

    return finalValue;
    }

function traverseObject (obj) {
    if (typeof obj !== 'object') return;

    let keys = Object.keys(obj);
    let entries = Object.entries(obj);
    let ownPropertyNames = Object.getOwnPropertyNames(obj);

    return `
    Object keys: ${keys},
    Object entries: ${entries},
    Object ownPropertyNames: ${ownPropertyNames}
    `
}

let testing = Object.keys(data2);
console.log(traverseObject(data));

/* let results = traverseObject(data, 'user.profile.name');
console.log(results); */