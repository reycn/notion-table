<template>
  <div id="app">
    <div class="head">
      <img
        src="https://cdn.jsdelivr.net/gh/reycn/notion-table/dist/logo.png"
        class="head-icon"
      />
      <span class="head-text">Table Generator</span>

      <a href="https://github.com/reycn/notion-table" target="_blank"
        ><img class="head-text-left github" src="./assets/github.png"
      /></a>
      <!-- <span class="head-text-left current">En</span>
      <span class="head-text-left">|</span>
      <span class="head-text-left">中</span> -->
    </div>
    <div class="content-block">
      <div class="content-left fisrt">
        <div class="step-number">1</div>
        <div class="step-description">
          <div class="step-desciption-title">Edit, then copy</div>
          <div class="step-desciption-more">
            The result will automatically copied to your clipboard
          </div>
        </div>
      </div>
      <div class="content-right">
        <div class="options-btns">
          <button class="button-primary" @click="copy_to_clipboard">
            {{ msg_content }}
          </button>

          <div class="button-group">
            <button class="button-secondary" @click="add_row">
              Row<img src="./assets/add.png" class="button-icon" />
            </button>
            <button class="button-secondary button-append" @click="del_row">
              <img src="./assets/minus.png" class="button-icon" />
            </button>
          </div>

          <div class="button-group">
            <button class="button-secondary" @click="add_col">
              Col<img src="./assets/add.png" class="button-icon" />
            </button>
            <button class="button-secondary button-append" @click="del_col">
              <img src="./assets/minus.png" class="button-icon" />
            </button>
          </div>
          <div class="button-group">
            <button
              class="button-secondary"
              :class="option_italic_head ? 'enabled' : 'disabled'"
              @click="switch_italic"
            >
              I
            </button>
            <button
              class="button-secondary button-append"
              :class="option_bold_head ? 'enabled' : 'disabled'"
              @click="switch_bold"
            >
              B
            </button>
            <button
              class="button-secondary button-append"
              :class="option_vertical_border ? 'enabled' : 'disabled'"
              @click="switch_border"
            >
              V
            </button>
          </div>
        </div>
        <div id="editable">
          <transition name="slide-fade">
            <vue-excel-editor
              ref="grid"
              v-model="table_data"
              no-footer
              no-header-edit
            >
              <vue-excel-column
                v-for="attr in attrs"
                v-bind:key="attr"
                :field="attr"
                type="string"
              />
            </vue-excel-editor>
          </transition>
        </div>
      </div>
    </div>
    <div class="clear"></div>
    <div class="content-block">
      <div class="content-left second">
        <div class="step-number">2</div>
        <div class="step-description">
          <div class="step-desciption-title">Paste in Notion</div>
          <div class="step-desciption-more">
            Paste as an equation.<br /><a
              href="https://www.notion.so/reycn/Notion-Table-Generator-c659abf41dfc4af7a69e5ae435b30d0c"
              target="_blank"
              >See examples >></a
            >
          </div>
        </div>
      </div>

      <a
        href="https://notion.so"
        class="content-inner-block-a"
        target="_blank"
        alt="Notion.so"
      >
        <div class="content-inner-block">
          <div class="preview-img">
            <img
              src="https://cdn.jsdelivr.net/gh/reycn/notion-table/src/assets/preview-head.png"
            />
          </div>
          <div class="tutorial">
            Type <span class="code">/eq</span> to insert an equation
          </div>
          <katex-element class="preview-katex" :expression="code" />
        </div>
      </a>
    </div>
    <!-- <div>{{timer_value}}</div> -->
    <div class="clear"></div>
    <info />
  </div>
</template>

<script>
// import Vue from 'vue/dist/vue.js';
import info from "./components/info.vue";

