<template>
  <div id="app">
    <h1>Notion Table Generator</h1>
    <h2>Options</h2>
    <p>
      <a-button type="primary" icon="copy" @click="copyToClipboard">Copy</a-button>&nbsp;
      <a-button-group>
        <a-button type="secondary" @click="newRecord">
          Row
          <a-icon type="plus" />
        </a-button>
        <a-button type="secondary" @click="delRecord">
          <a-icon type="minus" />
        </a-button>
      </a-button-group>&nbsp;
      <a-button-group>
        <a-button type="secondary" @click="newColumn">
          Column
          <a-icon type="plus" />
        </a-button>
        <a-button type="secondary" @click="delColumn" disabled>
          <a-icon type="minus" />Coming soon...
        </a-button>
      </a-button-group>
    </p>
    <div id="editable">
      <vue-excel-editor ref="grid" v-model="tableData" no-footer no-header-edit>
        <vue-excel-column v-for="attr in attrs" v-bind:key="attr" :field="attr" type="string" />
      </vue-excel-editor>
    </div>
    <div id="options">
      <!-- Columns: -->
      <!-- {{col}} -->
      <!-- <a-input-number id="col" v-model="col" :min="1" @change="onChange" defaultValue="3" /> -->
      <!-- <br />Rows: -->
      <!-- {{row}} -->
      <!-- <a-input-number id="row" v-model="row" :min="1" @change="onChange" defaultValue="4" /> -->

      <a-switch
        default-unchecked
        checked-children="Bold"
        un-checked-children="Bold"
        v-model="option_bold_head"
      >
        <!-- <a-icon slot="checkedChildren" type="check" /> -->
        <!-- <a-icon slot="unCheckedChildren" type="close" /> -->
      </a-switch>&nbsp;
      <a-switch
        default-unchecked
        checked-children="Border"
        un-checked-children="Border"
        v-model="option_vertical_border"
      ></a-switch>
    </div>
    <transition name="slide-fade">
      <a-alert
        message="New: double click to edit cells!"
        type="info"
        close-text="Dissmiss"
        show-icon
        class="msg"
      />
    </transition>
    <transition name="slide-fade">
      <a-alert v-show="msg_show" :message="msg_content" type="success" show-icon class="msg" />
    </transition>
    <hr align="center" width="100%" color="#eeeeee" size="1" />
    <h2>Result</h2>
    <katex-element :expression="code" />
    <hr align="center" width="100%" color="#eeeeee" size="1" />
    <!-- <h2>Code</h2> -->
    <p class="code" v-html="code"></p>
    <hr align="right" width="100%" color="#eeeeee" size="1" />
    <info />
  </div>
</template>

<script>
import info from './components/info.vue'
// import editable from './components/editable.vue'

// export default {
//     name: 'App',
//     components: {
//         info,
//         editable
//     },
//     data() {
//         return {
//             col: 4,
//             row: 3,
//             text: 'Test',
//             code: "",
//             begin: '\\begin{array}',
//             end: '\\end{array}',
//             hline: '\\\\\\hline\n    ',
//             head: '',
//             line: '',
//             bold_head: false,
//             border: false,
//             copied_message: 'Copied! Check the clipboard~',
//             show_msg: false,
//             output: 'Message: the output is currently null!'
//         }
//     },
//     methods: {
//         onChange(value) {
//             console.log('changed', value);
//         },
//         text_to_code: function() {
//             if (this.bold_head == true) {
//                 if (this.border == true) {
//                     this.head = '{|' + ('c|').repeat(this.col) + '}' + this.hline.slice(2) + ('\\textbf{Col}&').repeat(this.col).slice(0, -1) + this.hline;
//                 } else {
//                     this.head = '{' + ('c').repeat(this.col) + '}' + this.hline.slice(2) + ('\\textbf{Col}&').repeat(this.col).slice(0, -1) + this.hline;
//                 }
//             } else {
//                 if (this.border == true) {
//                     this.head = '{|' + ('c|').repeat(this.col) + '}' + this.hline.slice(2) + ('\\text{Col}&').repeat(this.col).slice(0, -1) + this.hline;
//                 } else {
//                     this.head = '{' + ('c').repeat(this.col) + '}' + this.hline.slice(2) + ('\\text{Col}&').repeat(this.col).slice(0, -1) + this.hline;
//                 }
//             }
//             this.line = ('c&').repeat(this.col).slice(0, -1) + this.hline
//             this.output = this.begin + this.head + this.line.repeat(this.row).slice(0, -4) + this.end;
//             this.code = this.output.split("\n    ").join("<br/>    ")
//             // katex.render(this.output, document.getElementsByClassName('preview')[0], {
//             //     throwOnError: false
//             // });

