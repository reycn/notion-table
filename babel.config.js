module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ["import", {
      "libraryName": "antd",
      "libraryDirectory": "es",
      "style": "css"
    }],

  ]

}