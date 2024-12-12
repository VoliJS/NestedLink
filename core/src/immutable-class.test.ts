import { Collection } from './immutable-class';

interface Item {
    id: number;
    name: string;
}

class CollectionClass extends Collection<Item> {}

describe('Collection', () => {
    let  collection:  Readonly<CollectionClass>;

    beforeEach(() => {
        collection = CollectionClass.object({ items: [] });
    });

    test('should add an item', () => {
        const item = { id: 1, name: 'Item 1' };
        const newCollection = collection.add(item);
        expect(newCollection.items).toContainEqual(item);
    });

    test('should remove an item by id', () => {
        const item1 = { id: 1, name: 'Item 1' };
        const item2 = { id: 2, name: 'Item 2' };
        let newCollection = collection.add(item1).add(item2);
        newCollection = newCollection.remove(1);
        expect(newCollection.items).not.toContainEqual(item1);
        expect(newCollection.items).toContainEqual(item2);
    });

    test('should get an item by id', () => {
        const item = { id: 1, name: 'Item 1' };
        const newCollection = collection.add(item);
        expect(newCollection.get(1)).toEqual(item);
    });

    test('should filter items', () => {
        const item1 = { id: 1, name: 'Item 1' };
        const item2 = { id: 2, name: 'Item 2' };
        const newCollection = collection.add(item1).add(item2);
        const filteredItems = newCollection.filter(item => item.id === 1);
        expect(filteredItems).toEqual([item1]);
    });

    test('should map items', () => {
        const item1 = { id: 1, name: 'Item 1' };
        const item2 = { id: 2, name: 'Item 2' };
        const newCollection = collection.add(item1).add(item2);
        const mappedItems = newCollection.map(item => item.name);
        expect(mappedItems).toEqual(['Item 1', 'Item 2']);
    });

    test('should sort items', () => {
        const item1 = { id: 2, name: 'Item 2' };
        const item2 = { id: 1, name: 'Item 1' };
        const newCollection = collection.add(item1).add(item2);
        const sortedCollection = newCollection.sort((a, b) => a.id - b.id);
        expect(sortedCollection.items).toEqual([item2, item1]);
    });

    test('should create collection from iterable', () => {
        const items = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
        const newCollection = CollectionClass.from(items);
        expect(newCollection.items).toEqual(items);
    });

    test('should create collection from iterable with parse function', () => {
        const items = [{ id: 1, ne: 'Item 1' }, { id: 2, ne: 'Item 2' }];
        const parse = (item: { id : number, ne : string}) => ({ id: item.id, name: item.ne.toUpperCase() });
        const newCollection = CollectionClass.from(items, parse);
        expect(newCollection.items).toEqual([{ id: 1, name: 'ITEM 1' }, { id: 2, name: 'ITEM 2' }]);
    });
});