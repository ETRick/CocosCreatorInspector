<template>
  <div style="height: 30px; overflow: hidden; width: 100%; text-align: left;">
    <div style="width: 20%; float: left; background-color: #4a4a4a;"
         :class="{'noselect': true, 'center': isTextCenter}">
      <span class="noselect font spancolor"
            style="line-height: 30px;color: #bdbdbd;font-size: 12px;margin: 3px;">
        {{name}}
      </span>
    </div>
    <div style="float:left; background-color: #4a4a4a; width: 80%; height:100%;">
      <div style="line-height: 30px;height: 100%;">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["name", "isTextCenter"]
};
</script>

<style scoped>
.font {
  font-family: BlinkMacSystemFont, "Helvetica Neue", Helvetica, "Lucida Grande",
    "Segoe UI", Ubuntu, Cantarell, "SourceHanSansCN-Normal", Arial, sans-serif;
}

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
  /* Non-prefixed version, currently
   not supported by any browser */
}

.center {
  text-align: center;
}
</style>
