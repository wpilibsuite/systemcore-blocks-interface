This still has some temporary steps

## Initial setup

1. Follow https://github.com/wpilibsuite/SystemcoreTesting/blob/main/FTC-Testing.md for setting up your system (including installing robotpy)
2. Install the Blocks ipk. (If you don't have the ipk file yet, go to the end of this file for directions on how to make it)
    * To install the ipk, go to http://robot.local and select install ipk.

Now you can access blocks by selecting the Blocks from the main page of systemcore (http://robot.local/)

## After updating source code: (this is a shortcut vs uninstalling blocks, making a new ipk, and installing it)

1. From the blocks directory (by default called `systemcore-blocks-interface`) on your local machine, run
```bash
./updateSystemCore.sh
```
2. Refresh the browser on the Blocks page


## After updating blocks_base_classes:
`npm run package` to make the new Blocks ipk

## Making the Blocks ipk
### Preparing to make it
1. Go to `packaging` directory inside of your systemcore-blocks-interface development area on your local machine
2. `python3 -m venv venv`
3. `venv/bin/activate`
4. Somehwere on your development machine, you need the code in this PR: https://github.com/robotpy/robotpy-installer/pull/165 
5. In that directory, type `pip install .`
6. `deactivate` 

### Making it
1. Go to your systemcore-blocks-interface development area
2. `npm run package`
3. There is no step 3. :-)
