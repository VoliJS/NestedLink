import { PureCollection } from './immutable-class';
import { PureObject } from './immutable-class';

interface Item {
    id: number;
    name: string;
}

class CollectionClass extends PureCollection<Item> {}

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

    class TestImmutable extends PureObject {
        prop1?: string;
        prop2?: number;

        initialize() {
            if (this.prop1) {
                this.prop1 = this.prop1.toUpperCase();
            }
        }

        upd(){
            return this.withChanges( x => { 
                x.prop1 = 'newTest'
                x.prop2 = 456 
            });
        }
    }

    describe('Immutable', () => {
        test('should create an immutable object', () => {
            const obj = TestImmutable.object({ prop1: 'test', prop2: 123 });
            expect(obj).toEqual({ prop1: 'TEST', prop2: 123 });
            expect(Object.isFrozen(obj)).toBe(true);
        });

        test('should create an immutable object with parse function', () => {
            const parse = (value: { p1: string, p2: number }) => ({ prop1: value.p1, prop2: value.p2 });
            const obj = TestImmutable.object({ p1: 'test', p2: 123 }, parse);
            expect(obj).toEqual({ prop1: 'TEST', prop2: 123 });
            expect(Object.isFrozen(obj)).toBe(true);
        });

        test('should create an array of immutable objects', () => {
            const collection = [{ prop1: 'test1', prop2: 123 }, { prop1: 'test2', prop2: 456 }];
            const arr = TestImmutable.array(collection);
            expect(arr).toEqual([{ prop1: 'TEST1', prop2: 123 }, { prop1: 'TEST2', prop2: 456 }]);
            expect(arr.every(Object.isFrozen)).toBe(true);
        });

        test('should create an array of immutable objects with parse function', () => {
            const collection = [{ p1: 'test1', p2: 123 }, { p1: 'test2', p2: 456 }];
            const parse = (value: { p1: string, p2: number }) => ({ prop1: value.p1, prop2: value.p2 });
            const arr = TestImmutable.array(collection, parse);
            expect(arr).toEqual([{ prop1: 'TEST1', prop2: 123 }, { prop1: 'TEST2', prop2: 456 }]);
            expect(arr.every(Object.isFrozen)).toBe(true);
        });

        test('should create a new immutable object with merged properties', () => {
            const obj = TestImmutable.object({ prop1: 'test', prop2: 123 });
            const obj1 = obj.withChanges( self =>{ 
                self.prop1 = 'newTest';
            });
            expect(obj1).toEqual({ prop1: 'NEWTEST', prop2: 123 });
            expect(Object.isFrozen(obj1)).toBe(true);

            const obj2 = obj1.withChanges({ prop2: 456 });
            expect(obj2).toEqual({ prop1: 'NEWTEST', prop2: 456 });

        });
    });
});