# Node.js and Jenkins CI/CD demo

This demo uses `app.js` for a small HTTP server and `server.json` for its host, port, and response message. Jenkins prints both source files in the build log, tests the app, packages and deploys the files into its workspace, and runs the tests against the deployed copy.

## 1. Run the app locally

From this directory:

```sh
node --check app.js
node --test tests/app.test.js
node app.js
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000) to see the configured message. Stop the server with Ctrl+C.

## 2. Make the files available to Jenkins

The demo is inside the `Desktop/devops_591` subdirectory of the repository. Push that directory to a Git remote accessible by Jenkins. If working in the repository root, stage only the demo directory:

```sh
git add Desktop/devops_591
git commit -m "Add Node.js Jenkins CI/CD demo"
git push
```

## 3. Create a Jenkins Pipeline job

1. Make sure Jenkins and its build agent have Git and Node.js installed. Install the Pipeline and Git plugins if needed.
2. In Jenkins, select **New Item**, enter a job name such as `node-ci-cd-demo`, choose **Pipeline**, and select **OK**.
3. In the job configuration's **Pipeline** section, set **Definition** to **Pipeline script from SCM**.
4. Select **Git**, enter the repository URL, and add Jenkins credentials if the repository is private.
5. Set **Branch Specifier** to the branch you pushed (for example `*/main`).
6. Set **Script Path** to `Desktop/devops_591/Jenkinsfile`, then save.

## 4. Run and show the files in Jenkins

1. Open the job and select **Build Now**.
2. Open the build, then select **Console Output**.
3. Find the **Show application files** stage. The log prints the complete contents of `app.js` and `server.json`.
4. Follow the remaining stages: **Test**, **Package**, **Deploy**, and **Smoke test**. A successful build archives `Desktop/devops_591/dist/node-app.tar.gz` and places the deployed `app.js` and `server.json` in the build workspace's `deployment/` directory.
5. To run the deployed server on the Jenkins agent, use:

   ```sh
   cd "$WORKSPACE/deployment"
   node app.js
   ```

   Then open `http://127.0.0.1:3000` on that agent. The configured host is localhost, so it is not exposed to other machines by default.

## 5. Optional: build automatically on pushes

Configure your Git provider's webhook to reach Jenkins and enable the matching webhook trigger under **Build Triggers**. If inbound webhooks are unavailable, configure **Poll SCM** instead.

This demo deploys only into the Jenkins workspace. For a real deployment, replace the deploy stage with your environment's deployment mechanism and store credentials in Jenkins Credentials, not in source control.
