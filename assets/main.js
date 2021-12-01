let userId = 0;
let user = {};
let client;
let allUserIds = [];
let allUsers = [];

$(function () {
  client = ZAFClient.init();

  client.invoke("resize", { width: "100%", height: "200px" });

  // get the user id
  client.get("ticket.requester.id").then(function (data) {
    userId = data["ticket.requester.id"];

    console.log("about to get user data")
    getUserData(client, userId);
    getAllUserIds(client);
  });

  // get the user's data
  function getUserData(client, userId) {
    let settings = {
      url: "/api/v2/users/" + userId + ".json",
      type: "GET",
      dataType: "json",
    };

    client.request(settings).then(
      function (data) {
        // assign data to global user variable
        user = data;
        console.log(data);
      },
      function (response) {
        console.error(response);
      }
    );
  }


  // get all users data then extract and store only the user ids
  function getAllUserIds(client) {
    let settings = {
      url: "/api/v2/users.json",
      type: "GET",
      dataType: "json",
    };

    client.request(settings).then(function (data) {
      allUsers = data
      console.log(allUsers)
      allUsers.users.map(function(user) {     
        return allUserIds.push(user.id)
    })
    });
  }
});


function deleteTags() {
  let body = {
    user: {
      tags: [],
    },
  };
  let userTags = user.user.tags;
  console.log("HELLO: ", userTags);
  if (userTags.length > 0) {
    let settings = {
      url: "/api/v2/users/" + user.user.id + ".json",
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(body),
    };

    client.request(settings).then(function (data) {
      console.log("IS THIS WORKING??");
      console.log(data);
      checkYourWork()
    }),
      function (response) {
        console.error(response);
      };
  }
}

function deleteAllUserTags() {
  let body = {
    user: {
      tags: [],
    },
  };
  let settings = {
    url: "/api/v2/users/update_many?ids=" + allUserIds.toString() + ".json",
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify(body),
  };

  client.request(settings).then(function (data) {
    console.log("IS THIS WORKING??");
    console.log(data);
  }),
    function (response) {
      console.error(response);
    };
}
