<template>
<div class="modal_window__wrapper">
  <div class="modal_window">
    <slot></slot>
  </div>
</div>
</template>

<script>
export default {
  name: 'modal-window',
};
</script>

<style>
.modal_window__wrapper {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: rgba(0, 16, 33, 0.4);
}
.modal_window {
  width: 444px;
  box-sizing: border-box;
  box-shadow: 0 1px 16px 0 rgba(0, 44, 92, 0.28);
  border-radius: 8px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 32px 62px;
  margin: 24px;
  align-self: center;
}
@media (max-width: 800px) {
  .modal_window__wrapper {
    background: rgba(0, 16, 33, 0.8);
    justify-content: flex-end;
  }
  .modal_window {
    width: 100%;
  }
}
</style>
