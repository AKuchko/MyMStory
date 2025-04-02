<script setup lang="ts">
import { defineOptions } from 'vue';

interface TableHitoryProps {
  previousDisabled: boolean,
  nextDisabled: boolean,
}

defineOptions({ name: 'table-history' });

defineEmits(['prev', 'next']);

const props = defineProps<TableHitoryProps>();
</script>

<template>
  <div class="table-history">
    <button
      :disabled="props.previousDisabled"
      @click="$emit('prev')"
    >
      Prev
    </button>
    <button
      :disabled="props.nextDisabled"
      @click="$emit('next')"
    >
      Next
    </button>
  </div>
</template>

<style>
.table-history {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
