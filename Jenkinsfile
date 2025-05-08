pipeline {
    agent any

    environment {
        EC2_HOST = '13.51.193.141 '
        SSH_KEY = credentials('ubuntu')
        APP_NAME = 'multiapp'
        IMAGE_NAME = 'node-multi-port'
        REMOTE_USER = 'ubuntu'
    }

    stages {
        stage('Clone Repo') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Deploy to EC2 - Multiple Ports') {
            matrix {
                axes {
                    axis {
                        name 'PORT'
                        values '3000', '8080'
                    }
                }

                stages {
                    stage('Deploy') {
                        steps {
                            sshagent (credentials: ['ec2-key']) {
                                sh """
                                docker save $IMAGE_NAME | bzip2 | ssh -o StrictHostKeyChecking=no $REMOTE_USER@$EC2_HOST 'bunzip2 | docker load'

                                ssh -o StrictHostKeyChecking=no $REMOTE_USER@$EC2_HOST << EOF
                                    docker stop $APP_NAME-\${PORT} || true
                                    docker rm $APP_NAME-\${PORT} || true

                                    docker run -d --name $APP_NAME-\${PORT} -p \${PORT}:\${PORT} -e PORT=\${PORT} $IMAGE_NAME
                                EOF
                                """
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed. Check logs.'
        }
    }
}
