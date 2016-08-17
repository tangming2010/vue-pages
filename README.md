# pages

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).





 this.$http.get("static/page.json").then((res) => {
      this.cur = res.data.pageNo;
      this.jumpNo = res.data.pageNo;
      var totalRecord = res.data.totalRecord;
      var pageSize = res.data.pageSize;
      this.all  = (totalRecord % pageSize) == 0 ? parseInt(totalRecord / pageSize) : parseInt(totalRecord / pageSize) +1 ;
    }, (res) => {
      console.error(res);
    });