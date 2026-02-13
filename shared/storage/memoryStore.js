// In-memory storage genérico com CRUD
// Dados perdidos no restart, mas funcional para MVP

class MemoryStore {
  constructor() {
    this.stores = new Map(); // namespace -> Map(id -> item)
  }

  getStore(namespace) {
    if (!this.stores.has(namespace)) {
      this.stores.set(namespace, new Map());
    }
    return this.stores.get(namespace);
  }

  create(namespace, item) {
    const store = this.getStore(namespace);
    store.set(item.id, { ...item, createdAt: new Date().toISOString() });
    return item;
  }

  get(namespace, id) {
    return this.getStore(namespace).get(id) || null;
  }

  list(namespace, filter = () => true) {
    const store = this.getStore(namespace);
    return Array.from(store.values()).filter(filter);
  }

  update(namespace, id, updates) {
    const store = this.getStore(namespace);
    const item = store.get(id);
    if (!item) return null;
    const updated = { ...item, ...updates, updatedAt: new Date().toISOString() };
    store.set(id, updated);
    return updated;
  }

  delete(namespace, id) {
    return this.getStore(namespace).delete(id);
  }

  count(namespace) {
    return this.getStore(namespace).size;
  }
}

export const memoryStore = new MemoryStore();
