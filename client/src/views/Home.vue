<template>
  <Mobile v-if="isMobile"/>
  <Desktop v-else/>
</template>

<script>
import Mobile from "@/components/Home/Mobile.vue";
import Desktop from "@/components/Home/Desktop.vue";

export default {
  components: {
    Mobile,
    Desktop
  },
  computed: {
    isMobile() {
      if (
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
      )
        return true;
      else return false;
    }
  }
};
</script>