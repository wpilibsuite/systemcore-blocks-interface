#!/usr/bin/env python3
import paramiko
import os
import sys
from pathlib import Path
import subprocess
from typing import Optional
from getpass import getpass

class DeploymentManager:
    def __init__(self, hostname: str, username: str, source_dir: str, dest_dir: str):
        self.hostname = hostname
        self.username = username
        self.source_dir = Path(source_dir)
        self.dest_dir = dest_dir
        self.client = paramiko.SSHClient()
        self.client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
    def remove_host_key(self) -> None:
        """Remove existing host key from known_hosts"""
        known_hosts = Path.home() / '.ssh' / 'known_hosts'
        if known_hosts.exists():
            subprocess.run(['ssh-keygen', '-f', str(known_hosts), '-R', self.hostname],
                         capture_output=True)
            print(f"Removed existing host key for {self.hostname}")

    def connect(self, password: str) -> bool:
        """Establish SSH connection with retry logic and password authentication"""
        try:
            self.client.connect(
                self.hostname,
                username=self.username,
                password=password,
                look_for_keys=False,  # Don't look for SSH keys
                allow_agent=False     # Don't use SSH agent
            )
            return True
        except paramiko.SSHException as e:
            if "host key" in str(e).lower():
                print("Host key verification failed. Removing old key and retrying...")
                self.remove_host_key()
                try:
                    self.client.connect(
                        self.hostname,
                        username=self.username,
                        password=password,
                        look_for_keys=False,
                        allow_agent=False
                    )
                    return True
                except Exception as retry_error:
                    print(f"Failed to connect after removing host key: {retry_error}")
                    return False
            else:
                print(f"SSH connection error: {e}")
                return False
        except Exception as e:
            print(f"Connection error: {e}")
            return False

    def deploy_files(self) -> bool:
        """Deploy files using SFTP"""
        try:
            sftp = self.client.open_sftp()
            
            def upload_dir(local_dir: Path, remote_dir: str) -> None:
                """Recursively upload directory contents"""
                for item in local_dir.iterdir():
                    remote_path = f"{remote_dir}/{item.name}"
                    
                    if item.is_file():
                        print(f"Uploading {item} to {remote_path}")
                        sftp.put(str(item), remote_path)
                    elif item.is_dir():
                        try:
                            sftp.mkdir(remote_path)
                        except IOError:
                            pass  # Directory might already exist
                        upload_dir(item, remote_path)

            # Create base remote directory if it doesn't exist
            try:
                sftp.mkdir(self.dest_dir)
            except IOError:
                pass

            upload_dir(self.source_dir, self.dest_dir)
            sftp.close()
            return True
            
        except Exception as e:
            print(f"Deployment error: {e}")
            return False

    def restart_apache(self) -> Optional[str]:
        """Restart Apache service"""
        try:
            stdin, stdout, stderr = self.client.exec_command(
                "sudo /etc/init.d/apache2 restart"
            )
            return stdout.read().decode()
        except Exception as e:
            print(f"Failed to restart Apache: {e}")
            return None

    def close(self) -> None:
        """Close SSH connection"""
        self.client.close()

def main():
    # Configuration
    HOSTNAME = "limelight.local"
    USERNAME = "pi"
    SOURCE_DIR = "build"
    DEST_DIR = "/var/www/htmlblocks"
    
    # Get password securely
    password = getpass(f"Enter password for {USERNAME}@{HOSTNAME}: ")
    
    deployer = DeploymentManager(HOSTNAME, USERNAME, SOURCE_DIR, DEST_DIR)
    
    if not deployer.connect(password):
        print("Failed to establish SSH connection")
        sys.exit(1)
    
    print("Connected successfully")
    
    if not deployer.deploy_files():
        print("Deployment failed")
        deployer.close()
        sys.exit(1)
    
    print("Files deployed successfully")
    
    result = deployer.restart_apache()
    if result is not None:
        print("Apache restarted successfully")
    
    deployer.close()
    print("Deployment completed")

if __name__ == "__main__":
    main()