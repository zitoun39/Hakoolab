// src/utils/storageDebug.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const StorageDebugger = {
  async testAsyncStorage(): Promise<{ success: boolean; error?: string; details?: any }> {
    try {
      const testKey = 'hakoolab:storage:test';
      const testValue = JSON.stringify({ 
        timestamp: Date.now(), 
        platform: Platform.OS,
        version: Platform.Version 
      });
      
      // Test write
      await AsyncStorage.setItem(testKey, testValue);
      console.log('✓ AsyncStorage write test passed');
      
      // Test read
      const retrieved = await AsyncStorage.getItem(testKey);
      if (retrieved !== testValue) {
        throw new Error('Retrieved value does not match stored value');
      }
      console.log('✓ AsyncStorage read test passed');
      
      // Test delete
      await AsyncStorage.removeItem(testKey);
      console.log('✓ AsyncStorage delete test passed');
      
      // Verify deletion
      const shouldBeNull = await AsyncStorage.getItem(testKey);
      if (shouldBeNull !== null) {
        throw new Error('Item was not properly deleted');
      }
      console.log('✓ AsyncStorage deletion verification passed');
      
      return { success: true };
    } catch (error: any) {
      console.error('❌ AsyncStorage test failed:', error);
      return { 
        success: false, 
        error: error.message,
        details: {
          platform: Platform.OS,
          version: Platform.Version,
          error: error
        }
      };
    }
  },

  async getFavoritesStorageInfo(): Promise<any> {
    try {
      const favoritesKey = 'hakoolab:favorites:v1';
      const rawData = await AsyncStorage.getItem(favoritesKey);
      
      const info = {
        exists: rawData !== null,
        size: rawData ? rawData.length : 0,
        rawData: rawData,
        parsedData: rawData ? JSON.parse(rawData) : null,
        timestamp: Date.now(),
        platform: Platform.OS
      };
      
      console.log('Favorites storage info:', info);
      return info;
    } catch (error) {
      console.error('Error getting favorites storage info:', error);
      return { error: (error as Error).message };
    }
  },

  async clearAllAppStorage(): Promise<void> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const appKeys = allKeys.filter(key => key.startsWith('hakoolab:'));
      
      if (appKeys.length > 0) {
        await AsyncStorage.multiRemove(appKeys);
        console.log(`✓ Cleared ${appKeys.length} app storage keys:`, appKeys);
      } else {
        console.log('No app storage keys found');
      }
    } catch (error) {
      console.error('Error clearing app storage:', error);
      throw error;
    }
  },

  async getAllStorageKeys(): Promise<string[]> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      console.log('All AsyncStorage keys:', allKeys);
      return [...allKeys];
    } catch (error) {
      console.error('Error getting storage keys:', error);
      return [];
    }
  }
};

// Auto-run basic test in development
if (__DEV__) {
  StorageDebugger.testAsyncStorage().then(result => {
    if (!result.success) {
      console.warn('⚠️ AsyncStorage has issues on this device/platform');
    }
  });
}