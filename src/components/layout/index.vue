<template>
  <div class="layout-container">
    <nav>
      <div class="nav-inner">
        <div class="left">
            <div class="profile">
                <img src="/static/imgs/profile/profile.jpg"  >
            </div>
            <span>何永奎(Yokry)</span>
        </div>
        <div class="center">center</div>
        <div class="right">right</div>
      </div>
    </nav>
    <main>
      <router-view></router-view>
    </main>
    <footer>footer</footer>
  </div>

</template>

<script>
export default {
  name: "layout",
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
$nav-height: 60px;
$paddingSize: 24px;
$paddingSizeSmall: 12px;
.layout-container {
  min-height: 100%;
  nav {
    height: $nav-height;
    margin: 0 auto;
    line-height: 60px;
    box-shadow: 0 2px 8px #f0f1f2;
    padding: 0 $paddingSize;
    .nav-inner {
        display: flex;
        max-width: 1400px;
        margin: 0 auto;
        align-items: center;
        div.left,
        div.right {
            display: inline-flex;
            align-items: center;
        }
        div.left {
            padding-right: 24px;
            div.profile {
                width: 40px;
                height:40px;
                overflow: hidden;
                border-radius: 50%;
                img {
                    width: 100%;
                    height: 100%;
                }
                & + span {
                    display: inline-block;
                    margin-left: 12px;
                }
            }


        }
        div.right {
            padding-left: 24px;
        }
        div.center {
            flex: 1;
        }
    }



    @media screen and (max-width: 900px) {
      padding: 0 $paddingSizeSmall;
    }
  }
  main {
    min-height: calc(100% - 60px);
  }
}
</style>
