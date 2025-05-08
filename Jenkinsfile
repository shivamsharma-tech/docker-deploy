pipeline {
    agent any

    environment {
        IMAGE_NAME = "node-multi-port"
        EC2_USER = "ubuntu"
        EC2_HOST = "your-ec2-ip"
        SSH_KEY = credentials('ec2-private-key') // Jenkins credential ID
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/your/repo.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Save Docker Image') {
            steps {
                sh 'docker save $IMAGE_NAME > image.tar'
            }
        }

        stage('Deploy to EC2') {
            steps {
                sh '''
                    scp -i $SSH_KEY image.tar $EC2_USER@$EC2_HOST:/home/ubuntu/
                    ssh -i $SSH_KEY $EC2_USER@$EC2_HOST '
                      docker load < image.tar &&
                      docker stop app3000 || true &&
                      docker stop app8080 || true &&
                      docker rm app3000 || true &&
                      docker rm app8080 || true &&
                      docker run -d -p 3000:3000 --name app3000 -e PORT=3000 $IMAGE_NAME &&
                      docker run -d -p 8080:8080 --name app8080 -e PORT=8080 $IMAGE_NAME
                    '
                '''
            }
        }
    }

    post {
        always {
            echo '✅ Pipeline finished.'
        }
        failure {
            echo '❌ Deployment failed. Check logs.'
        }
    }
}
