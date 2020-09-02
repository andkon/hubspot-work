var request = require("request");

var fishNames = ["Nemo",  "Bubbles",  "Jack",  "Captain",  "Finley",  "Blue",  "Moby",  "Bubba",  "Squirt",  "Shadow",  "Goldie",  "Dory",  "Ariel",  "Angel",  "Minnie",  "Jewel",  "Nessie",  "Penny",  "Crystal",  "Coral"]
var colors = ["White", "Yellow", "Blue", "Red", "Green", "Black", "Brown", "Azure", "Ivory", "Teal", "Silver", "Purple", "Navy", "PeaGreen", "Gray", "Orange", "Maroon", "Charcoal", "Aquamarine", "Coral", "Fuchsia", "Wheat", "Lime", "Crimson", "Khaki", "HotPink", "Magenta", "Olden", "Plum", "Olive", "Cyan"]

exports.main = ({ accountId, body, params }, sendResponse) => {
  console.log('Your HubSpot account ID: %i', accountId);
  console.log('Your fish size: ' + body.fish_size);

  var firstName = fishNames[Math.floor(Math.random() * fishNames.length)];
  var lastName = ("Mc" + colors[Math.floor(Math.random() * colors.length)]);

  console.log("The API key: " + process.env.hubapikey);

  var options = {
    method: 'POST',
    url: 'https://api.hubapi.com/crm/v3/objects/contacts',
    qs: {hapikey: process.env.hubapikey},
    headers: {accept: 'application/json', 'content-type': 'application/json'},
    body: {
      properties: {
        firstname: firstName,
        lastname: lastName,
        annualrevenue: body.fish_size
      }
    },
    json: true
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log("The " + firstName + " " + lastName + " contact was successfully created");

    sendResponse({
      statusCode: 201,
      body: {
        fish_name: (firstName + ' ' + lastName),
        score: body.properties.annualrevenue,
        message: ('Your fish is named ' + firstName + ' ' + lastName)
      },
    });
  });
};
