# Introduction
We are honored that you want to dedicate your time, talent, and efforts to improving Blocks.

# Guidelines
## Getting Oriented
We recommend reading [docs/design.md] to understand the goals of the project

## AI Guidance
(borrowed heavily from Kubernetes policy)
Using AI tools to help write your PR is acceptable, but as the author, you are responsible for understanding every change. 

Listing AI tooling as a co-author, co-signing commits using an AI tool, or using the assisted-by, co-developed or similar commit trailer is not allowed.

Do not leave the first review of AI generated changes to the reviewers. Verify the changes (code review, testing, etc.) before submitting your PR. Reviewers may ask questions about your AI-assisted code, and if you cannot explain why a change was made, the PR will be closed.

When responding to review comments, you must do so without relying on AI tools. Reviewers want to engage directly with you, not with generated responses. If you do not engage directly with reviewers, the PR will be closed.

# Development
## versioning
* We use Semantic Versioning on this project.  <Major>.<Minor>.<Patch>
* When the major or minor value changes, it means that the format of the blocks file has been changed such that older versions can no longer read the files written by the later version.
   * This includes adding new blocks
* Please work with a maintainer on your updateProject changes if your PR requires it.

# For maintainers only
When a PR was merged that means a new release is needed, run the script `makeRelease.sh` 
which will create a tag and push it to upstream.  You'll need upstream 
configured as a remote like below. 
```
upstream        git@github.com:wpilibsuite/systemcore-blocks-interface.git (fetch)
upstream        git@github.com:wpilibsuite/systemcore-blocks-interface.git (push)
```