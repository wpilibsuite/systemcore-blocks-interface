This is temporary and we are working on improving how to do this.

But for now....

1. Follow https://github.com/wpilibsuite/SystemcoreTesting/blob/main/FTC-Testing.md for setting up your system (including installing robotpy)
2. You'll be happier if you `ssh-copy-id systemcore@robot.local` so you won't have to keep
putting in the password every time you ssh (including running scripts that update systemcore)
3. From the sample python project use `robotpy init` and `robotpy sync` to make it ready
#. Deploy the sample python project (use `robotpy deploy`).  This will copy all of the
things necesary.  Right now, if you deploy a java or c++ robot this will stop blocks from working.   
4. Execute the following commands on systemcore (`ssh systemcore@robot.local` or using the terminal in the browser.):
(You'll need to make sure systemcore can access the internet so that it can pip install what is needed for the backend
of blocks.)

```bash
cd /opt
sudo mkdir blocks
sudo chown systemcore blocks
cd blocks
source ~/venv/bin/activate
python -m venv venv # This creates a venv directory under /opt/blocks/ for use by the blocks backend
```
5. From the blocks directory (by default called `systemcore-blocks-interface`) on your local machine, run `./updateSystemCore.sh`
6. Now execture the following commands on sytemcore 
```bash
cd blocks_base_classes
pip install .  # this makes the blocks_base_classes available to robotpy
cd ..
deactivate # this deactivates the robotpy venv
source venv/bin/activate  # and we activate our backend one
cd backend
pip install -r requirements.txt
gunicorn -b 0.0.0.0 main:app
```

Now you can access blocks at http://robot.local:8000

At this point, you can just run `./updateSystemCore.sh` AND refresh your browser to get the new version.  (If you update te blocks_base_classes, you'll have to run `pip install .` again from within the venv for robotpy)
