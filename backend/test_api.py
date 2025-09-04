#!/usr/bin/env python3
"""
Simple test script to verify the Storage API endpoints work correctly.
"""

import requests
import json

BASE_URL = "http://localhost:5001"

def test_root_endpoint():
    """Test the root endpoint"""
    print("Testing root endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_storage_entry():
    """Test storage entry endpoints"""
    print("\nTesting storage entry endpoints...")
    
    # Save an entry
    try:
        response = requests.post(f"{BASE_URL}/entries/test_key", 
                               json={"value": "test_value"})
        print(f"Save entry status: {response.status_code}")
        
        # Fetch the entry
        response = requests.get(f"{BASE_URL}/entries/test_key")
        print(f"Fetch entry status: {response.status_code}")
        print(f"Fetch entry response: {response.json()}")
        
        # Test default value
        response = requests.get(f"{BASE_URL}/entries/missing_key?default=default_val")
        print(f"Default value response: {response.json()}")
        
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_storage_file():
    """Test storage file endpoints"""
    print("\nTesting storage file endpoints...")
    
    try:
        # Save a file
        response = requests.post(f"{BASE_URL}/storage/test/example.txt", 
                               json={"content": "Hello, World!"})
        print(f"Save file status: {response.status_code}")
        
        # Fetch the file
        response = requests.get(f"{BASE_URL}/storage/test/example.txt")
        print(f"Fetch file status: {response.status_code}")
        print(f"Fetch file response: {response.json()}")
        
        # List files
        response = requests.get(f"{BASE_URL}/storage/test/")
        print(f"List files status: {response.status_code}")
        print(f"List files response: {response.json()}")
        
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_storage_rename():
    """Test storage rename endpoint"""
    print("\nTesting storage rename endpoint...")
    
    try:
        # Create a test file
        response = requests.post(f"{BASE_URL}/storage/test_rename_file.txt", 
                               json={"content": "Content to rename"})
        print(f"Create test file status: {response.status_code}")
        
        # Rename the file
        response = requests.post(f"{BASE_URL}/storage/rename", 
                               json={"old_path": "test_rename_file.txt", "new_path": "renamed_test_file.txt"})
        print(f"Rename file status: {response.status_code}")
        print(f"Rename response: {response.json()}")
        
        # Verify old file is gone
        response = requests.get(f"{BASE_URL}/storage/test_rename_file.txt")
        print(f"Old file fetch status: {response.status_code} (should be 404)")
        
        # Verify new file exists
        response = requests.get(f"{BASE_URL}/storage/renamed_test_file.txt")
        print(f"New file fetch status: {response.status_code}")
        print(f"New file content: {response.json()}")
        
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    print("Testing Storage API endpoints...")
    
    tests = [
        test_root_endpoint,
        test_storage_entry,
        test_storage_file,
        test_storage_rename
    ]
    
    results = []
    for test in tests:
        results.append(test())
    
    print(f"\nTest results: {sum(results)}/{len(results)} passed")
