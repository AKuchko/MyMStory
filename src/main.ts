import { createApp } from 'vue'
import {
  ModuleRegistry,
  ClientSideRowModelModule,
  ValidationModule,
  ColumnAutoSizeModule,
} from 'ag-grid-community';
import { TreeDataModule } from 'ag-grid-enterprise';
import './style.css'
import App from './App.vue'

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnAutoSizeModule,
  ValidationModule,
  TreeDataModule,
]);

createApp(App).mount('#app')