export default {
  name: "App",
  components: {
    info,
  },
  data() {
    return {
      table_data: [
        {
          user: "Alice",
          name: "HarryCole",
          phone: "1415",
          gender: "M",
        },
        {
          user: "Bob",
          name: "SimonMinolta",
          phone: "1123",
          gender: "M",
        },
        {
          user: "Caro",
          name: "RaymondAtom",
          phone: "1456",
          gender: "M",
        },
      ],
      attrs: ["user", "name", "phone", "gender"],
      option_italic_head: false,
      option_bold_head: false,
      option_vertical_border: false,
      msg_show: false,
      msg_feature_show: true,
      refresh: false,
      msg_content: "Copy",
      preview_output: "Nothing to show",
      code: "",
      code_display: "",
      code_begin: "\\begin{array}",
      code_hline: "\\\\\\hline\n    ",
      code_end: "\\end{array}",
      contins_listen: false,
      timer: "",
      timer_value: 0,
    };
  },
  methods: {
    add_row() {
      let new_row = {
        ...this.table_data[this.table_data.length - 1],
      };
      this.table_data.push(new_row);
      this.refresh = false;
      setTimeout(() => {
        this.refresh = true;
      }, 1);
    },
    del_row() {
      this.table_data.splice(-1, 1);
      this.refresh = false;
      setTimeout(() => {
        this.refresh = true;
      }, 1);
    },
    add_col() {
      this.attrs = Object.keys(this.table_data[0]).filter((v) => v !== "$id");
      let col_name = "Col " + (this.attrs.length + 1);

      function add_attr(item) {
        item[col_name] = "";
        return item;
      }

      this.table_data = Object.assign(this.table_data.map(add_attr));
      this.attrs = Object.keys(this.table_data[0]).filter((v) => v !== "$id");
      // console.log(this.attrs)
      // this.json_to_code();
      this.refresh = false;
      setTimeout(() => {
        this.refresh = true;
      }, 1);
    },
    del_col() {
      this.attrs = Object.keys(this.table_data[0]).filter((v) => v !== "$id");
      let last_attr = this.attrs[this.attrs.length - 1];
      // console.log(this.attrs[this.attrs.length-1])
      function del_attr(item) {
        delete item[last_attr];
        return item;
      }
      // console.log( this.table_data.map(del_attr))
      // console.log( typeof(this.table_data.map(del_attr)))
      this.table_data = Object.assign(this.table_data.map(del_attr));
      this.attrs = Object.keys(this.table_data[0]).filter((v) => v !== "$id");
      // console.log(this.attrs)

      this.refresh = false;
      setTimeout(() => {
        this.refresh = true;
      }, 1);
    },

    switch_italic() {
      this.option_italic_head = !this.option_italic_head;
    },
    switch_bold() {
      this.option_bold_head = !this.option_bold_head;
    },
    switch_border() {
      this.option_vertical_border = !this.option_vertical_border;
    },
    clean_id: function (obj) {
      let tmp = Object.assign(obj);
      delete tmp.$id;
      // return JSON.stringify(tmp)
      return tmp;
    },
    json_to_code: function () {
      this.code = "";
      this.code += this.code_begin;
      if (this.option_vertical_border) {
        this.code +=
          "{|" +
          "c|".repeat(this.attrs.length) +
          "}" +
          this.code_hline.slice(2);
      } else {
        this.code +=
          "{" + "c".repeat(this.attrs.length) + "}" + this.code_hline.slice(2);
      }
      if (this.option_bold_head && this.option_italic_head) {
        this.code +=
          "\\bf{" + this.attrs.join("}&\\bf{") + "}" + this.code_hline;
      } else if (this.option_bold_head && !this.option_italic_head) {
        this.code +=
          "\\textbf{" + this.attrs.join("}&\\textbf{") + "}" + this.code_hline;
      } else if (!this.option_bold_head && !this.option_italic_head) {
        this.code +=
          "\\text{" + this.attrs.join("}&\\text{") + "}" + this.code_hline;
      } else {
        this.code += "{" + this.attrs.join("}&{") + "}" + this.code_hline;
      }
      for (let row in this.table_data) {
        let line =
          "\\text{" +
          Object.values(this.clean_id(this.table_data[row])).join("}&\\text{") +
          "}";
        line += this.code_hline;
        this.code += line;
      }
      this.code += this.code_end;
    },
    copy_to_clipboard: function () {
      try {
        navigator.clipboard.writeText(this.code);
        this.msg_content = "Copied!";
        this.msg_show = true;
        setTimeout(() => {
          this.msg_show = false;
          this.msg_content = "Copy";
        }, 500);
      } catch (err) {
        this.msg_copied = "Failed to copy: " + err;
        setTimeout(() => {
          this.msg_show = false;
        }, 1000);
        console.error("Failed to copy: ", err);
      }
    },
    continuous_listen: function () {
      // this.timer_value ++;
      this.contins_listen = this.table_data;
      this.table_data = {};
      this.table_data = this.contins_listen;
    },
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
    option_italic_head: function () {
      this.json_to_code();
    },
    code: function () {
      this.copy_to_clipboard();
      this.code_display = this.code.split("\n").join("<br/>");
    },
    refresh: function () {},
  },
  mounted: function () {
    this.json_to_code();
    this.refresh = true;
    setTimeout(() => {
      this.msg_feature_show = false;
    }, 5000);
    this.timer_value = setInterval(this.continuous_listen, 500);
  },
  beforeDestroy() {
    clearInterval(this.timer_value);
  },
};
</script>

