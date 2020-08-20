<template>
  <div id="info" class="info">
    <p>
      By
      <a :href="author_site">{{ author }}</a>
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
    description: 'A Katex Compatible Table Generator For Notion',
    notion_site: 'https://notion.so/'}
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
p {
  color: #999;
}
a {
  color: #1890ff;
}
.info {
  text-align: right;
  line-height: 0.8em;
  margin: 1em 2em 0em;
}
</style>
