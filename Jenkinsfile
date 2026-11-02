pipeline {
    agent any

    options {
        timestamps()
    }

    environment {
        DEPLOY_DIR = "${WORKSPACE}/deployment"
        PROJECT_DIR = "${WORKSPACE}/Desktop/devops_591"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Show application files') {
            steps {
                sh '''
                    cd "$PROJECT_DIR"
                    echo "===== app.js ====="
                    cat app.js
                    echo "===== server.json ====="
                    cat server.json
                '''
            }
        }

        stage('Test') {
            steps {
                sh 'cd "$PROJECT_DIR" && node --check app.js && node --test tests/app.test.js'
            }
        }

        stage('Package') {
            steps {
                sh 'cd "$PROJECT_DIR" && mkdir -p dist && tar -czf dist/node-app.tar.gz app.js server.json'
                archiveArtifacts artifacts: 'Desktop/devops_591/dist/node-app.tar.gz', fingerprint: true
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    mkdir -p "$DEPLOY_DIR"
                    tar -xzf "$PROJECT_DIR/dist/node-app.tar.gz" -C "$DEPLOY_DIR"
                '''
            }
        }

        stage('Smoke test') {
            steps {
                sh 'cd "$PROJECT_DIR" && APP_PATH="$DEPLOY_DIR/app.js" node --test tests/app.test.js'
            }
        }
    }

    post {
        success {
            echo 'CI/CD completed: app.js and server.json were shown, tested, packaged, and deployed.'
        }
        failure {
            echo 'CI/CD failed. Review the stage logs before deploying.'
        }
    }
}
