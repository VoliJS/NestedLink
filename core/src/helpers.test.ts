import { PureObject } from './immutable-class';

/**
 * TestImmutable is a subclass of Immutable used for testing purposes.
 * It includes a value property and an initialize method for custom initialization logic.
 */
class TestImmutable extends PureObject {
    value = 0;

    initialize() {
        // Custom initialization logic if needed
    }
}

describe('Immutable', () => {
    describe('Immutable.map', () => {
        it('should map a collection of partial instances to immutable instances', () => {
            const collection = [{ value: 1 }, { value: 2 }, { value: 3 }];
            const result = TestImmutable.array(collection);

            expect(result).toHaveLength(3);
            expect(result[0]).toBeInstanceOf(TestImmutable);
            expect(result[0].value).toBe(1);
            expect(result[1].value).toBe(2);
            expect(result[2].value).toBe(3);
        });

        it('should map a collection using a callback function', () => {
            const collection = [1, 2, 3];
            const callback = (value: number) => ({ value: value * 2 });
            const result = TestImmutable.array(collection, callback);

            expect(result).toHaveLength(3);
            expect(result[0].value).toBe(2);
            expect(result[1].value).toBe(4);
            expect(result[2].value).toBe(6);
        });

        it('should skip undefined results from the callback function', () => {
            const collection = [1, 2, 3];
            const callback = (value: number) => (value % 2 === 0 ? { value } : undefined);
            const result = TestImmutable.array(collection, callback);

            expect(result).toHaveLength(1);
            expect(result[0].value).toBe(2);
        });
    });

    describe('Immutable.set', () => {
        it('should create a new instance with merged properties', () => {
            const instance = TestImmutable.object({ value: 1 });
            const newInstance = instance.withChanges({ value: 2 });

            expect(newInstance).not.toBe(instance);
            expect(newInstance).toBeInstanceOf(TestImmutable);
            expect(newInstance.value).toBe(2);
        });

        it('should retain properties not specified in the set method', () => {
            class ExtendedImmutable extends TestImmutable {
                anotherValue = 10;
            }

            const instance = ExtendedImmutable.object({ value: 1, anotherValue: 10 });
            const newInstance = instance.withChanges( { value: 2 });

            expect(newInstance).not.toBe(instance);
            expect(newInstance).toBeInstanceOf(ExtendedImmutable);
            expect(newInstance.value).toBe(2);
            expect(newInstance.anotherValue).toBe(10);
        });

        it('should return a frozen instance', () => {
            const instance = TestImmutable.object({ value: 1 });
            const newInstance = instance.withChanges({ value: 2 });

            expect(Object.isFrozen(newInstance)).toBe(true);
        });

        it('should call initialize method when creating a new instance', () => {
            const initializeSpy = jest.spyOn(TestImmutable.prototype, 'initialize');
            const instance = TestImmutable.object({ value: 1 });

            expect(initializeSpy).toHaveBeenCalled();
            initializeSpy.mockRestore();
        });
    });

    describe('Immutable.from', () => {
        it('should create a new immutable instance with the provided properties', () => {
            const instance = TestImmutable.object({ value: 1 });

            expect(instance).toBeInstanceOf(TestImmutable);
            expect(instance.value).toBe(1);
        });

        it('should call initialize method on the new instance', () => {
            const initializeSpy = jest.spyOn(TestImmutable.prototype, 'initialize');
            const instance = TestImmutable.object({ value: 1 });

            expect(initializeSpy).toHaveBeenCalled();
            initializeSpy.mockRestore();
        });

        it('should return a frozen instance', () => {
            const instance = TestImmutable.object({ value: 1 });

            expect(Object.isFrozen(instance)).toBe(true);
        });

        it('should merge properties from the provided partial instance', () => {
            class ExtendedImmutable extends TestImmutable {
                anotherValue = 10;
            }

            const instance = ExtendedImmutable.object({ value: 1, anotherValue: 20 });

            expect(instance).toBeInstanceOf(ExtendedImmutable);
            expect(instance.value).toBe(1);
            expect(instance.anotherValue).toBe(20);
        });

        it('should create a new instance each time it is called', () => {
            const instance1 = TestImmutable.object({ value: 1 });
            const instance2 = TestImmutable.object({ value: 2 });

            expect(instance1).not.toBe(instance2);
            expect(instance1.value).toBe(1);
            expect(instance2.value).toBe(2);
        });
    });
});