export interface TreeNode {
  id: string | number,
  parent: string | number | null,
  [key: string]: unknown,
}

export default class TreeStore {
  items: TreeNode[] = [];

  private itemsMap: Map<string | number, TreeNode> = new Map();

  private childrensMap: Map<string | number, TreeNode[]> = new Map();

  constructor(items: TreeNode[]) {
    if (!items || !Array.isArray(items)) return;

    this.items = [...items];
    this.fillMaps();
  }

  fillMaps(): void {
    this.itemsMap.clear();
    this.childrensMap.clear();

    this.items.forEach(item => {
      this.itemsMap.set(item.id, item);

      if (!item.parent) return;

      if (!this.childrensMap.has(item.parent)) {
        this.childrensMap.set(item.parent, []);
      }
      
      this.childrensMap.get(item.parent)?.push(item);
    });
  }

  getAll(): TreeNode[] {
    return this.items;
  }

  getItem(id: string | number): TreeNode | null {
    return this.itemsMap.get(id) || null;
  }

  getChildren(id: string | number): TreeNode[] {
    return this.childrensMap.get(id) || [];
  }

  getAllChildren(id: string | number): TreeNode[] {
    return this.getChildren(id)
      .flatMap(item => [item, ...this.getAllChildren(item.id)]);
  }

  getAllParents(id: string | number): TreeNode[] {
    const node = this.itemsMap.get(id);
    if (!node) return [];
    if (!node.parent) return [node];
    return [node, ...this.getAllParents(node.parent)];
  }

  addItem(item: TreeNode): void {
    if (this.itemsMap.has(item.id)) {
      console.error(`[addItem] Tree node with id ${item.id} alredy exists`);
      return;
    }
    if (!item) return;
    this.items.push(item);
    this.itemsMap.set(item.id, item);
    this.childrensMap.get(item.parent || '')?.push(item);
  }

  removeItem(id: string | number): void {
    const node = this.itemsMap.get(id);
    if (!node) return;
    this.getChildren(id).forEach(item => this.removeItem(item.id));
    this.itemsMap.delete(id);

    if (node.parent && this.childrensMap.has(node.parent)) {
      const newChildrens = this.childrensMap.get(node.parent)!.filter(item => item.id !== id);
      this.childrensMap.set(node.parent, newChildrens);
    }

    this.items = this.items.filter(item => item.id !== id);
  }

  updateItem(item: TreeNode): void {
    if (!this.itemsMap.has(item.id)) {
      console.error(`[updateItem] Tree node with id ${item.id} not found`);
      return;
    }

    if (item.parent && !this.itemsMap.has(item.parent)) {
      console.error(`[updateItem] parent with id ${item.parent} was not found`);
      return;
    }

    this.items[this.items.findIndex(_item => _item.id === item.id)] = item;
    this.fillMaps();
  }
}