//             try {
//                 navigator.clipboard.writeText(this.output);
//                 this.show_msg = true
//                 setTimeout(() => {
//                     this.show_msg = false
//                 }, 1000);
//             } catch (err) {
//                 this.copied_message = 'Failed to copy: ' + err
//                 setTimeout(() => {
//                     this.show_msg = false
//                 }, 1000);
//                 console.error('Failed to copy: ', err);
//             }
//             // if (this.clicks) {
//             // }
//         },
//     },
//     watch: {
//         col: function() {
//             this.text_to_code();
//         },
//         row: function() {
//             this.text_to_code();
//         },
//         bold_head: function() {
//             this.text_to_code();
//         },
//         border: function() {
//             this.text_to_code();
//         }
//     },
//     mounted: function() {
//         this.text_to_code();
//     }
// }
// import Vue from 'vue/dist/vue.js';
export default {
    name: 'App',
    components: {
      info,
    },
    data() {
        return {
          tableData: [
            {user: 'Alice', name: 'HarryCole',    phone: '1415', gender: 'M'},
            {user: 'Bob', name: 'SimonMinolta', phone: '1123', gender: 'M'},
            {user: 'Caro', name: 'RaymondAtom',  phone: '1456', gender: 'M'},
          ],
          attrs: ['user', 'name', 'phone', 'gender'],
          option_bold_head: false,
          option_vertical_border: false,
          msg_show: false,
          msg_content: 'Copied! Check the clipboard~',
          preview_output: 'Nothing to show',
          code: "",
          code_begin: '\\begin{array}',
          code_hline: '\\\\\\hline\n    ',
          code_end: '\\end{array}',
        }
    }, 
    methods: {
      newRecord () {
          let newRow = {...this.tableData[this.tableData.length-1]}
          this.tableData.push(newRow)
      },
      delRecord () {
          this.tableData.splice(-1,1)
      },
      delColumn () {
          this.tableData.splice(-1,1)
          //TODO
      },
      newColumn() {
        this.attrs = Object.keys(this.tableData[0]).filter(v => v !== '$id')
        // console.log(typeof(this.attrs))
        let new_col_name = 'Col ' + (this.attrs.length +1 )
        function add_new_attr(item) {
          item[new_col_name] = "";
          return item;
        }
        this.tableData.map(add_new_attr)
        this.attrs = Object.keys(this.tableData[0]).filter(v => v !== '$id')
        console.log(this.attrs)
        // this.jsonToCode();
      },
      withoutId: function (obj) {
        let tmp = Object.assign(obj)
        delete tmp.$id
        // return JSON.stringify(tmp)
        return tmp
      },
      jsonToCode: function()  {
        this.code = ""
        this.code += this.code_begin
        if (this.option_vertical_border) {
          this.code += '{|' + ('c|').repeat(this.attrs.length) + '}' + this.code_hline.slice(2)
        } else {
          this.code += '{' + ('c').repeat(this.attrs.length) + '}' + this.code_hline.slice(2)
        }
        if (this.option_bold_head) {
          this.code += '\\textbf{' + this.attrs.join('}&\\textbf{') + '}' + this.code_hline
        } else {
          this.code += '\\text{' + this.attrs.join('}&\\text{') + '}' + this.code_hline
        }
        for (let row in this.tableData) {
          let line = '\\text{' + Object.values(this.withoutId(this.tableData[row])).join("}&\\text{") + '}'
          line += this.code_hline
          this.code  += line
        }
        this.code +=  this.code_end
      },
      copyToClipboard: function() {
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
        tableData: function() {
            this.jsonToCode();
        },
        option_bold_head: function() {
            this.jsonToCode();
        },
        option_vertical_border: function() {
            this.jsonToCode();
        },
        code : function() {
          this.copyToClipboard();
        }
  },
    mounted: function() {
        this.jsonToCode();
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
  text-align: center;
  color: #777;
  font-size: 16px;
  margin: 0 auto;
  /* margin-left: 28%;
  padding-right: -50%; */
  /* margin-top: 0; */
}
/* 
#options a-col {
  margin: 1em 20% 1em;
} */
/* #options .ant-input-number {
  color: #999;
  text-align: right !important ;
} */
/* #options .ant-input-number:hover {
  color: #40a9ff;
} */
#options .ant-switch:hover {
  background-color: #40a9ff;
}

.msg {
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
