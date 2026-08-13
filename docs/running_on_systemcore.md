## Initial setup
1. Make sure your systemcore has at least version 13.  
    https://github.com/LimelightVision/systemcore-os-public/releases

## On any change
1. Make the Blocks ipk
    1. Go to your systemcore-blocks-interface development area
    2. `npm run package`
2. Remove the version of blocks that is installed by selecting the trashcan on 
   blocks from http://robot.local 
   * This is only necessary if the version of Blocks on Systemcore and the one you 
   just built are the same number
3. Go to http://robot.local and select Add Package.  The ipk will be located in the `packaging/` 
directory of your systemcore-blocks-interface
4. Now you can access blocks by selecting the Blocks from the main page of systemcore (http://robot.local/)

## If you get weird problems where deploying doesn't work
* It is possible to have stale files in your development area.   If you run `npm run clean` before
 Step 1 above, then it will clean out all of the cached results
