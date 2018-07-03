# regular-redux2

### 功能
就像react-redux对react组件做得那样，regular-redux2让regular组件可以向redux发送事件，监听redux的数据更新，获取redux中的数据并完成组件的更新。

#


### 特点
1.简单，如果你会用react-redux和react，那么你就会用regular-redux2和regular，并且更简单。

2.高效，你无需过多的担心组件更新的效率问题。

3.轻量，不足100行的源代码，让你轻松掌握实现原理。

#

### 安装

目前只支持npm： npm install --save regular-redux2

#

### 2步创建一个简单实例

文件结构

----components

----containers

----actions

----reducers

----store.js

#### 第1步 创建store模块 ./store.js

```js
import {createStore, applyMiddleware} from 'redux';
import reducers from '../reducers'

// 各种中间件
const middlewares = [];

export default createStore(
  (state = {}, action) => {
      return reducers(state, action);
  }, applyMiddleware(...middlewares)
);


```
#### 第2步 创建一个container ./containers/index.js

```js
import store from '../store';
import { bindActionCreators } from 'redux';
import actions from '../actions';
import {connect} from 'regular-redux2';
import Regular from 'regularjs';

export default connect(
  state => ({words: state.module1.words}),
  dispatcher => ({actions: bindActionCreators(actions, dispatch)),
  {store}
)(Regular.extend({
  name: 'AppContainer',
  template: `<div>{words}</div>`
  config () {
    this.data.actions.say('hello');
  }
}))

```


#

### 内部原理



