<template>
  <div id="app">
    <h1>Notion Table Generator</h1>
    <h2>Options</h2>
    <div id="options">
      Columns:
      {{col}}
      <a-input-number id="col" v-model="col" :min="1" @change="onChange" defaultValue="3" />
      <br />
      Rows:
      {{row}}
      <a-input-number id="row" v-model="row" :min="1" @change="onChange" defaultValue="4" />
      <br />Bold head:
      <a-switch default-unchecked v-model="bold_head">
        <a-icon slot="checkedChildren" type="check" />
        <a-icon slot="unCheckedChildren" type="close" />
      </a-switch>
      <br />Vertical border:
      <a-switch default-unchecked v-model="border">
        <a-icon slot="checkedChildren" type="check" />
        <a-icon slot="unCheckedChildren" type="close" />
      </a-switch>

      <br />
      <a-button type="primary" icon="copy">Copy</a-button>
    </div>
    <transition name="slide-fade">
      <a-alert
        v-if="clicks"
        :message="copied_message"
        type="success"
        show-icon
        class="success_message"
      />
    </transition>
    <hr align="center" width="100%" color="#eeeeee" size="1" />
    <h2>Preview</h2>
    <!-- <div v-katex:auto>$${{ output }}$$</div> -->
    <katex-element :expression="output" />
    <hr align="center" width="100%" color="#eeeeee" size="1" />
    <h2>Code</h2>
    <p class="code">{{ output }}</p>

    <hr align="right" width="100%" color="#eeeeee" size="1" />
    <info />
  </div>
</template>

<script>
import info from './components/info.vue'

export default {
  name: 'App',
  components: {
    info
  },
  data () {
    return {
      col:3,
      row:4,
      text: 'Test',
      code: "",
      begin: '\\begin{array}',
      end: '\\end{array}',
      hline: '\\\\\\hline\n',
      head: '',
      line: '',
      bold_head:false,
      border: false,
      copied_message: '',
      clicks: false,
      output: 'Message: the output is currently null!'
    }
  },
  methods: {
    onChange(value) {
      console.log('changed', value);
    },
        text_to_code: function() {
            if (this.bold_head == true) {
              if (this.border == true){
                this.head = '{|' + ('c|').repeat(this.col) + '}' + this.hline.slice(2) + ('\\textbf{Col}&').repeat(this.col).slice(0, -1) + this.hline;
              } else {
                this.head = '{' + ('c').repeat(this.col) + '}' + this.hline.slice(2) + ('\\textbf{Col}&').repeat(this.col).slice(0, -1) + this.hline;}
            } else {
              if (this.border == true) {
                this.head = '{|' + ('c|').repeat(this.col) + '}' + this.hline.slice(2) + ('\\text{Col}&').repeat(this.col).slice(0, -1) + this.hline;
                } else {
                this.head = '{' + ('c').repeat(this.col) + '}' + this.hline.slice(2) + ('\\text{Col}&').repeat(this.col).slice(0, -1) + this.hline;}
            }
            this.line = ('c&').repeat(this.col).slice(0, -1) + this.hline
            this.output = this.begin + this.head + this.line.repeat(this.row) + this.end;
            // katex.render(this.output, document.getElementsByClassName('preview')[0], {
            //     throwOnError: false
            // });

            try {
                this.copied_message = 'Copied!'
                navigator.clipboard.writeText(this.output);
            } catch (err) {
                this.copied_message = 'Failed to copy: ' + err
                console.error('Failed to copy: ', err);
            }
            // if (this.clicks) {
            // }
        },
    },
    watch: {
        col: function() {
            this.text_to_code();
            this.clicks = true;
        },
        row: function() {
            this.text_to_code();
            this.clicks = true;
        },
        bold_head: function() {
            this.text_to_code();
            this.clicks = true;
        },
        border: function() {
            this.text_to_code();
            this.clicks = true;
        }
    },
    mounted: function() {
        this.text_to_code();
    }
}
</script>

<style>
/* @import "../node_modules/katex/dist/katex.min.css"; */
body {
  background: #f0f2f5;
}
body h2 {
  color: #666;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 2em;
  line-height: 3em;
}
.code {
  font-family: Consolas, Monaco, monospace;
  word-wrap: break-word;
  background-color: #001529;
  opacity: 0.8;
  /* font-size: 0.8em; */
  color: #eee;
  margin: 0em 2em 0em;
  padding: 1.5em;
  line-height: 2em;
  font-family: Consolas, Monaco, monospace;
}
#options {
  position: inline-block;
  margin-right: 40%;
  text-align: right;
  color: #777;
  font-size: 16px;
}

.success_message {
  margin: 2em 30% 2em;
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
