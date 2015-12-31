# <%= appName %>

_place some sort of fancy description here_

To upload your library to bintray, learn from [here](https://medium.com/@ryanseys/publishing-to-maven-central-and-jcenter-2b6376424856#.3518citej) how to get the data to fill the following environment variables

```bash
export BINTRAY_USER="<something>"
export BINTRAY_API_KEY="<something>"

export MAVEN_USER_TOKEN="<something>"
export MAVEN_USER_PASS="<something>"
```
Add this to your `~/.bashrc` or `.zshrc`


# Uploading
Run the following to build and upload everything:

> ./gradlew bintrayUpload

# Finishing up
Sign in to https://bintray.com/ to see how you did. If this is your first deploy of the package then you’ll have to send a message to get approved for that package name. A message should pop up on the site explaining how to go about sending that request. Approval for this should take less than a couple hours.
