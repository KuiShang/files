<template>
  <transition name="dialog-fade">
    <div class="el-dialog__wrapper" v-if="visible" @click.self="handleWrapperClick">
      <div
        class="el-dialog"
        :class="[{ 'is-fullscreen': fullscreen, 'el-dialog--center': center }, customClass]"
        ref="dialog"
        :style="style">

<slot></slot>
        <!-- <div class="el-dialog__header">
          <slot name="title">
            <span class="el-dialog__title">{{ title }}</span>
          </slot>
          <button
            type="button"
            class="el-dialog__headerbtn"
            aria-label="Close"
            v-if="showClose"
            @click="handleClose">
            x
          </button>
        </div>
        <div class="el-dialog__body" v-if="rendered"><slot></slot></div>
        <div class="el-dialog__footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div> -->



      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "KDialog",

  props: {
    title: {
      type: String,
      default: ""
    },

    visible: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Boolean,
      default: true
    },

    modalAppendToBody: {
      type: Boolean,
      default: true
    },

    appendToBody: {
      type: Boolean,
      default: false
    },

    lockScroll: {
      type: Boolean,
      default: true
    },

    closeOnClickModal: {
      type: Boolean,
      default: true
    },

    closeOnPressEscape: {
      type: Boolean,
      default: true
    },

    showClose: {
      type: Boolean,
      default: true
    },

    width: String,

    fullscreen: Boolean,

    customClass: {
      type: String,
      default: ""
    },

    top: {
      type: String,
      default: "15vh"
    },
    beforeClose: Function,
    center: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      rendered: false,
      closed: false
    };
  },

  watch: {
    visible(val) {
      this.$emit("update:visible", val);
      console.log('dialog内部：', val)
      this.updatemodalDom()
      if (val) {
        this.closed = false;
        this.$emit("open");
        this.$nextTick(() => {
          this.$refs.dialog.scrollTop = 0;
        });
        if (this.appendToBody) {
          document.body.appendChild(this.$el);
        }
        // let modalDom = document.querySelector('.k-modal')
        // modalDom = document.createElement('div')
        // modalDom.setAttribute('class', 'k-modal') 
        // modalDom.style.zIndex=2009;
        // modalDom.style.position='fixed';
        // modalDom.style.left=0;
        // modalDom.style.top=0;
        // modalDom.style.width='100%';
        // modalDom.style.height='100%';
        // modalDom.style.background='#000';
        // modalDom.style.opacity='.5';
        // document.body.appendChild(modalDom);
      } else {
        if (!this.closed) this.$emit("close");
        // document.body.removeChild(document.querySelector('.k-modal'))
      }
    }
  },

  computed: {
    style() {
      let style = {};
      if (this.width) {
        style.width = this.width;
      }
      if (!this.fullscreen) {
        style.marginTop = this.top;
      }
      return style;
    }
  },

  methods: {
    handleWrapperClick() {
      if (!this.closeOnClickModal) return;
      this.handleClose();
    },
    handleClose() {
      if (typeof this.beforeClose === "function") {
        this.beforeClose(this.hide);
      } else {
        this.hide();
      }
    },
    hide(cancel) {
      if (cancel !== false) {
        this.$emit("update:visible", false);
        this.$emit("close");
        this.closed = true;
      }
    },
    updatemodalDom() {
      let modalDom = document.querySelector('.k-modal')
      if (modalDom) {
          document.body.removeChild(document.querySelector('.k-modal'))
      } else {
        modalDom = document.createElement('div')
        modalDom.setAttribute('class', 'k-modal') 
        modalDom.style.zIndex=2009;
        modalDom.style.position='fixed';
        modalDom.style.left=0;
        modalDom.style.top=0;
        modalDom.style.width='100%';
        modalDom.style.height='100%';
        modalDom.style.background='#000';
        modalDom.style.opacity='.5';
        document.body.appendChild(modalDom);
      }
      


    }
  },

  mounted() {
    if (this.visible) {
      this.rendered = true;
      // this.open();
      if (this.appendToBody) {
        document.body.appendChild(this.$el);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "style/dialog.scss";
</style>
