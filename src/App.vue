<template>
  <div id="app">
    <h1>
      <a-popover title="Visit Notion?">
        <template slot="content">
          <p>
            Click to visit:
            <a href="https://notion.so/">notion.so</a>
          </p>
        </template>
        <a href="https://notion.so/">
          <img src="/logo.png" class="rotate-icon" />
        </a>
      </a-popover>Table Generator
    </h1>
    <!-- <h2>Options</h2> -->
    <h2>
      <a-icon type="setting" class="rotate-icon" />
    </h2>
    <p class="options-btns">
      <a-button-group>
        <a-button type="primary" icon="copy" @click="copy_to_clipboard">Copy</a-button>
      </a-button-group>&nbsp;
      <a-button-group>
        <a-button type="secondary" @click="add_row">
          Row
          <a-icon type="plus" />
        </a-button>
        <a-button type="secondary" @click="del_row">
          <a-icon type="minus" />
        </a-button>
      </a-button-group>&nbsp;
      <a-button-group>
        <a-button type="secondary" @click="add_col">
          Col
          <a-icon type="plus" />
        </a-button>
        <a-button type="secondary" @click="del_col">
          <a-icon type="minus" />
        </a-button>
      </a-button-group>
    </p>
    <div id="options">
      <a-switch
        default-unchecked
        checked-children="Bold"
        un-checked-children="Bold"
        v-model="option_bold_head"
      ></a-switch>&nbsp;
      <a-switch
        default-unchecked
        checked-children="Italic"
        un-checked-children="Italic"
        v-model="option_italic_content"
      ></a-switch>&nbsp;
      <a-switch
        default-unchecked
        checked-children="Border"
        un-checked-children="Border"
        v-model="option_vertical_border"
      ></a-switch>
    </div>
    <div id="editable">
      <transition name="slide-fade">
        <vue-excel-editor ref="grid" v-model="table_data" no-footer no-header-edit v-if="refresh">
          <vue-excel-column v-for="attr in attrs" v-bind:key="attr" :field="attr" type="string" />
          <!-- {{table_data}}
          {{attrs}}-->
        </vue-excel-editor>
      </transition>
    </div>
    <transition name="slide-fade">
      <a-alert
        message="New: double click to edit cells!"
        type="info"
        v-show="msg_feature_show"
        close-text="Close"
        show-icon
        class="msg"
        id="new_feature"
      />
    </transition>
    <transition name="slide-fade">
      <a-alert v-show="msg_show" :message="msg_content" type="success" show-icon class="msg" />
    </transition>
    <!-- <h2>Result</h2> -->

    <div id="code">
      <!-- <hr align="center" width="100%" color="#eeeeee" size="1" /> -->
      <h2>
        <a-icon type="search" class="rotate-icon" />
      </h2>
      <transition name="fade">
        <katex-element v-if="refresh" :expression="code" />
      </transition>
      <!-- <hr align="center" width="100%" color="#eeeeee" size="1" /> -->
      <!-- <h2>Code</h2> -->
      <h2>
        <a-icon type="code" class="rotate-icon" />
      </h2>
      <p class="code" v-html="code_display"></p>
      <!-- <hr align="right" width="100%" color="#eeeeee" size="1" /> -->
    </div>
    <info />
  </div>
</template>

<script>
// import Vue from 'vue/dist/vue.js';
import info from './components/info.vue'

