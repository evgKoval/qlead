<template>
  <div id="app">
    <b-navbar toggleable="md">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand to="/quizzes">
        <div class="logo">
          <img src="../../static/img/logo.png" alt="logo" height="52" />
        </div>
      </b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav class="main_links">
          <b-nav-item to="/quizzes">
            <span class="link_icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="36"
                height="36"
                viewBox="0 0 224 224"
                style=" fill:#000000;"
              >
                <g transform>
                  <g
                    fill="none"
                    fill-rule="nonzero"
                    stroke="none"
                    stroke-width="1"
                    stroke-linecap="butt"
                    stroke-linejoin="miter"
                    stroke-miterlimit="10"
                    stroke-dasharray
                    stroke-dashoffset="0"
                    font-family="none"
                    font-weight="none"
                    font-size="none"
                    text-anchor="none"
                    style="mix-blend-mode: normal"
                  >
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <g fill="#02182b">
                      <path
                        d="M24.5,28c-5.7995,0 -10.5,4.7005 -10.5,10.5v147c0,5.7995 4.7005,10.5 10.5,10.5h175c5.7995,0 10.5,-4.7005 10.5,-10.5v-147c0,-5.7995 -4.7005,-10.5 -10.5,-10.5zM24.5,35h175c1.932,0 3.5,1.568 3.5,3.5v147c0,1.932 -1.568,3.5 -3.5,3.5h-175c-1.932,0 -3.5,-1.568 -3.5,-3.5v-115.5h143.5c1.932,0 3.5,-1.568 3.5,-3.5c0,-1.932 -1.568,-3.5 -3.5,-3.5h-143.5v-24.5c0,-1.932 1.568,-3.5 3.5,-3.5zM35,42c-1.932,0 -3.5,1.568 -3.5,3.5v7c0,1.932 1.568,3.5 3.5,3.5c1.932,0 3.5,-1.568 3.5,-3.5v-7c0,-1.932 -1.568,-3.5 -3.5,-3.5zM52.5,42c-1.932,0 -3.5,1.568 -3.5,3.5v7c0,1.932 1.568,3.5 3.5,3.5c1.932,0 3.5,-1.568 3.5,-3.5v-7c0,-1.932 -1.568,-3.5 -3.5,-3.5zM70,42c-1.932,0 -3.5,1.568 -3.5,3.5v7c0,1.932 1.568,3.5 3.5,3.5c1.932,0 3.5,-1.568 3.5,-3.5v-7c0,-1.932 -1.568,-3.5 -3.5,-3.5zM87.5,42c-1.932,0 -3.5,1.568 -3.5,3.5v7c0,1.932 1.568,3.5 3.5,3.5c1.932,0 3.5,-1.568 3.5,-3.5v-7c0,-1.932 -1.568,-3.5 -3.5,-3.5zM105,42c-1.932,0 -3.5,1.568 -3.5,3.5v7c0,1.932 1.568,3.5 3.5,3.5c1.932,0 3.5,-1.568 3.5,-3.5v-7c0,-1.932 -1.568,-3.5 -3.5,-3.5zM122.5,42c-1.932,0 -3.5,1.568 -3.5,3.5v7c0,1.932 1.568,3.5 3.5,3.5c1.932,0 3.5,-1.568 3.5,-3.5v-7c0,-1.932 -1.568,-3.5 -3.5,-3.5zM140,42c-1.932,0 -3.5,1.568 -3.5,3.5v7c0,1.932 1.568,3.5 3.5,3.5c1.932,0 3.5,-1.568 3.5,-3.5v-7c0,-1.932 -1.568,-3.5 -3.5,-3.5zM157.5,42c-1.932,0 -3.5,1.568 -3.5,3.5v7c0,1.932 1.568,3.5 3.5,3.5c1.932,0 3.5,-1.568 3.5,-3.5v-7c0,-1.932 -1.568,-3.5 -3.5,-3.5zM175,42c-1.932,0 -3.5,1.568 -3.5,3.5v7c0,1.932 1.568,3.5 3.5,3.5c1.932,0 3.5,-1.568 3.5,-3.5v-7c0,-1.932 -1.568,-3.5 -3.5,-3.5zM192.5,42c-1.932,0 -3.5,1.568 -3.5,3.5v7c0,1.932 1.568,3.5 3.5,3.5c1.932,0 3.5,-1.568 3.5,-3.5v-7c0,-1.932 -1.568,-3.5 -3.5,-3.5zM178.5,63c-1.932,0 -3.5,1.568 -3.5,3.5c0,1.932 1.568,3.5 3.5,3.5h14c1.932,0 3.5,-1.568 3.5,-3.5c0,-1.932 -1.568,-3.5 -3.5,-3.5zM45.5,84c-1.932,0 -3.5,1.568 -3.5,3.5v14c0,1.932 1.568,3.5 3.5,3.5h133c1.932,0 3.5,-1.568 3.5,-3.5v-14c0,-1.932 -1.568,-3.5 -3.5,-3.5zM49,91h126v7h-126zM49,119c-3.8605,0 -7,3.1395 -7,7v7c0,3.8605 3.1395,7 7,7h49c3.8605,0 7,-3.1395 7,-7v-7c0,-3.8605 -3.1395,-7 -7,-7zM122.5,119c-1.932,0 -3.5,1.568 -3.5,3.5v42c0,1.932 1.568,3.5 3.5,3.5h56c1.932,0 3.5,-1.568 3.5,-3.5v-42c0,-1.932 -1.568,-3.5 -3.5,-3.5zM49,126h49l0.00684,7h-49.00684zM126,126h49v35h-49zM49,147c-3.8605,0 -7,3.1395 -7,7v7c0,3.8605 3.1395,7 7,7h49c3.8605,0 7,-3.1395 7,-7v-7c0,-3.8605 -3.1395,-7 -7,-7zM49,154h49l0.00684,7h-49.00684z"
                      />
                    </g>
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path d="M0,224v-224h224v224z" fill="none" />
                    <path d="M4.48,219.52v-215.04h215.04v215.04z" fill="none" />
                    <path
                      d="M112,224c-61.85589,0 -112,-50.14411 -112,-112v0c0,-61.85589 50.14411,-112 112,-112v0c61.85589,0 112,50.14411 112,112v0c0,61.85589 -50.14411,112 -112,112z"
                      fill="none"
                    />
                    <path
                      d="M112,219.52c-59.38166,0 -107.52,-48.13834 -107.52,-107.52v0c0,-59.38166 48.13834,-107.52 107.52,-107.52h0c59.38166,0 107.52,48.13834 107.52,107.52v0c0,59.38166 -48.13834,107.52 -107.52,107.52z"
                      fill="none"
                    />
                    <path d fill="none" />
                  </g>
                </g>
              </svg>
            </span>
            Мои квизы
          </b-nav-item>
          <b-nav-item to="/orders">
            <span class="link_icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="36"
                height="36"
                viewBox="0 0 224 224"
                style=" fill:#000000;"
              >
                <g
                  fill="none"
                  fill-rule="nonzero"
                  stroke="none"
                  stroke-width="1"
                  stroke-linecap="butt"
                  stroke-linejoin="miter"
                  stroke-miterlimit="10"
                  stroke-dasharray
                  stroke-dashoffset="0"
                  font-family="none"
                  font-weight="none"
                  font-size="none"
                  text-anchor="none"
                  style="mix-blend-mode: normal"
                >
                  <path d="M0,224v-224h224v224z" fill="none" />
                  <g fill="#02182b">
                    <g id="surface1">
                      <path
                        d="M59.5,0c-13.50781,0 -24.5,10.99219 -24.5,24.5v175c0,13.50781 10.99219,24.5 24.5,24.5h77c13.50781,0 24.5,-10.99219 24.5,-24.5v-37.35156c5.7832,-5.3457 8.50391,-11.5664 9.67969,-15.14844h42.82031c5.7832,0 10.5,-4.7168 10.5,-10.5v-77c0,-5.7832 -4.7168,-10.5 -10.5,-10.5h-52.5v-24.5c0,-13.50781 -10.99219,-24.5 -24.5,-24.5zM59.5,7h77c9.65235,0 17.5,7.84766 17.5,17.5v3.5h-112v-3.5c0,-9.65234 7.84766,-17.5 17.5,-17.5zM80.5,14c-1.9414,0 -3.5,1.5586 -3.5,3.5c0,1.94141 1.5586,3.5 3.5,3.5h7c1.94141,0 3.5,-1.55859 3.5,-3.5c0,-1.9414 -1.55859,-3.5 -3.5,-3.5zM101.5,14c-1.9414,0 -3.5,1.5586 -3.5,3.5c0,1.94141 1.5586,3.5 3.5,3.5h14c1.94141,0 3.5,-1.55859 3.5,-3.5c0,-1.9414 -1.55859,-3.5 -3.5,-3.5zM42,35h112v14h-31.5c-5.7832,0 -10.5,4.7168 -10.5,10.5v77c0,5.7832 4.7168,10.5 10.5,10.5h18.25195c0.3418,2.95313 0.1914,9.22852 -4.00586,19.70117c-0.46485,1.16211 -0.27344,2.47461 0.50586,3.45899c0.66992,0.84765 1.68164,1.33984 2.74805,1.33984c0.16406,0 0.32813,-0.01367 0.49219,-0.04102c5.37305,-0.76562 9.81641,-2.32422 13.50781,-4.32031v14.86133h-112zM122.5,56h91c1.92773,0 3.5,1.57227 3.5,3.5v77c0,1.92773 -1.57227,3.5 -3.5,3.5h-45.5c-1.69531,0 -3.14453,1.23047 -3.44531,2.89844c-0.12305,0.6836 -2.85742,15.17578 -19.12695,20.30273c4.40235,-14.13672 1.58594,-20.50781 1.20313,-21.27344c-0.60156,-1.17578 -1.80469,-1.92773 -3.13086,-1.92773h-21c-1.92773,0 -3.5,-1.57227 -3.5,-3.5v-77c0,-1.92773 1.57227,-3.5 3.5,-3.5zM167.83594,63c-9.65234,0 -17.82812,7.21875 -19.03125,16.80273l-1.72265,13.78125l-6.54883,15.72266c-0.90235,2.16015 -0.65625,4.62109 0.6289,6.57617c1.3125,1.95508 3.48633,3.11719 5.83789,3.11719h14c0,3.85547 3.14453,7 7,7c3.85547,0 7,-3.14453 7,-7h14.23242c2.35156,0 4.52539,-1.16211 5.82422,-3.11719c1.29883,-1.95508 1.54492,-4.41602 0.6289,-6.57617l-6.53515,-15.73633l-1.85937,-13.93164c-1.27148,-9.48828 -9.44727,-16.63867 -19.01758,-16.63867zM167.83594,70h0.4375c6.08398,0 11.26563,4.53906 12.07227,10.56836l1.92773,14.39649c0.04102,0.30078 0.12305,0.60156 0.23242,0.88867l6.74024,16.14648h-42.2461l5.83789,-14h18.66211c1.92773,0 3.5,-1.55859 3.5,-3.5c0,-1.9414 -1.57227,-3.5 -3.5,-3.5h-17.03515l1.28515,-10.33594c0.76563,-6.07031 5.96094,-10.66406 12.08594,-10.66406zM56,154c-1.9414,0 -3.5,1.5586 -3.5,3.5v7c0,1.94141 1.5586,3.5 3.5,3.5c1.94141,0 3.5,-1.55859 3.5,-3.5v-7c0,-1.9414 -1.55859,-3.5 -3.5,-3.5zM73.5,154c-1.9414,0 -3.5,1.5586 -3.5,3.5v7c0,1.94141 1.5586,3.5 3.5,3.5c1.94141,0 3.5,-1.55859 3.5,-3.5v-7c0,-1.9414 -1.55859,-3.5 -3.5,-3.5zM91,154c-1.9414,0 -3.5,1.5586 -3.5,3.5v7c0,1.94141 1.5586,3.5 3.5,3.5c1.94141,0 3.5,-1.55859 3.5,-3.5v-7c0,-1.9414 -1.55859,-3.5 -3.5,-3.5zM108.5,154c-1.9414,0 -3.5,1.5586 -3.5,3.5v7c0,1.94141 1.5586,3.5 3.5,3.5c1.94141,0 3.5,-1.55859 3.5,-3.5v-7c0,-1.9414 -1.55859,-3.5 -3.5,-3.5zM126,154c-1.9414,0 -3.5,1.5586 -3.5,3.5v7c0,1.94141 1.5586,3.5 3.5,3.5c1.94141,0 3.5,-1.55859 3.5,-3.5v-7c0,-1.9414 -1.55859,-3.5 -3.5,-3.5zM42,189h112v10.5c0,9.65235 -7.84765,17.5 -17.5,17.5h-77c-9.65234,0 -17.5,-7.84765 -17.5,-17.5zM98,196c-3.86914,0 -7,3.13086 -7,7c0,3.86914 3.13086,7 7,7c3.86914,0 7,-3.13086 7,-7c0,-3.86914 -3.13086,-7 -7,-7z"
                      />
                    </g>
                  </g>
                </g>
              </svg>
            </span>
            Все заявки
          </b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto other_links">
          <b-nav-item href="#">{{ myEmail }}</b-nav-item>
          <b-nav-item href="#" class="logout_btn" @click="onLogout">
            <span>Выйти</span>
            <i class="fas fa-sign-out-alt"></i>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <router-view></router-view>

    <footer class="page-footer blue pt-3 pb-3">
      <b-container fluid>
        <b-row class="align-items-center">
          <b-col lg="3" xl="2" sm="4" class="about_company">
            <p class="copyright">«Qlead» © 2019</p>
            <a href="mailto:me@qlead.ai">me@qlead.ai</a>
          </b-col>
        </b-row>
      </b-container>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    myEmail() {
      return this.$store.getters.user.email
    },
    myEmailLetter() {
      let email = this.$store.getters.user.email
      return email[0].toUpperCase()
    }
  },
  methods: {
    onLogout() {
      this.$store.dispatch('logoutUser')
      this.$router.push('/login')
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Rubik:300,400,500,700&subset=cyrillic');

.btn-outline-success:not(:disabled):not(.disabled):active,
.btn-outline-success:not(:disabled):not(.disabled).active,
.show > .btn-outline-success.dropdown-toggle {
  color: #ffffff !important;
}

.btn-outline-success:hover {
  color: #fff;
}

.btn-success {
  color: #fff;
}

.btn-danger {
  color: #fff;
}

#app {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
}

body {
  font-family: 'Rubik', sans-serif;
  background-color: #f8f9fb;
  color: #02182b;
}

.navbar {
  background-color: #fff;
  border-bottom: 1px solid #f0f3f4;
}

.navbar-light .main_links .active > .nav-link,
.navbar-light .main_links .nav-link.active,
.navbar-light .main_links .nav-link.show,
.navbar-light .main_links .show > .nav-link {
  color: #4da1ff;
  font-weight: 500;
}

.main_links .active .link_icon {
  opacity: 1;
}

.main_links .active span g g g {
  fill: #4da1ff;
}

.link_icon {
  width: 36px;
  height: 36px;
  opacity: 0.6;
  margin-right: 6px;
}

.navbar-light .navbar-nav .nav-link:hover {
  color: #4da1ff;
}

.navbar-brand {
  margin-right: 6rem;
}

@media (min-width: 768px) {
  .navbar-expand-md .navbar-nav .nav-link {
    padding-right: 1rem;
    padding-left: 1rem;
  }
}

.navbar-light .other_links .nav-link:focus,
.navbar-light .other_links .nav-link:hover {
  color: rgba(0, 0, 0, 0.7);
}

.navbar-nav .time_tariff .nav-link {
  color: #4da1ff;
  font-weight: 500;
}

.navbar-nav .time_tariff .nav-link:focus,
.navbar-nav .time_tariff .nav-link:hover {
  color: #4da1ff;
}

.other_links {
  -ms-align-items: center;
  align-items: center;
}

.other_links .dropdown-toggle {
  font-weight: 500;
}

.other_links .dropdown-toggle::after {
  display: none;
}

.dropdown-toggle {
  border-radius: 50%;
}

.other_links .dropdown {
  width: 36px;
  height: 36px;
}

.nav_dropdown:hover .dropdown-menu {
  display: block;
}

.dropdown-item.active,
.dropdown-item:active {
  background-color: #4da1ff;
}

.about_company {
  text-align: center;
}

.social a {
  padding: 0 0.5rem;
}

.page-footer {
  background-color: #fff;
  border-top: 1px solid #f0f3f4;
}

.page-footer p {
  margin-bottom: 0.5rem;
}

.popover-container input {
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.c-day-background {
  background-color: #4da1ff !important;
}

.popover-origin .popover-content-wrapper .popover-content {
  background-color: #fff !important;
}

.popover-origin.direction-bottom.align-center,
.popover-origin.direction-top.align-center {
  display: none !important;
}

.fa-sign-out-alt {
  font-size: 1.3rem;
  position: relative;
  top: 1.5px;
}

.logout_btn span {
  display: none;
}

@media (max-width: 1199.98px) {
  .navbar-brand {
    margin-right: 3rem;
  }
}

@media (max-width: 991.98px) {
  .logo img {
    height: 36px;
    width: 98px;
  }
}

@media (max-width: 767.98px) {
  .navbar {
    justify-content: flex-start;
  }

  .navbar-brand {
    margin-right: 0;
    margin-left: 1rem;
  }

  .other_links {
    -ms-align-items: flex-start;
    align-items: flex-start;
  }

  .navbar-collapse {
    padding-top: 0.5rem;
  }

  .navbar-light .navbar-nav .nav-link {
    padding: 1rem 0;
  }

  .navbar-light .main_links .nav-link {
    border-bottom: 1px solid #eee;
  }

  .fa-sign-out-alt {
    display: none;
  }

  .logout_btn span {
    display: block;
  }
}

@media (max-width: 575.98px) {
  .social {
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    display: -o-flex;
    display: flex;
    -webkit-flex-wrap: wrap;
    -moz-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    -o-flex-wrap: wrap;
    flex-wrap: wrap;
    justify-content: center;
    -ms-align-items: center;
    align-items: center;
    margin-top: 1rem;
  }

  .social a:last-child {
    padding: 1rem 0;
  }
}
</style>
