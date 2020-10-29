const hubspot = require('@hubspot/api-client');

var fishNames = ["Nemo",  "Bubbles",  "Jack",  "Captain",  "Finley",  "Blue",  "Moby",  "Bubba",  "Squirt",  "Shadow",  "Goldie",  "Dory",  "Ariel",  "Angel",  "Minnie",  "Jewel",  "Nessie",  "Penny",  "Crystal",  "Coral"]
var colors = ["White", "Yellow", "Blue", "Red", "Green", "Black", "Brown", "Azure", "Ivory", "Teal", "Silver", "Purple", "Navy", "PeaGreen", "Gray", "Orange", "Maroon", "Charcoal", "Aquamarine", "Coral", "Fuchsia", "Wheat", "Lime", "Crimson", "Khaki", "HotPink", "Magenta", "Olden", "Plum", "Olive", "Cyan"]

exports.main = ({ accountId, body, params }, sendResponse) => {
  console.log('Your HubSpot account ID: %i', accountId);
  console.log('Your fish size: ' + body.fish_size);

  const firstName = fishNames[Math.floor(Math.random() * fishNames.length)];
  const lastName = ("Mc" + colors[Math.floor(Math.random() * colors.length)]);


  const contactObj = {
    properties: {
      firstname: firstName,
      lastname: lastName,
      annualrevenue: body.fish_size
    }
  }

  const hubspotClient = new hubspot.Client({ apiKey: process.env.hubapikey});
  hubspotClient.crm.contacts.basicApi.create(contactObj)
    .then(result => {
      console.log(result);
      
      sendResponse({
        statusCode: 201,
        body: {
          fish_name: (firstName + ' ' + lastName),
          score: parseInt(result.body.properties.annualrevenue),
          message: ('Your fish is named ' + firstName + ' ' + lastName)
        },
      });

    })
    .catch(err => {
      throw new Error(err);
    })
};