export default {
    name: 'App',
    components: {
        info,
    },
    data() {
        return {
            table_data: [{
                    user: 'Alice',
                    name: 'HarryCole',
                    phone: '1415',
                    gender: 'M'
                },
                {
                    user: 'Bob',
                    name: 'SimonMinolta',
                    phone: '1123',
                    gender: 'M'
                },
                {
                    user: 'Caro',
                    name: 'RaymondAtom',
                    phone: '1456',
                    gender: 'M'
                },
            ],
            attrs: ['user', 'name', 'phone', 'gender'],
            option_bold_head: false,
            option_vertical_border: false,
            option_italic_content: false,
            msg_show: false,
            msg_feature_show: true,
            refresh:false,
            msg_content: 'Copied! Check the clipboard~',
            preview_output: 'Nothing to show',
            code: "",
            code_display: "",
            code_begin: '\\begin{array}',
            code_hline: '\\\\\\hline\n    ',
            code_end: '\\end{array}',
        }
    },
    methods: {
        add_row() {
            let new_row = {
                ...this.table_data[this.table_data.length - 1]
            }
            this.table_data.push(new_row)
        this.refresh = false;
        setTimeout(() => {
        this.refresh = true;
        }, 1);
        },
        del_row() {
            this.table_data.splice(-1, 1)
        this.refresh = false;
        setTimeout(() => {
        this.refresh = true;
        }, 1);
        },
        add_col() {
            this.attrs = Object.keys(this.table_data[0]).filter(v => v !== '$id')
            let col_name = 'Col ' + (this.attrs.length + 1)
            function add_attr(item) {
                item[col_name] = "";
                return item;
            }
            
            this.table_data = Object.assign(this.table_data.map(add_attr))
            this.attrs = Object.keys(this.table_data[0]).filter(v => v !== '$id')
            console.log(this.attrs)
            // this.json_to_code();
        this.refresh = false;
        setTimeout(() => {
        this.refresh = true;
        }, 1);
          
        },
        del_col() {
          this.attrs = Object.keys(this.table_data[0]).filter(v => v !== '$id')
          let last_attr = this.attrs[this.attrs.length-1]
          // console.log(this.attrs[this.attrs.length-1])
          function del_attr(item) {
             delete item[last_attr]
             return item
            }
          // console.log( this.table_data.map(del_attr))
          // console.log( typeof(this.table_data.map(del_attr)))
          this.table_data = Object.assign(this.table_data.map(del_attr))
          this.attrs = Object.keys(this.table_data[0]).filter(v => v !== '$id')
          console.log(this.attrs)
          
        this.refresh = false;
        setTimeout(() => {
        this.refresh = true;
        }, 1);
          
        },
        clean_id: function (obj) {
            let tmp = Object.assign(obj)
            delete tmp.$id
            // return JSON.stringify(tmp)
            return tmp
        },
        json_to_code: function () {
            this.code = ""
            this.code += this.code_begin
            if (this.option_vertical_border) {
                this.code += '{|' + ('c|').repeat(this.attrs.length) + '}' + this.code_hline.slice(2)
            } else {
                this.code += '{' + ('c').repeat(this.attrs.length) + '}' + this.code_hline.slice(2)
            }
            if (this.option_bold_head && this.option_italic_content) {
                this.code += '\\bf{' + this.attrs.join('}&\\bf{') + '}' + this.code_hline
            } else if (this.option_bold_head && !this.option_italic_content) {
                this.code += '\\textbf{' + this.attrs.join('}&\\textbf{') + '}' + this.code_hline
            } else if (!this.option_bold_head && !this.option_italic_content) {
                this.code += '\\text{' + this.attrs.join('}&\\text{') + '}' + this.code_hline
            } else {
                this.code += '{' + this.attrs.join('}&{') + '}' + this.code_hline
            }
            for (let row in this.table_data) {
                let line = '\\text{' + Object.values(this.clean_id(this.table_data[row])).join("}&\\text{") + '}'
                line += this.code_hline
                this.code += line
            }
            this.code += this.code_end
        },
        copy_to_clipboard: function () {
            try {
                navigator.clipboard.writeText(this.code);
                this.msg_show = true
                setTimeout(() => {
                    this.msg_show = false
                }, 1000);
            } catch (err) {
                this.msg_copied = 'Failed to copy: ' + err
                setTimeout(() => {
                    this.msg_show = false
                }, 1000);
                console.error('Failed to copy: ', err);
            }
        }
    },
    watch: {
        table_data: function () {
            this.json_to_code();
        },
        option_bold_head: function () {
            this.json_to_code();
        },
        option_vertical_border: function () {
            this.json_to_code();
        },
        option_italic_content: function () {
            this.json_to_code();
        },
        code: function () {
            this.copy_to_clipboard();
            this.code_display = this.code.split("\n").join("<br/>");
        },
        refresh: function () {
        }
    },
    mounted: function () {
        this.json_to_code();
        this.refresh = true;
        setTimeout(() => {
            this.msg_feature_show = false;
        }, 5000);
    }
}
</script>

