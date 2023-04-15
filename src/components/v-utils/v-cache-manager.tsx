/**
 * Store data in session storage
 */

interface CachedObject {
    key: any,
    value: any,
    ttl: number,
    time: number
}

enum CacheType {
    LOCAL,
    SESSION
}

class CacheManager {

    private storage: Storage = sessionStorage;
    constructor(scope: CacheType = CacheType.SESSION) {
        if (scope === CacheType.LOCAL) {
            this.storage = localStorage;
        }
    }
    clear = () => {
        this.storage.clear();
    }
    remove = (key: any) => {
        let keyStr = JSON.stringify(key);
        this.storage.removeItem(keyStr);
    }

    get = (key: any, defaultValue: any = undefined) => {
        let keyStr = JSON.stringify(key);
        const stored = this.storage.getItem(keyStr);
        if (!stored) {
            if (defaultValue) {
                this.set(key, defaultValue, -1);
            }
            return defaultValue;
        }
        let cachedObject = JSON.parse(stored) as CachedObject;
        if (cachedObject.ttl !== -1 && Date.now() - cachedObject.time > cachedObject.ttl) {
            console.debug(`Cached object ${key} expired`);
            this.storage.removeItem(keyStr);
            return defaultValue;
        }
        this.update(key, cachedObject);
        return cachedObject.value;
    }

    update(key: any, cachedObject: CachedObject) {
        let keyStr = JSON.stringify(key);
        cachedObject.time = Date.now();
        this.storage.setItem(keyStr, JSON.stringify(cachedObject));
    }

    set = (key: any, value: any, ttl: number = 3600000 * 24) => {
        let keyStr = JSON.stringify(key);
        if (value === undefined) {
            this.storage.removeItem(keyStr);
        }
        else {
            let cachedObject: string = JSON.stringify({ key, value, ttl, time: Date.now() });
            this.storage.setItem(keyStr, cachedObject);
        }

    }
}

export const sessionCache = new CacheManager();
export const localCache = new CacheManager(CacheType.LOCAL);