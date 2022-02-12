import fetch from 'node-fetch'
import fs from 'fs'

const config = {
  url: process.env.GQL_URL,
  'x-api-key': process.env.GQL_KEY,
}

const getSchema = async ()=> {
  fetch(config.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config['x-api-key'],
      // add more auth headers here
    },
    body: JSON.stringify({
      variables: {},
      query: `
        {
          __schema {
            types {
              kind
              name
              possibleTypes {
                name
              }
            }
          }
        }
      `,
    }),
  })
    .then(result => result.json())
    .then(result => {
      const filteredData = result.data.__schema.types.filter(
        type => type.possibleTypes !== null,
      );
      result.data.__schema.types = filteredData;
      console.log(filteredData)
      fs.writeFileSync('fragmentTypes.json', JSON.stringify(result.data), err => {
        if (err) {
          console.error('Error writing fragmentTypes file', err);
        } else {
          console.log('Fragment types successfully extracted!');
        }
      });
    });
}