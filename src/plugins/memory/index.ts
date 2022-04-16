import type { RxStorageInstanceCreationParams } from '../../types';
import { flatClone } from '../../util';
import { RxStorageDexieStatics } from '../dexie/rx-storage-dexie';
import type {
    RxStorageMemory,
    RxStorageMemoryInstanceCreationOptions,
    RxStorageMemorySettings
} from './memory-types';
import {
    createMemoryStorageInstance,
    RxStorageInstanceMemory
} from './rx-storage-instance-memory';

export function getRxStorageMemory(
    settings: RxStorageMemorySettings = {}
): RxStorageMemory {

    const storage: RxStorageMemory = {
        name: 'memory',
        statics: RxStorageDexieStatics,
        collectionStates: new Map(),
        createStorageInstance<RxDocType>(
            params: RxStorageInstanceCreationParams<RxDocType, RxStorageMemoryInstanceCreationOptions>
        ): Promise<RxStorageInstanceMemory<RxDocType>> {
            params = flatClone(params);
            params.collectionName = params.collectionName + '-' + params.schema.version;

            const useSettings = Object.assign(
                {},
                settings,
                params.options
            );


            return createMemoryStorageInstance(this, params, useSettings);
        }
    };

    return storage;
}