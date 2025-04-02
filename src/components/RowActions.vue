<script setup lang="ts">
import type { ICellRendererParams } from 'ag-grid-community';

const props = defineProps<{
  nodeId: string | number,
  isEditMode: boolean,
  params: ICellRendererParams 
}>();

function aciton(append = false) {
  const node = props.params.data;
  const actKey = append ? 'append' : 'remove';
  props.params.colDef?.cellRendererParams?.[actKey](node);
}
</script>

<template>
  <div class="row-actions">
    <button
      class="row-actions__action"
      @click="aciton(true)"
    >
      +
    </button>
    <button
      class="row-actions__action"
      @click="aciton()"
    >
      -
    </button>
  </div>
</template>

<style>
.row-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 100%;
}

.row-actions__action {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  width: 30px;
  height: 30px;
  padding: 5px;
  color: #fff;
}

@media (prefers-color-scheme: light) {
  .row-actions__action {
    color: #213547;
  }
}
</style>