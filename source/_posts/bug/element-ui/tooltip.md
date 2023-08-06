---
title: Element-ui 之 Tooltip 无法展示
categories:
  - Bug
tags:
  - Vue
  - element-ui
  - Tooltip
---

使用 [Vite](https://cn.vitejs.dev/) 搭建了一个 基于 [Element-ui](https://element.eleme.cn/#/zh-CN) 的组件库。 开发过程中遇到一个 Tooltip 组件无法展示的问题。

<!-- more -->

## 场景

代码环境：  


启动页面 `index.html` ：  
```html
<!DOCTYPE html>
<html>
  <head>
    <title>测试</title>
    <meta charset="UTF-8" />
  </head>
  <body>
    <div id="app">
      <el-tooltip
        class="item"
        effect="dark"
        content="Top Center 提示文字"
        placement="top"
      >
        <el-button>上边</el-button>
      </el-tooltip>
    </div>
  </body>
  <script type="module" src="./index.tsx"></script>
</html>
```
`index.tsx`：  
```javascript
import vue from "vue/dist/vue.esm";

new vue({}).$mount("#app");
```
版本：  
```json
{
  "element-ui": "^2.15.13",
  "vue": "^2.7.14"
}
```


## Bug 原因

刚开始使用 ` import vue from "vue" ` 引入了 vue 依赖，但是运行提示了 ` You are using the runtime-only build of Vue where the template compiler is not available. ` 可知它导入的是 runtime 版本的 vue，但是这里需要全量版本的 vue。  

然后我又改用 ` import vue from "vue/dist/vue.esm" ` 引入 vue 依赖，这时候项目能运行起来了，正在我以为万事大吉的时候，一个奇怪的 bug 正在等着我去发现。。。  

果不其然，开发过程中我发现了 Tooltip 组件没有展示的问题。   

我首先使用调试工具进入 Tooltip 组件的代码内部定位问题，发现在 ` element-ui/src/utils/vue-popper ` 文件中，获取 ` this.$refs.popper ` 变量的值为 `undefined`，这导致了 tooltip 的文本提示没有挂载到 html 中，所以 Tooptip 就无法展示了。

我先是检查 `element-ui` 和 `vue` 是否有版本冲突，无果。最终也没发现具体是什么原因导致 ` this.$refs.popper ` 这个变量取不到值的，猜测应该是 ` import vue from "vue/dist/vue.esm" ` 这种方式引入的 vue 有 bug，所以最后更换了 vue 的引入方式。

Tooltip 组件代码：  

` element-ui/packages/tooltip/src/main.js `
``` javascript
import Popper from 'element-ui/src/utils/vue-popper';
import debounce from 'throttle-debounce/debounce';
import { addClass, removeClass, on, off } from 'element-ui/src/utils/dom';
import { generateId } from 'element-ui/src/utils/util';
import Vue from 'vue';

export default {
  name: 'ElTooltip',

  mixins: [Popper], // 通过 mixins 混合了 ` element-ui/src/utils/vue-popper ` 文件中的东西

  props: {
    openDelay: {
      type: Number,
      default: 0
    },
    disabled: Boolean,
    manual: Boolean,
    effect: {
      type: String,
      default: 'dark'
    },
    arrowOffset: {
      type: Number,
      default: 0
    },
    popperClass: String,
    content: String,
    visibleArrow: {
      default: true
    },
    transition: {
      type: String,
      default: 'el-fade-in-linear'
    },
    popperOptions: {
      default() {
        return {
          boundariesPadding: 10,
          gpuAcceleration: false
        };
      }
    },
    enterable: {
      type: Boolean,
      default: true
    },
    hideAfter: {
      type: Number,
      default: 0
    },
    tabindex: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      tooltipId: `el-tooltip-${generateId()}`,
      timeoutPending: null,
      focusing: false
    };
  },
  beforeCreate() {
    if (this.$isServer) return;

    this.popperVM = new Vue({
      data: { node: '' },
      render(h) {
        return this.node;
      }
    }).$mount(); // 初始化 this.popperVM ( vue实例 ), 没有挂载到任何地方。 

    this.debounceClose = debounce(200, () => this.handleClosePopper());
  },

  render(h) {
    if (this.popperVM) {
      this.popperVM.node = (
        <transition
          name={ this.transition }
          onAfterLeave={ this.doDestroy }>
          <div
            onMouseleave={ () => { this.setExpectedState(false); this.debounceClose(); } }
            onMouseenter= { () => { this.setExpectedState(true); } }
            ref="popper"
            role="tooltip"
            id={this.tooltipId}
            aria-hidden={ (this.disabled || !this.showPopper) ? 'true' : 'false' }
            v-show={!this.disabled && this.showPopper} // 提示文字展示， 需要 {!this.disabled && this.showPopper} 条件为真
            class={
              ['el-tooltip__popper', 'is-' + this.effect, this.popperClass]
            }>
            { this.$slots.content || this.content }
          </div>
        </transition>);
    } // 这里就是 tooltip 组件的模板

    const firstElement = this.getFirstElement();
    if (!firstElement) return null;

    const data = firstElement.data = firstElement.data || {};
    data.staticClass = this.addTooltipClass(data.staticClass);

    return firstElement;
  },

  mounted() {
    this.referenceElm = this.$el;
    if (this.$el.nodeType === 1) {
      this.$el.setAttribute('aria-describedby', this.tooltipId);
      this.$el.setAttribute('tabindex', this.tabindex);
      on(this.referenceElm, 'mouseenter', this.show); // 绑定 mouseenter 事件，正常逻辑 mouseenter 触发会让 tooltip 的提示文字展示
      on(this.referenceElm, 'mouseleave', this.hide); // 绑定 mouseleave 事件，正常逻辑 mouseleave 触发会让 tooltip 的提示文字隐藏
      on(this.referenceElm, 'focus', () => {
        if (!this.$slots.default || !this.$slots.default.length) {
          this.handleFocus();
          return;
        }
        const instance = this.$slots.default[0].componentInstance;
        if (instance && instance.focus) {
          instance.focus();
        } else {
          this.handleFocus();
        }
      });
      on(this.referenceElm, 'blur', this.handleBlur);
      on(this.referenceElm, 'click', this.removeFocusing);
    }
    // fix issue https://github.com/ElemeFE/element/issues/14424
    if (this.value && this.popperVM) {   // this.value 是是否展示文本提示的意思，this.showPopper 会同步这个值, 代码可见 ` element-ui/src/utils/vue-popper ` 文件
      this.popperVM.$nextTick(() => {
        if (this.value) {
          this.updatePopper();
        }
      });
    }
  },
  watch: {
    focusing(val) {
      if (val) {
        addClass(this.referenceElm, 'focusing');
      } else {
        removeClass(this.referenceElm, 'focusing');
      }
    }
  },
  methods: {
    show() {
      this.setExpectedState(true);
      this.handleShowPopper();
    },

    hide() {
      this.setExpectedState(false);
      this.debounceClose();
    },
    handleFocus() {
      this.focusing = true;
      this.show();
    },
    handleBlur() {
      this.focusing = false;
      this.hide();
    },
    removeFocusing() {
      this.focusing = false;
    },

    addTooltipClass(prev) {
      if (!prev) {
        return 'el-tooltip';
      } else {
        return 'el-tooltip ' + prev.replace('el-tooltip', '');
      }
    },

    handleShowPopper() {
      if (!this.expectedState || this.manual) return;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        // mouseenter 触发时，就这一段有效的代码，但是这时候 tooltip 还没挂载到 dom 上， 所以这个变量没有太大意义， 其他地方应该还有关键代码
        this.showPopper = true;
      }, this.openDelay);

      if (this.hideAfter > 0) {
        this.timeoutPending = setTimeout(() => {
          this.showPopper = false;
        }, this.hideAfter);
      }
    },

    handleClosePopper() {
      if (this.enterable && this.expectedState || this.manual) return;
      clearTimeout(this.timeout);

      if (this.timeoutPending) {
        clearTimeout(this.timeoutPending);
      }
      this.showPopper = false;

      if (this.disabled) {
        this.doDestroy();
      }
    },

    setExpectedState(expectedState) {
      if (expectedState === false) {
        clearTimeout(this.timeoutPending);
      }
      this.expectedState = expectedState;
    },

    getFirstElement() {
      const slots = this.$slots.default;
      if (!Array.isArray(slots)) return null;
      let element = null;
      for (let index = 0; index < slots.length; index++) {
        if (slots[index] && slots[index].tag) {
          element = slots[index];
          break;
        };
      }
      return element;
    }
  },

  beforeDestroy() {
    this.popperVM && this.popperVM.$destroy();
  },

  destroyed() {
    const reference = this.referenceElm;
    if (reference.nodeType === 1) {
      off(reference, 'mouseenter', this.show);
      off(reference, 'mouseleave', this.hide);
      off(reference, 'focus', this.handleFocus);
      off(reference, 'blur', this.handleBlur);
      off(reference, 'click', this.removeFocusing);
    }
  }
};
```

` element-ui/src/utils/vue-popper.js `
```javascript
import Vue from 'vue';
import {
  PopupManager
} from 'element-ui/src/utils/popup';

const PopperJS = Vue.prototype.$isServer ? function() {} : require('./popper');
const stop = e => e.stopPropagation();

/**
 * @param {HTMLElement} [reference=$refs.reference] - The reference element used to position the popper.
 * @param {HTMLElement} [popper=$refs.popper] - The HTML element used as popper, or a configuration used to generate the popper.
 * @param {String} [placement=button] - Placement of the popper accepted values: top(-start, -end), right(-start, -end), bottom(-start, -end), left(-start, -end)
 * @param {Number} [offset=0] - Amount of pixels the popper will be shifted (can be negative).
 * @param {Boolean} [visible=false] Visibility of the popup element.
 * @param {Boolean} [visible-arrow=false] Visibility of the arrow, no style.
 */
export default {
  props: {
    transformOrigin: {
      type: [Boolean, String],
      default: true
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    boundariesPadding: {
      type: Number,
      default: 5
    },
    reference: {},
    popper: {},
    offset: {
      default: 0
    },
    value: Boolean,
    visibleArrow: Boolean,
    arrowOffset: {
      type: Number,
      default: 35
    },
    appendToBody: {
      type: Boolean,
      default: true
    },
    popperOptions: {
      type: Object,
      default() {
        return {
          gpuAcceleration: false
        };
      }
    }
  },

  data() {
    return {
      showPopper: false,
      currentPlacement: ''
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.showPopper = val; // this.showPopper 同步 this.value
        this.$emit('input', val);
      }
    },

    showPopper(val) {
      if (this.disabled) return;
      // this.showPopper 为真会触发 this.updatePopper()，这里就是 tooltip 是否展示提示文字的关键代码了
      val ? this.updatePopper() : this.destroyPopper();
      this.$emit('input', val);
    }
  },

  methods: {
    // 把 tooltip 的提示文字 装载到 html 上
    createPopper() {
      if (this.$isServer) return;
      this.currentPlacement = this.currentPlacement || this.placement;
      if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(this.currentPlacement)) {
        return;
      }

      const options = this.popperOptions;
      const popper = this.popperElm = this.popperElm || this.popper || this.$refs.popper; // 获取 tooltip 的提示文本模板，这里获取不到
      let reference = this.referenceElm = this.referenceElm || this.reference || this.$refs.reference;

      if (!reference &&
        this.$slots.reference &&
        this.$slots.reference[0]) {
        reference = this.referenceElm = this.$slots.reference[0].elm;
      }

      if (!popper || !reference) return;
      if (this.visibleArrow) this.appendArrow(popper);
      if (this.appendToBody) document.body.appendChild(this.popperElm);
      if (this.popperJS && this.popperJS.destroy) {
        this.popperJS.destroy();
      }

      options.placement = this.currentPlacement;
      options.offset = this.offset;
      options.arrowOffset = this.arrowOffset;
      this.popperJS = new PopperJS(reference, popper, options);
      this.popperJS.onCreate(_ => {
        this.$emit('created', this);
        this.resetTransformOrigin();
        this.$nextTick(this.updatePopper);
      });
      if (typeof options.onUpdate === 'function') {
        this.popperJS.onUpdate(options.onUpdate);
      }
      this.popperJS._popper.style.zIndex = PopupManager.nextZIndex();
      this.popperElm.addEventListener('click', stop);
    },

    updatePopper() {
      const popperJS = this.popperJS;
      // 如果 popperJS 不存在，会触发 this.createPopper();
      if (popperJS) {
        popperJS.update();
        if (popperJS._popper) {
          popperJS._popper.style.zIndex = PopupManager.nextZIndex();
        }
      } else {
        this.createPopper();
      }
    },

    doDestroy(forceDestroy) {
      /* istanbul ignore if */
      if (!this.popperJS || (this.showPopper && !forceDestroy)) return;
      this.popperJS.destroy();
      this.popperJS = null;
    },

    destroyPopper() {
      if (this.popperJS) {
        this.resetTransformOrigin();
      }
    },

    resetTransformOrigin() {
      if (!this.transformOrigin) return;
      let placementMap = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left'
      };
      let placement = this.popperJS._popper.getAttribute('x-placement').split('-')[0];
      let origin = placementMap[placement];
      this.popperJS._popper.style.transformOrigin = typeof this.transformOrigin === 'string'
        ? this.transformOrigin
        : ['top', 'bottom'].indexOf(placement) > -1 ? `center ${ origin }` : `${ origin } center`;
    },

    appendArrow(element) {
      let hash;
      if (this.appended) {
        return;
      }

      this.appended = true;

      for (let item in element.attributes) {
        if (/^_v-/.test(element.attributes[item].name)) {
          hash = element.attributes[item].name;
          break;
        }
      }

      const arrow = document.createElement('div');

      if (hash) {
        arrow.setAttribute(hash, '');
      }
      arrow.setAttribute('x-arrow', '');
      arrow.className = 'popper__arrow';
      element.appendChild(arrow);
    }
  },

  beforeDestroy() {
    this.doDestroy(true);
    if (this.popperElm && this.popperElm.parentNode === document.body) {
      this.popperElm.removeEventListener('click', stop);
      document.body.removeChild(this.popperElm);
    }
  },

  // call destroy in keep-alive mode
  deactivated() {
    this.$options.beforeDestroy[0].call(this);
  }
};
```

## 解决办法

1.  使用 `import vue from "vue/dist/vue` 导入 Vue  
` index.tsx `  

    ```javascript
      import vue from "vue/dist/vue";

      new vue({
      })..$mount("#app");
    ```

2.  使用运行时版本的 Vue 并改写部分代码  
` index.html `  
  
    ```html
    <!DOCTYPE html>
    <html>
      <head>
        <title>测试</title>
        <meta charset="UTF-8" />
      </head>
      <body>
        <div id="app"></div>
      </body>
      <script type="module" src="./index.tsx"></script>
    </html>
    ```  
    ` index.tsx `  
    ```javascript
    import vue from "vue";

    new vue({
      el: "#app",
      render: (h) => {
        return 
          <el-tooltip
            class="item"
            effect="dark"
            content="Top Center 提示文字"
            placement="top"
          >
            <el-button>上边</el-button>
          </el-tooltip>
      },
    });
    ```

## 总结

平时还是要多记录多积累项目经验，这样才能提高快速解决问题的能力。  
能够快速解决问题，就可以少加班甚至不加班，让自己有更多可自由支配的时间。
加油！