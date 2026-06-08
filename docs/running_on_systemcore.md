This is temporary and we are working on improving how to do this.

But for now....

1. Follow https://github.com/wpilibsuite/SystemcoreTesting/blob/main/FTC-Testing.md for setting up your system
2. You'l be happier if you ssh-copy-id systemcore@robot.local so you won't have to keep
putting in the password
3. Deploy the sample python project (use `robotpy deploy`).  This will copy all of the
things necesary.  Right now, if you deploy a java or c++ robot this will stop blocks from working.
4. Execute the following commands on systemcore (`ssh systemcore@robot.local`):
(You'll need to make sure systemcore can access the internet)

```bash
cd /opt
sudo mkdir blocks
sudo chown systemcore blocks
cd blocks
source ~/venv/bin/activate
python -m venv venv
```
5. From the blocks directory on your local machine, run `./updateSystemCore.sh`
6. Now execture the following commands on sytemcore 
```bash
cd blocks_base_classes
pip install .
cd ..
deactivate
source venv/bin/activate 
cd backend
pip install -r requirements.txt
gunicorn -b 0.0.0.0 main:app
```

Now you can access blocks at http://robot.local:8000

At this point, you can just run `./updateSystemCore.sh` AND refresh your browser to get the new version.  (If you update te blocks_base_classes, you'll have to run `pip install .` again from within the venv for the robotCommand)
