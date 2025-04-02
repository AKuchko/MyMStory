import { describe, it, expect, beforeEach } from 'vitest';
import TreeStore from './index';

describe('TreeStore', () => {
  let treeStore: TreeStore;

  const testItems = [
    { id: 1, parent: null },
    { id: '2', parent: 1 },
    { id: 3, parent: 1 },
    { id: 4, parent: '2' },
    { id: 5, parent: '2' },
    { id: 6, parent: 3 },
    { id: 7, parent: 4 },
    { id: 8, parent: 4 },
  ];

  beforeEach(() => {
    treeStore = new TreeStore(testItems)
  });

  describe('getAll', () => {
    it('should return all items in initial order', () => {
      const result = treeStore.getAll()
      expect(result).toEqual(testItems)
      expect(result).not.toBe(testItems)
    })
  });

  describe('getItem', () => {
    it('should return item by id', () => {
      expect(treeStore.getItem(1)).toEqual({ id: 1, parent: null })
      expect(treeStore.getItem(4)).toEqual({ id: 4, parent: '2' })
    })

    it('should return null for non-existent id', () => {
      expect(treeStore.getItem(999)).toBeNull()
    })
  });

  describe('getChildren', () => {
    it('should return direct children', () => {
      expect(treeStore.getChildren(1)).toEqual([
        { id: '2', parent: 1 },
        { id: 3, parent: 1 },
      ])
      expect(treeStore.getChildren(4)).toEqual([
        { id: 7, parent: 4 },
        { id: 8, parent: 4 },
      ])
    });

    it('should return empty array for node without children', () => {
      expect(treeStore.getChildren(5)).toEqual([])
      expect(treeStore.getChildren(999)).toEqual([])
    });
  });

  describe('getAllChildren', () => {
    it('should return all descendants', () => {
      expect(treeStore.getAllChildren(1)).toEqual([
        { id: '2', parent: 1 },
        { id: 4, parent: '2' },
        { id: 7, parent: 4 },
        { id: 8, parent: 4 },
        { id: 5, parent: '2' },
        { id: 3, parent: 1 },
        { id: 6, parent: 3 },
      ]);
    });

    it('should return empty array for leaf node', () => {
      expect(treeStore.getAllChildren(5)).toEqual([])
    });

    it('should return empty array for non-existent id', () => {
      expect(treeStore.getAllChildren(999)).toEqual([])
    });
  });

  describe('getAllParents', () => {
    it('should return all parents up to root', () => {
      expect(treeStore.getAllParents(7)).toEqual([
        { id: 7, parent: 4 },
        { id: 4, parent: '2' },
        { id: '2', parent: 1 },
        { id: 1, parent: null },
      ]);
    });

    it('should return only self for root node', () => {
      expect(treeStore.getAllParents(1)).toEqual([{ id: 1, parent: null }])
    });

    it('should return empty array for non-existent id', () => {
      expect(treeStore.getAllParents(999)).toEqual([])
    });
  });

  describe('addItem', () => {
    it('should add new item to the tree', () => {
      const newItem = { id: 9, parent: 3 }
      treeStore.addItem(newItem)
      
      expect(treeStore.getItem(9)).toEqual(newItem)
      expect(treeStore.getChildren(3)).toContainEqual(newItem)
      expect(treeStore.getAll()).toContainEqual(newItem)
    });
  });

  describe('removeItem', () => {
    it('should remove item and its children', () => {
      treeStore.removeItem('2')
      
      expect(treeStore.getItem('2')).toBeNull()
      expect(treeStore.getItem(4)).toBeNull()
      expect(treeStore.getItem(5)).toBeNull()
      expect(treeStore.getItem(7)).toBeNull()
      expect(treeStore.getItem(8)).toBeNull()
      
      expect(treeStore.getChildren(1)).not.toContainEqual({ id: '2', parent: 1 })
    });

    it('should not affect other branches', () => {
      treeStore.removeItem(3)
      expect(treeStore.getItem(1)).toBeDefined()
      expect(treeStore.getItem('2')).toBeDefined()
    });

    it('should do nothing for non-existent id', () => {
      const before = treeStore.getAll()
      treeStore.removeItem(999)
      expect(treeStore.getAll()).toEqual(before)
    });
  });

  describe('updateItem', () => {
    it('should update existing item', () => {
      const updatedItem = { id: '2', parent: 1, name: 'Updated' }
      treeStore.updateItem(updatedItem)
      
      expect(treeStore.getItem('2')).toEqual(updatedItem)
      expect(treeStore.getChildren(1)).toContainEqual(updatedItem)
    });

    it('should update parent relationship', () => {
      const updatedItem = { id: '2', parent: 3 }
      treeStore.updateItem(updatedItem)
      
      expect(treeStore.getChildren(1)).not.toContainEqual(updatedItem)
      expect(treeStore.getChildren(3)).toContainEqual(updatedItem)
    });
  });

  describe('edge cases', () => {
    it('should handle empty tree', () => {
      const emptyTree = new TreeStore([])
      
      expect(emptyTree.getAll()).toEqual([])
      expect(emptyTree.getItem(1)).toBeNull()
      expect(emptyTree.getChildren(1)).toEqual([])
      expect(emptyTree.getAllChildren(1)).toEqual([])
      expect(emptyTree.getAllParents(1)).toEqual([])
    });

    it('should handle tree with only root', () => {
      const singleItemTree = new TreeStore([{ id: 1, parent: null }])
      
      expect(singleItemTree.getAllChildren(1)).toEqual([])
      expect(singleItemTree.getAllParents(1)).toEqual([{ id: 1, parent: null }])
    });
  });
});
