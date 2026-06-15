This is temporary and we are working on improving how to do this.

But for now....

## Initial setup

1. Follow https://github.com/wpilibsuite/SystemcoreTesting/blob/main/FTC-Testing.md for setting up your system (including installing robotpy)
2. You'll be happier if you `ssh-copy-id systemcore@robot.local` so you won't have to keep
putting in the password every time you ssh (including running scripts that update systemcore)
3. Install the Blocks ipk
Now you can access blocks by selecting the Blocks from the main page of systemcore (http://robot.local/)

4. Deploy a blocks program (it will say it succeeds, but it doesn't )
5. Execute the following commands on systemcore (`ssh systemcore@robot.local` or using the terminal in the browser.):
```bash
source ~/venv/bin/activate  # this activates the robotpy venv
pip install robotpy-cli==2027.0.1b1
```

## After updating source code: (shortcut, you can also make a new package and install)

1. From the blocks directory (by default called `systemcore-blocks-interface`) on your local machine, run
```bash
./updateSystemCore.sh
```
2. Refresh the browser at http://robot.local:9001


## After updating blocks_base_classes:
`npm run package` to make the new ipk
Follow steps 3-5 from above