<style>
@import "../node_modules/katex/dist/katex.min.css";

body {
  background: #f8f5f1;
  font-size: 16px;
  font-family: inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica,
    "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
  line-height: 1.5;
}

.head {
  padding: 0.5em 0.8em 2em 0.8em;
}

.content-block {
  margin-top: 4em;
  margin-bottom: 2em;
  margin-left: 20%;
  margin-right: 0%;
}

.content-left {
  float: left;
  /* max-width: 50%; */
  margin-right: 2em;
}

.content-right {
  float: left;
  /* max-width: 0%; */
  margin-right: 2em;
}

.step-number {
  float: left;
  margin-left: 0;
  margin-right: 0.1em;
  margin-top: 0;
  font-family: Arial;
  font-size: 6.4em;
  margin-top: -0.3em;
}

.step-description {
  float: left;
  margin: 0 0 1.8em 0;
  width: 15em;
}

.step-desciption-title {
  float: left;
  font-size: 1.5em;
  font-weight: bold;
}

.step-desciption-more {
  float: left;
}

.step-desciption-more a {
  /* font-weight: bold; */
}

a {
  color: #999;
  text-decoration: underline #999;
  text-underline-offset: 0.2em;
}

a:hover {
  text-decoration: underline #e16259;
  color: #e16259;
}

.button-group {
  display: inline-block;
}

.head-icon {
  float: left;
  width: 2em;
}

.head-text {
  float: left;
  /* display: flex; */
  font-size: 1.1em;
  font-weight: bold;
  margin: 0.2em 0 0 0.3em;
}

.head-text-left {
  float: right;
  font-size: 0.8em;
  color: #bbb;
  margin: 0.6em 0em 0 0.4em;
}

.content-inner-block {
  float: left;
  width: 24em;
  height: 20em;
  background-color: #fff;
  /* position: absolute;
    margin: 0; */
  overflow: hidden;
  text-align: left;
  box-shadow: 0 1px 2px rgb(15 15 15 / 10%);

  -moz-user-select: none;
  /*火狐*/
  -webkit-user-select: none;
  /*webkit浏览器*/
  -ms-user-select: none;
  /*IE10*/
  -khtml-user-select: none;
  /*早期浏览器*/
  user-select: none;
  filter: saturate(0);
  transition: all 0.8s;
}

.content-inner-block:hover {
  filter: saturate(1);
}

.content-inner-block-a:hover {
  color: #999;
}

.preview-head {
  position: absolute;
  margin: -4em 0 0 0;
}

.preview-img img {
  width: 100%;
}

.tutorial {
  display: inline-block;
  margin: 1em 0 0 2em;
}