<style>
/* @import "../node_modules/katex/dist/katex.min.css"; */
body {
  background: #fff;
}
body h2 {
  color: #666;
}
body h1 {
  size: 2em;
}
body h1 img {
  width: 1em;
  margin-top: -0.24em;
  position: inline-block;
  margin-right: 0.4em;
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
#options {
  position: inline-block;
  /* margin-right: 30%; */
  text-align: center;
  color: #777;
  font-size: 16px;
  margin: 0 auto;
  padding: 0em 0em 1em;
  /* margin-left: 28%;
  padding-right: -50%; */
  /* margin-top: 0; */
}

#options button {
  margin-left: 0.5em;
}

#options .ant-switch:hover {
  background-color: #40a9ff;
}
#code {
  background-color: #f5f5f5;
  padding: 0em 0 0;
  -webkit-box-shadow: inset 0px 58px 18px -61px rgba(168, 168, 168, 0.99);
  -moz-box-shadow: inset 0px 58px 18px -61px rgba(168, 168, 168, 0.99);
  box-shadow: inset 0px 58px 18px -61px rgba(168, 168, 168, 0.99);
}
.options-btns .ant-btn-group {
  margin-left: 0.5em !important;
}
.code {
  font-family: Consolas, Monaco, monospace;
  word-wrap: break-word;
  background-color: rgba(0, 21, 41, 0.7);
  /* opacity: 0.8; */
  font-size: 0.8em;
  color: #eee;
  margin: 2em 0em 0em;
  padding: 1.5em;
  line-height: 2em;
  font-family: Consolas, Monaco, monospace;
  -webkit-box-shadow: inset 0px -55px 18px -61px rgba(0, 0, 0, 1);
  -moz-box-shadow: inset 0px -55px 18px -61px rgba(0, 0, 0, 1);
  box-shadow: inset 0px -55px 18px -61px rgba(0, 0, 0, 1);
}
.msg {
  /* margin: 0.5em 15% 1.5em; */
  margin: 1em auto;
  text-align: center;
  max-width: 400px;
}
.slide-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.14, 0.39, 0.9, 0.92);
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.14, 0.39, 0.9, 0.92);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.rb-square {
  width: 9px;
  height: 9px;
  border-top: 2px solid white;
  border-left: 2px solid white;
  border-bottom: 0;
  border-right: 0;
  background-color: #40a9ff !important;
  position: absolute;
  bottom: -3px;
  right: -2px;
  cursor: crosshair;
}

.input-square {
  position: absolute;
  padding: 0;
  z-index: 4;
  background-color: rgba(64, 169, 255, 0.4) !important;
  border: 2px solid #40a9ff !important;
  /* transition: all 0.04s linear; */
}
.autocomplete-results {
  z-index: 15;
  position: fixed;
  padding: 3px;
  margin: -1px;
  background-color: lightyellow;
  border: 1px solid #40a9ff !important;
  height: -webkit-fit-content;
  height: -moz-fit-content;
  height: fit-content;
  font-size: 0.88rem;
  max-width: 300px;
}
.component-content {
  border-radius: 4px;
  border-collapse: collapse;
  /* border-radius: 4px; */
  overflow: hidden;

  display: flex;
  flex-flow: column;
  position: relative;
  max-width: -webkit-fit-content;
  max-width: -moz-fit-content;
  max-width: fit-content;
  word-spacing: 0.02rem;
  line-height: 1.1;
  overflow: hidden;
  border: 1px solid lightgray;
}
.systable thead th {
  background-color: #f5f5f5 !important;
  cursor: s-resize;
  z-index: 6;
}
.systable .first-col {
  background: #f5f5f5;
  background-image: initial;
  background-position-x: initial;
  background-position-y: initial;
  background-size: initial;
  background-attachment: initial;
  background-origin: initial;
  background-clip: initial;
  background-color: #f5f5f5 !important;
  width: 40px;
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  top: auto;
  cursor: e-resize !important;
  text-overflow: inherit !important;
  text-align: center;
  padding-left: 0;
  padding-right: 0;
  overflow: hidden;
  z-index: 5;
}

.rotate-icon {
  transition: all 0.2s ease-in-out;
  -webkit-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
}
.rotate-icon:hover {
  transform: rotate(360deg);
  -webkit-transform: rotate(360deg);
  -moz-transform: rotate(360deg);
  -o-transform: rotate(360deg);
  -ms-transform: rotate(360deg);
}
#editable {
  margin: 0em 0 2em;
}

#code .rotate-icon {
  margin: 1.5em 0 0;
}
</style>
