<template>
  <nav>
    <div class="container">
      <div class="taker">
        <router-link to="/">
          <i class="material-icons icon">home</i>
          <span class="taker-home">Home</span>
        </router-link>
        <router-link to="/categories">
          <i class="material-icons icon">view_list</i>
          <span class="taker-categories">Categories</span>
        </router-link>
        <router-link to="#">
          <i class="material-icons icon">favorite</i>
          <span class="taker-following">Following</span>
        </router-link>
        <router-link to="#">
          <i class="material-icons icon">bookmark</i>
          <span class="taker-bookmarks">Bookmarks</span>
        </router-link>
      </div>

      <v-divider></v-divider>

      <div class="giver">
        <router-link to="/upload">
          <i class="material-icons icon">cloud_upload</i>
          <span class="giver-upload">Upload podcast</span>
        </router-link>
        <router-link to="#">
          <i class="material-icons icon">wifi_tethering</i>
          <span class="giver-live">Start live</span>
        </router-link>
        <router-link to="#">
          <i class="material-icons icon">trending_up</i>
          <span class="giver-statistics">Statistics panel</span>
        </router-link>
      </div>

      <v-divider></v-divider>

      <div class="info">
        <router-link to="/about-us">
          <i class="material-icons icon">whatshot</i>
          <span class="info-mission">Our mission</span>
        </router-link>
        <router-link to="/premium">
          <i class="material-icons icon">star</i>
          <span class="info-premium">Premium</span>
        </router-link>
      </div>

      <v-divider></v-divider>

      <div class="essentials">
        <router-link to="/feedback">
          <i class="material-icons icon">feedback</i>
          <span class="essentials-feedback">Feedback</span>
        </router-link>
        <router-link to="/support">
          <i class="material-icons icon">contact_support</i>
          <span class="essentials-support">Support & help</span>
        </router-link>
        <router-link to="/report">
          <i class="material-icons icon">report</i>
          <span class="essentials-report">Report</span>
        </router-link>
      </div>

      <v-divider></v-divider>

      <footer>
        <span>&copy; 2019 TheBitCast</span>
        <router-link to="/about-us">About us</router-link>
        <router-link to="/contact">Contact</router-link>
        <router-link to="/copyright">Copyright</router-link>
        <router-link to="/privacy-policy">Privacy & policy</router-link>
      </footer>
    </div>
  </nav>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "@/stylesheets/master.scss";

.container {
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  width: 300px;
  height: calc(100vh - 80px);
  position: fixed;
  bottom: 0;
  padding: 0;

  div {
    overflow: hidden;
    padding: 15% 0;
  }
}

a {
  width: 100%;
  height: 40px;
  text-decoration: none;
  color: $grey;
  float: left;

  &:hover {
    background-color: $dark-white;
  }
  .icon {
    margin: 0 50px;
    line-height: 40px;
    vertical-align: middle;
  }
  span {
    line-height: 40px;
    font-size: 16px;
    vertical-align: middle;
  }
}

.info {
  .icon,
  span {
    color: $main;
  }
  // v-app setst to blue
  background-color: #fff !important;
}

footer {
  position: absolute;
  bottom: 20px;
  padding: 0 !important;
  border: none !important;

  span {
    font-size: 15px;
    color: $lighter-grey;
    display: block;
    margin-bottom: 10px;
    text-align: center;
  }
  a {
    color: $grey;
    float: none;
    font-size: 11px;
    margin-left: 20px;
    &:hover {
      background-color: inherit;
    }
  }
}

// @media (max-width: 1100px) {
//   .container { display: none; }
// }
</style>
