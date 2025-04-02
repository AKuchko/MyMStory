<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';
import type { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import type { TreeNode } from '~/entities/TreeStore';
import TreeStore from '~/entities/TreeStore';

import RowActions from '~/components/RowActions.vue';
import TableBar from '~/components/TableBar.vue';

interface TableRow extends TreeNode {
  category: 'group' | 'element',
}

const items: TreeNode[] = [
  { id: 1, parent: null, label: 'Item 1' },
  { id: '2', parent: 1, label: 'Item 2' },
  { id: 3, parent: 1, label: 'Item 3' },
  { id: 4, parent: '2', label: 'Item 4' },
  { id: 5, parent: '2', label: 'Item 5' },
  { id: 6, parent: 3, label: 'Item 6' },
  { id: 7, parent: 4, label: 'Item 7' },
  { id: 8, parent: 4, label: 'Item 8' },
];

const gridApi = ref<GridApi | null>(null)

const defaultColDef = ref<ColDef>({
  flex: 1,
  minWidth: 100,
});

const autoGroupColumnDef = ref<ColDef>({
  headerName: "Category",
  field: "category",
  minWidth: 250,
  pivotIndex: 2,
});

const tableMode = ref<'edit' | 'view'>('view');

const store = ref<TreeStore | null>(null);

function getRowCategory(item: TreeNode): 'group' | 'element' {
  if (!store.value) return 'element';
  return store.value.getChildren(item.id).length > 0
    ? 'group'
    : 'element';    
}

function getDataPath(data: TreeNode): string[] {
  if (!store.value) return [];
  const parents = store.value.getAllParents(data.id);
  return parents.map(item => item.id.toString()).reverse();
}

function toggleTableMode() {
  tableMode.value = tableMode.value === 'edit'
    ? 'view'
    : 'edit';
}

const formattedList = computed((): TableRow[] => {
  if (!store.value) return [];
  return store.value.getAll().map(item => ({
    ...item,
    idValue: `${item.id}`,
    category: getRowCategory(item),
  }));
});

function removeNode(node: TreeNode): void {
  store.value?.removeItem(node.id);
}

function appendNode(node: TreeNode): void {
  if (!store.value) return;
  const newId = Math.max(...store.value.getAll().map(i => Number(i.id))) + 1;
  store.value?.addItem({
    id: newId,
    parent: node.id,
    label: `Item ${newId}`,
  });
}

const defs = computed((): ColDef[] => [
  { field: 'idValue', headerName: 'ID',  width: 100, pinned: true },
  ...(tableMode.value === 'edit'
    ? [{
      width: 120,
      cellRenderer: RowActions,
      cellRendererParams: {
        remove: removeNode,
        append: appendNode,
      },
    }]
    : []
  ),
  { field: 'label', headerName: 'Label',  width: 300 },
]);

function onGridReady(params: GridReadyEvent) {
  console.log('ObGridReady');
  gridApi.value = params.api;
  params.api.sizeColumnsToFit()
};

onMounted(() => {
  store.value = new TreeStore(items);
});
</script>

<template>
  <main class="main">
    <TableBar
      :mode="tableMode"
      @switch-mode="toggleTableMode"
    />
    <AgGridVue
      class="main__table"
      :row-data="formattedList"
      :tree-data="true"
      :column-defs="defs"
      :get-data-path="getDataPath"
      :group-default-expanded="-1"
      :default-col-def="defaultColDef"
      :auto-group-column-def="autoGroupColumnDef"
      @grid-ready="onGridReady"
    />
  </main>
</template>

<style scoped>
.main {
  width: 100%;
  height: 100%;
}

.main__table {
  width: 900px;
  height: 400px;
}

@media (max-width: 720px) {
  .main__table {
    width: 100%;
    height: 400px;
    overflow-x: auto;
  }
}
</style>
