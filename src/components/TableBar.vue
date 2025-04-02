<script setup lang="ts">
import { defineOptions, computed } from 'vue';
import TableHistory from '~/components/TableHistory.vue';

interface TableBarProps {
  mode: 'view' | 'edit',
}

defineOptions({ name: 'table-bar' });

defineEmits(['switch-mode']);

const tableModesLabels = {
  edit: 'View mode',
  view: 'Edit',
};

const props = defineProps<TableBarProps>();

const tableModeLabel = computed(() => tableModesLabels[props.mode]);
</script>

<template>
  <div class="table-bar">
    <span class="table-bar__mode">
      Curren mode: <strong>{{ props.mode }}</strong>
    </span>
    <TableHistory
      v-if="props.mode === 'edit'"
      :next-disabled="true"
      :previous-disabled="true"
    />
    <button
      class="table-bar__switch"
      @click="$emit('switch-mode')"
    >
      {{ tableModeLabel }}
    </button>
  </div>
</template>

<style scoped>
.table-bar {
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 10px 0;
}

.table-bar__switch {
  margin-left: auto;
}
</style>