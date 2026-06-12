This is temporary and we are working on improving how to do this.

But for now....

## Initial setup

1. Follow https://github.com/wpilibsuite/SystemcoreTesting/blob/main/FTC-Testing.md for setting up your system (including installing robotpy)
2. You'll be happier if you `ssh-copy-id systemcore@robot.local` so you won't have to keep
putting in the password every time you ssh (including running scripts that update systemcore)
3. From the sample python project use `robotpy init` and `robotpy sync` to make it ready
4. Deploy the sample python project (use `robotpy deploy`).  This will copy all of the
things necesary.  Right now, if you deploy a java or c++ robot this will stop blocks from working.   
5. Install the Blocks ipk
4. Execute the following commands on systemcore (`ssh systemcore@robot.local` or using the terminal in the browser.):

```bash
source ~/venv/bin/activate  # this activates the robotpy venv
cd /opt/blocks/blocks_base_classes
pip install .  # this makes the blocks_base_classes available to robotpy
```

Now you can access blocks by selecting the Blocks from the main page of systemcore (http://robot.local/)


## After updating source code: (shortcut, you can also make a new package and install)

1. From the blocks directory (by default called `systemcore-blocks-interface`) on your local machine, run
```bash
./updateSystemCore.sh
```
2. Refresh the browser at http://robot.local:9001


## After updating blocks_base_classes:

1. From the blocks directory (by default called `systemcore-blocks-interface`) on your local machine, run
```bash
./updateSystemCore.sh
```

2. Execute the following commands on systemcore (`ssh systemcore@robot.local` or using the terminal in the browser.):
```bash
cd /opt/blocks/blocks_base_classes
source ~/venv/bin/activate  # this activates the robotpy venv
pip install .
deactivate  # this deactivates the robotpy venv
```
