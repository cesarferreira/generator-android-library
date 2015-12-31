# <%= appName %>

_place some sort of fancy description here_

To upload your library to bintray, learn from [here](https://medium.com/@ryanseys/publishing-to-maven-central-and-jcenter-2b6376424856#.3518citej) how to get the data to fill the following environment variables

```bash
export BINTRAY_USER="<something>"
export MAVEN_USER_TOKEN="<something>"
export MAVEN_USER_PASS="<something>"
export BINTRAY_API_KEY="<something>"
```
Add this to your `~/.bashrc` or `.zshrc`

# Uploading

Run the following to build and upload everything:

> ./gradlew bintrayUpload