.tutorial .code {
  border: 1px;
  border-radius: 4px;
  color: #e16259;
  padding: 0.2em 0.5em 0.2em 0.5em;
  background-color: #eee;
  font-family: "Courier New", Courier, monospace;
  /* filter: saturate(1); */
}

.preview-katex {
  /* position: absolute; */
  display: inline-block;
  margin: 1em 0 0 0;
  transform: scale(0.8);
}

.github {
  margin: 0.7em 0em 0 1em;
}

.head .current {
  color: #000;
}

.options-btns {
  padding: 0 0 0.8em 0.2em;
}

#editable {
  float: left;
  padding: 0.2em 0 0.8em 0.2em;
}

button {
  border-radius: 2px;
  padding: 0.7em 1.5em 0.7em 1.5em;
  /* width: 5.6em; */
  height: 2.8em;
  -webkit-appearance: button;
  cursor: pointer;
  margin: 1em 1em 0 0em;
  font-weight: bold;

  -moz-user-select: none;
  /*火狐*/
  -webkit-user-select: none;
  /*webkit浏览器*/
  -ms-user-select: none;
  /*IE10*/
  -khtml-user-select: none;
  /*早期浏览器*/
  user-select: none;
}

.button-primary {
  color: #fff;
  box-shadow: 0 1px 2px rgb(15 15 15 / 10%);

  padding: 0.7em 0em 0.7em 0em;
  width: 7em;
  background-color: #e16259;
  border: 1px solid #be5643;
}

.button-primary:hover {
  background-color: #cf534a;
}

.button-primary:active {
  background-color: rgb(191, 77, 69);
}

.button-secondary {
  color: #eb5757;
  background: #fdf5f2;
  border: 0px;
  box-shadow: 0px 1px 2px rgb(15 15 15 / 10%),
    inset 0 0 0 1px rgb(235 87 87 / 30%);
}

.button-append {
  margin-left: -0.8em;
  padding: 0.7em 1.2em 0.7em 1em;
  /* box-shadow: 0px 1px 2px rgb(15 15 15 / 10%), inset 0 0 0 1px rgb(235 87 87 / 30%); */
}

.button-secondary:hover {
  background-color: #fbebe8;
}

.button-secondary:active {
  background-color: rgb(249, 229, 226);
}

.button-group .disabled {
  background-color: #f9f9f9;
  color: lightgray;
  box-shadow: 0px 1px 2px rgb(15 15 15 / 10%), inset 0 0 0 1px lightgray;
}

.button-icon {
  width: 0.8em;
  padding-left: 0.3em;
  padding-top: 0em;
}

.systable thead th,
.systable .first-col {
  background-color: #f9f9f9 !important;
}

.systable tbody td.first-col.focus {
}

.clear {
  clear: both;
}

.component-content {
  /* border: 1px solid rgb(235 87 87 / 30%)  !important; */
  border-radius: 2px;
  box-shadow: 0 1px 2px rgb(15 15 15 / 10%);
}

@media screen and (max-width: 960px) {
  body {
    font-size: 16px;
    /* line-height:2em; */
  }

  .head {
    width: 100%;
    margin: 0.8em -4em 2em 1em;
    /* padding: -0.5em -4em 0.5em 1em; */
  }

  .head .github {
    margin-right: -1.8em;
  }

  .content-block {
    margin-left: 0.5em;
    margin-top: 1em;
  }

  .content-left {
    transform: scale(0.8);
    margin-left: -0.6em;
    margin-top: 0em;
    margin-bottom: -2.3em;
  }

  .content-right {
    transform: scale(0.9);
  }

  .content-inner-block {
    transform: scale(0.9);
  }

  .options-btns {
    max-width: 90%;
    margin-left: -1.2em;
    transform: scale(0.9);
  }

  #editable {
    margin-left: -1.4em;
    transform: scale(0.9);
  }

  .info p {
    line-height: 1.5em;
  }
}
</style>