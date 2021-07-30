const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  const payload = JSON.parse(event.body);
  const identity = context.clientContext.identity;
  console.log("step 1 done");
  return fetch(`${identity.url}/admin/users`, {
    headers: {
      Authorization: `Bearer ${identity.token}`
    }
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("step 2 done");
      console.log(data);
      const requiredUser = data.users.filter((user) => {
        return user.email === payload.email;
      });
      console.log("required user", requiredUser);
      return fetch(`${identity.url}/admin/users/${requiredUser[0].id}`, {
        method: "put",
        body: JSON.stringify({
          app_metadata: {
            roles: [payload.role]
          }
        }),
        headers: {
          Authorization: `Bearer ${identity.token}`
        }
      })
        .then((response) => {
          console.log(response.json());
          return response.json();
        })
        .then((updatedUser) => {
          console.log("step 3 done");
          return {
            statusCode: 200,
            body: JSON.stringify(updatedUser)
          };
        });
    });
};
