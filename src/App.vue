<template>
  <div id="app">
    <h1>Notion Table Generator</h1>
    <h2>Options</h2>
    <div id="options">
      Columns:
      <!-- {{col}} -->
      <a-input-number id="col" v-model="col" :min="1" @change="onChange" defaultValue="3" />
      <br />Rows:
      <!-- {{row}} -->
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
      <a-button type="primary" icon="copy" @click="text_to_code">Copy</a-button>
    </div>
    <transition name="slide-fade">
      <a-alert
        v-show="show_msg"
        :message="copied_message"
        type="success"
        show-icon
        class="success_message"
      />
    </transition>
    <hr align="center" width="100%" color="#eeeeee" size="1" />
    <h2>Preview</h2>
    <katex-element :expression="output" />
    <hr align="center" width="100%" color="#eeeeee" size="1" />
    <h2>Code</h2>
    <p class="code" v-html="code"></p>
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
    data() {
        return {
            col: 3,
            row: 4,
            text: 'Test',
            code: "",
            begin: '\\begin{array}',
            end: '\\end{array}',
            hline: '\\\\\\hline\n    ',
            head: '',
            line: '',
            bold_head: false,
            border: false,
            copied_message: 'Copied! Check the clipboard~',
            show_msg: false,
            output: 'Message: the output is currently null!'
        }
    },
    methods: {
        onChange(value) {
            console.log('changed', value);
        },
        text_to_code: function() {
            if (this.bold_head == true) {
                if (this.border == true) {
                    this.head = '{|' + ('c|').repeat(this.col) + '}' + this.hline.slice(2) + ('\\textbf{Col}&').repeat(this.col).slice(0, -1) + this.hline;
                } else {
                    this.head = '{' + ('c').repeat(this.col) + '}' + this.hline.slice(2) + ('\\textbf{Col}&').repeat(this.col).slice(0, -1) + this.hline;
                }
            } else {
                if (this.border == true) {
                    this.head = '{|' + ('c|').repeat(this.col) + '}' + this.hline.slice(2) + ('\\text{Col}&').repeat(this.col).slice(0, -1) + this.hline;
                } else {
                    this.head = '{' + ('c').repeat(this.col) + '}' + this.hline.slice(2) + ('\\text{Col}&').repeat(this.col).slice(0, -1) + this.hline;
                }
            }
            this.line = ('c&').repeat(this.col).slice(0, -1) + this.hline
            this.output = this.begin + this.head + this.line.repeat(this.row).slice(0, -4) + this.end;
            this.code = this.output.split("\n    ").join("<br/>    ")
            // katex.render(this.output, document.getElementsByClassName('preview')[0], {
            //     throwOnError: false
            // });

            try {
                navigator.clipboard.writeText(this.output);
                this.show_msg = true
                setTimeout(() => {
                    this.show_msg = false
                }, 1000);
            } catch (err) {
                this.copied_message = 'Failed to copy: ' + err
                setTimeout(() => {
                    this.show_msg = false
                }, 1000);
                console.error('Failed to copy: ', err);
            }
            // if (this.clicks) {
            // }
        },
    },
    watch: {
        col: function() {
            this.text_to_code();
        },
        row: function() {
            this.text_to_code();
        },
        bold_head: function() {
            this.text_to_code();
        },
        border: function() {
            this.text_to_code();
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
  background: #f2f3f5;
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
  font-size: 0.8em;
  color: #eee;
  /* margin: 0em 2em 0em; */
  padding: 1.5em;
  line-height: 2em;
  font-family: Consolas, Monaco, monospace;
}
#options {
  position: inline-block;
  /* margin-right: 30%; */
  text-align: right;
  color: #777;
  font-size: 16px;
  margin-left: -50%;
  margin-right: 45%;
  margin-top: 0;
}
/* 
#options a-col {
  margin: 1em 20% 1em;
} */
#options .ant-input-number {
  color: #999;
  text-align: right !important ;
}
#options .ant-input-number:hover {
  color: #40a9ff;
}
#options .ant-switch:hover {
  background-color: #999999;
}

.success_message {
  margin: 0.5em 30% 1.5em;
  text-align: center;
}
.slide-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.14, 0.39, 0.9, 0.92);
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.14, 0.39, 0.9, 0.92);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
