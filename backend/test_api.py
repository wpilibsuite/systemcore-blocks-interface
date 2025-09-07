#!/usr/bin/env python3
"""
Unit tests to verify the Storage API endpoints work correctly.
"""

import unittest
import requests
import json

class TestStorageAPI(unittest.TestCase):
    """Test cases for Storage API endpoints"""
    
    def setUp(self):
        """Set up test configuration"""
        self.base_url = "http://localhost:5001"
    
    def test_root_endpoint(self):
        """Test the root endpoint"""
        response = requests.get(f"{self.base_url}/")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), dict)
    
    def test_storage_entry_operations(self):
        """Test storage entry endpoints"""
        # Save an entry
        response = requests.post(f"{self.base_url}/entries/test_key", 
                               json={"value": "test_value"})
        self.assertEqual(response.status_code, 200)
        
        # Fetch the entry
        response = requests.get(f"{self.base_url}/entries/test_key")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("value", data)
        
        # Test default value for missing key
        response = requests.get(f"{self.base_url}/entries/missing_key?default=default_val")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("value", data)
    
    def test_storage_file_operations(self):
        """Test storage file endpoints"""
        # Save a file
        response = requests.post(f"{self.base_url}/storage/test/example.txt", 
                               json={"content": "Hello, World!"})
        self.assertEqual(response.status_code, 200)
        
        # Fetch the file
        response = requests.get(f"{self.base_url}/storage/test/example.txt")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("content", data)
        
        # List files
        response = requests.get(f"{self.base_url}/storage/test/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, (list, dict))

        # Make sure directory shows up
        response = requests.get(f"{self.base_url}/storage/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, (list, dict))
    
    def test_storage_rename_operation(self):
        """Test storage rename endpoint"""
        # Create a test file
        response = requests.post(f"{self.base_url}/storage/test_rename_file.txt", 
                               json={"content": "Content to rename"})
        self.assertEqual(response.status_code, 200)
        
        # Rename the file
        response = requests.post(f"{self.base_url}/storage/rename", 
                               json={"old_path": "test_rename_file.txt", "new_path": "renamed_test_file.txt"})
        self.assertEqual(response.status_code, 200)
        
        # Verify old file is gone
        response = requests.get(f"{self.base_url}/storage/test_rename_file.txt")
        self.assertEqual(response.status_code, 404)
        
        # Verify new file exists
        response = requests.get(f"{self.base_url}/storage/renamed_test_file.txt")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("content", data)

if __name__ == "__main__":
    unittest.main()