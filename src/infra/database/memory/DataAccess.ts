import { IDataAccess } from "../../../domain/repository/IDataAccess.js";

export class InMemoryDataAccess implements IDataAccess {
  private data: Map<string, any[]>;
  private nextId: Map<string, number>;

  constructor() {
    this.data = new Map<string, any[]>();
    this.nextId = new Map<string, number>();
  }

  private ensureCollectionExists(collectionName: string): void {
    if (!this.data.has(collectionName)) {
      this.data.set(collectionName, []);
      this.nextId.set(collectionName, 1);
    }
  }

  async findMany<T>(
    collectionName: string,
    query?: Partial<T>,
    selectFields?: (keyof T)[]
  ): Promise<T[]> {
    this.ensureCollectionExists(collectionName);
    let results = this.data.get(collectionName) as T[];
    console.log(results);

    if (query) {
      const keys = Object.keys(query) as (keyof T)[];
      results = results.filter((item) =>
        keys.every((key) => item[key] === query[key])
      );
    }

    if (selectFields && selectFields.length > 0) {
      results = results.map((item) => {
        const selectedItem: Partial<T> = {};
        selectFields.forEach((field) => {
          if (item[field] !== undefined) {
            selectedItem[field] = item[field];
          }
        });
        return selectedItem as T;
      });
    }

    return results;
  }

  async findOne<T>(
    collectionName: string,
    query: Partial<T>,
    selectFields?: (keyof T)[]
  ): Promise<T | undefined> {
    const results = await this.findMany(collectionName, query, selectFields);
    return results.length > 0 ? results[0] : undefined;
  }

  async create<T>(
    collectionName: string,
    data: Partial<T>
  ): Promise<string | number | undefined> {
    this.ensureCollectionExists(collectionName);
    const collection = this.data.get(collectionName)!;
    const currentId = this.nextId.get(collectionName)!;

    const newDocument = {
      ...data,
      id: currentId,
    } as T;

    collection.push(newDocument);
    this.nextId.set(collectionName, currentId + 1);

    return currentId;
  }

  async update<T>(
    collectionName: string,
    query: Partial<T>,
    data: Partial<T>
  ): Promise<number> {
    this.ensureCollectionExists(collectionName);
    const collection = this.data.get(collectionName)!;
    let modifiedCount = 0;

    const keys = Object.keys(query) as (keyof T)[];

    for (const item of collection) {
      const matchesQuery = keys.every((key) => item[key] === query[key]);
      if (matchesQuery) {
        Object.assign(item, data);
        modifiedCount++;
      }
    }

    return modifiedCount;
  }

  async remove(collectionName: string, query: Partial<any>): Promise<number> {
    this.ensureCollectionExists(collectionName);
    const collection = this.data.get(collectionName)!;
    const originalSize = collection.length;

    const keys = Object.keys(query);
    const filteredCollection = collection.filter(
      (item) => !keys.every((key) => item[key] === query[key])
    );

    this.data.set(collectionName, filteredCollection);
    return originalSize - filteredCollection.length;
  }
}
