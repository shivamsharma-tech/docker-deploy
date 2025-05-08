pipeline {
    agent any

    environment {
        IMAGE_NAME = 'node-multi-port'
        TAR_NAME = "${IMAGE_NAME}.tar"
        REMOTE_USER = 'ubuntu' // Replace with your remote user
        REMOTE_HOST = '13.51.193.141' // Replace with your EC2 IP
        REMOTE_PATH = '/home/ubuntu/' // Replace if needed
    }


    stages {
        stage('Test Docker') {
            steps {
                sh 'docker version'
                sh 'whoami'
                sh 'ls -l /var/run/docker.sock'
            }
        }
        stage('Checkout') {
            steps {
                git url: 'https://github.com/shivamsharma-tech/docker-deploy', branch: 'main'
            }
        }

        stage('Build Docker Image') {
            steps {
                // script {
                    sh "docker build -t ${IMAGE_NAME} ."
                // }
            }
        }

        stage('Save Docker Image') {
            steps {
                script {
                    sh "docker save -o ${TAR_NAME} ${IMAGE_NAME}"
                }
            }
        }

        stage('Copy to EC2') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'your-ssh-creds-id', keyFileVariable: 'SSH_KEY')]) {
                    sh """
                        scp -o StrictHostKeyChecking=no -i $SSH_KEY ${TAR_NAME} ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}
                    """
                }
            }
        }

        stage('Deploy on EC2') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'your-ssh-creds-id', keyFileVariable: 'SSH_KEY')]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no -i $SSH_KEY ${REMOTE_USER}@${REMOTE_HOST} << EOF
                        docker load -i ${REMOTE_PATH}${TAR_NAME}
                        docker stop ${IMAGE_NAME} || true
                        docker rm ${IMAGE_NAME} || true
                        docker run -d --name ${IMAGE_NAME} -p 3000:3000 ${IMAGE_NAME}
                        EOF
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment succeeded.'
        }
        failure {
            echo '❌ Deployment failed. Check logs.'
        }
    }
}
