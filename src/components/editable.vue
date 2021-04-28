<template>
  <div id="editable">
    <p>
      <a-button type="secondary" icon="plus" @click="newRecord">Add row</a-button>
      <a-button type="secondary" @click="newColumn">Add column</a-button>
    </p>
    <vue-excel-editor ref="grid" v-model="table_data" no-footer no-header-edit>
      <vue-excel-column v-for="attr in attrs" v-bind:key="attr" :field="attr" type="string" />
    </vue-excel-editor>
    <br />
    <!-- <span v-for="index in jsondata" v-bind:key="index">
      {{index}}&nbsp;
      <br />
    </span>-->
  </div>
</template>

<script>
import Vue from 'vue/dist/vue.js';
export default {
    name: 'editable',
    data() {
        return {
          table_data: [
            {user: 'hc', name: 'Harry Cole',    phone: '1-415-2345678', gender: 'M', age: 25, birth: '1997-07-01'},
            {user: 'sm', name: 'Simon Minolta', phone: '1-123-7675682', gender: 'M', age: 20, birth: '1999-11-12'},
            {user: 'ra', name: 'Raymond Atom',  phone: '1-456-9981212', gender: 'M', age: 19, birth: '2000-06-11'},
            {user: 'ag', name: 'Mary George',   phone: '1-556-1245684', gender: 'F', age: 22, birth: '2002-08-01'},
            {user: 'kl', name: 'Kenny Linus',   phone: '1-891-2345685', gender: 'M', age: 29, birth: '1990-09-01'}
        ],
        attrs: ['age', 'birth','user', 'name', 'phone', 'gender']
        }
    }, 
    methods: {
    newRecord () {
        let rec = Object.assign(this.jsondata[this.jsondata.length - 1])
        Vue.set(this.jsondata, this.jsondata.splice())
          console.log(rec)
        this.$refs.grid.newRecord()
    },
    newColumn() {
      this.attrs = Object.keys(this.jsondata[0]).filter(v => v !== '$id')
      console.log(typeof(this.attrs))
      let new_col_name = 'Col' + this.attrs.length
      function add_new_attr(item) {
        item[new_col_name] = "";
        return item;
      }
      this.jsondata.map(add_new_attr)
      this.attrs = Object.keys(this.jsondata[0]).filter(v => v !== '$id')
      console.log(this.attrs)
      // this.$forceUpdate()
    }
  }
}
</script>