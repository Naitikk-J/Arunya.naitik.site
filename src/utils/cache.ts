import { GLTF } from 'three-stdlib';

// Cache interface for 3D assets
interface AssetCache {
  models: Map<string, any>;
  textures: Map<string, any>;
  geometries: Map<string, any>;
  lastUpdated: Map<string, number>;
}

// Cache configuration
const CACHE_CONFIG = {
  maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  maxSize: 50, // Maximum number of cached items
};

class AssetCacheManager {
  private cache: AssetCache;
  private isSupported: boolean;

  constructor() {
    this.isSupported = this.checkStorageSupport();
    this.cache = this.loadCache();
  }

  private checkStorageSupport(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  private loadCache(): AssetCache {
    if (!this.isSupported) {
      return {
        models: new Map(),
        textures: new Map(),
        geometries: new Map(),
        lastUpdated: new Map(),
      };
    }

    try {
      const cached = localStorage.getItem('aarunya_asset_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          models: new Map(parsed.models || []),
          textures: new Map(parsed.textures || []),
          geometries: new Map(parsed.geometries || []),
          lastUpdated: new Map(parsed.lastUpdated || []),
        };
      }
    } catch (e) {
      console.warn('Failed to load cache:', e);
    }

    return {
      models: new Map(),
      textures: new Map(),
      geometries: new Map(),
      lastUpdated: new Map(),
    };
  }

  private saveCache(): void {
    if (!this.isSupported) return;

    try {
      // Clean up expired items
      this.cleanupExpired();

      const cacheData = {
        models: Array.from(this.cache.models.entries()),
        textures: Array.from(this.cache.textures.entries()),
        geometries: Array.from(this.cache.geometries.entries()),
        lastUpdated: Array.from(this.cache.lastUpdated.entries()),
      };

      localStorage.setItem('aarunya_asset_cache', JSON.stringify(cacheData));
    } catch (e) {
      console.warn('Failed to save cache:', e);
    }
  }

  private cleanupExpired(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.lastUpdated.forEach((timestamp, key) => {
      if (now - timestamp > CACHE_CONFIG.maxAge) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => {
      this.cache.models.delete(key);
      this.cache.textures.delete(key);
      this.cache.geometries.delete(key);
      this.cache.lastUpdated.delete(key);
    });
  }

  private evictOldest(): void {
    if (this.cache.models.size + this.cache.textures.size + this.cache.geometries.size <= CACHE_CONFIG.maxSize) {
      return;
    }

    // Find oldest item
    let oldestKey = '';
    let oldestTime = Date.now();

    this.cache.lastUpdated.forEach((timestamp, key) => {
      if (timestamp < oldestTime) {
        oldestTime = timestamp;
        oldestKey = key;
      }
    });

    if (oldestKey) {
      this.cache.models.delete(oldestKey);
      this.cache.textures.delete(oldestKey);
      this.cache.geometries.delete(oldestKey);
      this.cache.lastUpdated.delete(oldestKey);
    }
  }

  // Model caching
  setModel(key: string, model: GLTF): void {
    this.cache.models.set(key, model);
    this.cache.lastUpdated.set(key, Date.now());
    this.evictOldest();
    this.saveCache();
  }

  getModel(key: string): GLTF | null {
    const model = this.cache.models.get(key);
    const timestamp = this.cache.lastUpdated.get(key);

    if (!model || !timestamp) {
      return null;
    }

    // Check if expired
    if (Date.now() - timestamp > CACHE_CONFIG.maxAge) {
      this.cache.models.delete(key);
      this.cache.lastUpdated.delete(key);
      this.saveCache();
      return null;
    }

    return model;
  }

  // Texture caching
  setTexture(key: string, texture: any): void {
    this.cache.textures.set(key, texture);
    this.cache.lastUpdated.set(key, Date.now());
    this.evictOldest();
    this.saveCache();
  }

  getTexture(key: string): any | null {
    const texture = this.cache.textures.get(key);
    const timestamp = this.cache.lastUpdated.get(key);

    if (!texture || !timestamp) {
      return null;
    }

    if (Date.now() - timestamp > CACHE_CONFIG.maxAge) {
      this.cache.textures.delete(key);
      this.cache.lastUpdated.delete(key);
      this.saveCache();
      return null;
    }

    return texture;
  }

  // Geometry caching
  setGeometry(key: string, geometry: any): void {
    // Only cache simple geometries to prevent Three.js errors
    if (geometry.type === 'BoxGeometry' || geometry.type === 'PlaneGeometry' || geometry.type === 'CylinderGeometry') {
      this.cache.geometries.set(key, geometry);
      this.cache.lastUpdated.set(key, Date.now());
      this.evictOldest();
      this.saveCache();
    }
  }

  getGeometry(key: string): any | null {
    const geometry = this.cache.geometries.get(key);
    const timestamp = this.cache.lastUpdated.get(key);

    if (!geometry || !timestamp) {
      return null;
    }

    if (Date.now() - timestamp > CACHE_CONFIG.maxAge) {
      this.cache.geometries.delete(key);
      this.cache.lastUpdated.delete(key);
      this.saveCache();
      return null;
    }

    return geometry;
  }

  // Clear cache
  clear(): void {
    this.cache.models.clear();
    this.cache.textures.clear();
    this.cache.geometries.clear();
    this.cache.lastUpdated.clear();
    
    if (this.isSupported) {
      localStorage.removeItem('aarunya_asset_cache');
    }
  }

  // Get cache stats
  getStats(): { size: number; isSupported: boolean; oldestItem: number | null } {
    const now = Date.now();
    let oldest = null;

    this.cache.lastUpdated.forEach((timestamp) => {
      if (oldest === null || timestamp < oldest) {
        oldest = timestamp;
      }
    });

    return {
      size: this.cache.models.size + this.cache.textures.size + this.cache.geometries.size,
      isSupported: this.isSupported,
      oldestItem: oldest ? now - oldest : null,
    };
  }
}

// Export singleton instance
export const assetCache = new AssetCacheManager();

// Utility functions for common caching patterns
export const cacheModel = (key: string, model: GLTF): void => {
  assetCache.setModel(key, model);
};

export const getCachedModel = (key: string): GLTF | null => {
  return assetCache.getModel(key);
};

export const cacheTexture = (key: string, texture: any): void => {
  assetCache.setTexture(key, texture);
};

export const getCachedTexture = (key: string): any | null => {
  return assetCache.getTexture(key);
};

export const cacheGeometry = (key: string, geometry: any): void => {
  assetCache.setGeometry(key, geometry);
};

export const getCachedGeometry = (key: string): any | null => {
  return assetCache.getGeometry(key);
};