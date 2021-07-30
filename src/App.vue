<template>
  <div>
    <div data-netlify-identity-menu></div>

    <div>
      <div style="margin-bottom: 25px">
        Log in / sign up then use the following buttons to change the role of
        testinguser@mailinator.com
      </div>
      <button v-on:click="setUserRole('free')">Set user to Free</button>
      <button v-on:click="setUserRole('Premium')">Set user to Premium</button>
    </div>
  </div>
</template>

<script>
import netlifyIdentity from "netlify-identity-widget";

export default {
  name: "App",
  data: () => ({
    loggedIn: false,
  }),
  mounted() {
    netlifyIdentity.init();
  },
  methods: {
    setUserRole(role) {
      // // call this when you're already logged in as yourself
      const admin = netlifyIdentity.currentUser();
      console.log("inside setUserRole");
      console.log("current user", admin);

      fetch("/.netlify/functions/updateRole/", {
        method: "post",
        body: JSON.stringify({
          email: "testinguser@mailinator.com", // dynamically fill these values as needed
          role: role,
        }),
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${admin.token.access_token}`,
        },
      })
        .then((response) => {
          console.log("fetcheddd");
          console.log(response);
          return response.json();
        })
        .then((updatedUser) => {
          // updatedUser is the user with new role(s)
          console.log(updatedUser);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
