/**
 * @license
 * Copyright 2025 Porpoiseful LLC
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview This implements the server side storage
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as commonStorage from './common_storage';

const API_BASE_URL = 'http://localhost:5001';

export async function isServerAvailable(): Promise<boolean> {
  try {
    // Create a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 5000); // 5 second timeout
    });
    
    // Race between the fetch and timeout
    const response = await Promise.race([
      fetch(`${API_BASE_URL}/`),
      timeoutPromise
    ]);
    
    return response.ok;
  } catch (error) {
    // Network error, server not available, or timeout
    return false;
  }
}

export class ServerSideStorage implements commonStorage.Storage {

  async saveEntry(entryKey: string, entryValue: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/entries/${encodeURIComponent(entryKey)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value: entryValue }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save entry: ${response.statusText}`);
    }
  }

  async fetchEntry(entryKey: string, defaultValue: string): Promise<string> {
    const url = `${API_BASE_URL}/entries/${encodeURIComponent(entryKey)}?default=${encodeURIComponent(defaultValue)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch entry: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.value || defaultValue;
  }

  async list(path: string): Promise<string[]> {
    // Ensure path ends with / for directory listing
    const dirPath = path.endsWith('/') ? path : path + '/';
    const response = await fetch(`${API_BASE_URL}/storage/${encodeURIComponent(dirPath)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to list files: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.files || [];
  }

  async rename(oldPath: string, newPath: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/storage/rename`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ old_path: oldPath, new_path: newPath }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to rename: ${response.statusText}`);
    }
  }

  async fetchFileContentText(filePath: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/storage/${encodeURIComponent(filePath)}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`File not found: ${filePath}`);
      }
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.content || '';
  }

  async saveFile(filePath: string, fileContentText: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/storage/${encodeURIComponent(filePath)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: fileContentText }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save file: ${response.statusText}`);
    }
  }

  async delete(path: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/storage/${encodeURIComponent(path)}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete: ${response.statusText}`);
    }
  }
}