# regular-redux2

### 功能
就像react-redux对react组件做得那样，regular-redux2让regular组件可以向redux发送事件，监听redux的数据更新，获取redux中的数据并完成组件的更新。

#


### 特点
1.易用，如果你会用react-redux和react，那么你就会用regular-redux2和regular，并且更简单。

2.高效，你无需过多的担心组件更新的效率问题。

3.轻量，不足100行的源代码，让你轻松掌握实现原理。

#

### 安装

目前只支持npm： npm install --save regular-redux2

#

### 4步创建一个简单实例

文件结构

----components

----containers
  
--------index.js
  
----actions
  
--------index.js

----reducers

--------module1.js

--------index.js

----store.js

----connect.js


#### 第1步 创建actions模块 ./actions/index.js

```js

export const say = words => dispatch => {
   dispatch({
    type: 'SAY',
    data: words
   })
}

```

#### 第2步 创建reducers模块 ./reducers/index.js和module1.js

```js
// module1.js

export default (state, action) => {
  state = state || {};
  switch (action.type) {
    case 'SAY':
      return {
        ...state,
        words: action.data
      }
  }
}

```

```js
// index.js
import {combineReducers} from 'redux';
import module1 from './module1';
export default combineReducers({
  module1

})  

```

#### 第3步 创建store模块 ./store.js

```js
import {createStore, applyMiddleware} from 'redux';
import reducers from './reducers'

// 各种中间件
const middlewares = [];

export default createStore(
  (state = {}, action) => {
      return reducers(state, action);
  }, applyMiddleware(...middlewares)
);


```
#### 第4步 创建一个container ./containers/index.js

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
})).$inject(document.body)

```
最终页面会显示hello。

#### 可选步骤

由于regular没有像react那样有context，所以store无法通过封装provider来传入，需要通过connect的第3个参数或者作为container组件属性传入。

```js
<Container store={store} />或者connect(mapStateToData, mapDispatchToData, {store})(Component)

```
你也可以封装一个通用的connect模块./connect.js来避免反复的引入store和actions

```js
import store from './store';
import actions from './actions';
import { bindActionCreators } from 'redux';
import {connect} from 'regular-redux2';

export default (
    mapStateToData,
    mapDispatchToData,
    extra) => connect(
    state => ({
        ...mapStateToData(state)
    }), dispatch => ({
        ...mapDispatchToData(dispatch)),
        actions: bindActionCreators(actions, dispatch)
    }), {store, ...extra})

```
利用封装后的connect方法，例子中的步骤4可以简化为
```js
import Regular from 'regularjs';
import connect from '../connect';
export default connect(
  state => ({words: state.module1.words})
)(Regular.extend({
  name: 'AppContainer',
  template: `<div>{words}</div>`
  config () {
    this.data.actions.say('hello');
  }
})).$inject(document.body)
```


#

### 内部原理

regular-redux2的核心方法就是connect，它的作用就是链接redux和regular组件。使regular组件可以向redux发送事件，监听redux的数据变化，并将redux数据映射到regular组件内部data里，从而完成组件更新。connect的工作原理为：

以connect(mapStateToData, mapDispatchToData, {store})(SupComponent)为例：

1.connect会继承SupComponent，并返回一个name值与SupComponent相同的SubComponent。

2.SubComponent会重载config函数，1.注册一个redux监听器，监听redux数据变化；2.执行mapDispatchToData函数，将返回的对象合并到SubComponent的data里。一般返回的对象为{actions: bindActionCreators(actions, dispatch)}，这样就可以通过this.data.actions.xxxEvent的形式向redux发送事件。

3.当redux有数据更新时，SubComponent的监听器开始工作，监听器会执行mapStateToData方法得到从redux映射来的数据，然后与自身data数据进行比较，只有在不完全相同的情况下才执行组件$update操作。

4.当SubComponent被销毁时，移除redux监听器。



