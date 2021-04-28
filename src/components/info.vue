<template>
  <div id="info" class="info">
    <p>
      <a :href="author_site">{{ author }}</a> © 2020-2021
    </p>
    <p>{{ description }}</p>
  </div>
</template>

<script>
export default {
  name: 'info',
  props: {
    msg: String
  },   
  data () {
    return {
    author: 'Reynard',
    author_site: 'https://quoth.win/',
    description: 'A Katex compatible table generator for Notion',
    notion_site: 'https://notion.so/'}
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.info {
  /* float:none; */
  /* display: inline-block; */
  margin: 3em 20% 1em 20%;
  text-align: center;
  font-size: 0.8em;
  line-height: 0.8em;
}
p {
  color: #999;
}
/* a {
  color: #bbb;
} */
</style>
