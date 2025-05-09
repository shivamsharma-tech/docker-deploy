pipeline {
    agent any

    environment {
        // Docker Hub credentials (you should have them configured in Jenkins)
        DOCKER_CREDENTIALS = 'Docker' // Docker Hub credentials ID from Jenkins Credentials Manager
        DOCKER_IMAGE = 'shivamsharam/docker-test'    // Name of the Docker image in Docker Hub
    }

    stages {
        stage('Checkout SCM') {
            steps {
                // Checkout your project from GitHub (or any other Git repository)
                git url:'https://github.com/shivamsharma-tech/docker-deploy.git', branch:"main"
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image from the Dockerfile
                    sh 'docker build -t $DOCKER_IMAGE .'
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    // Login to Docker Hub
                    withCredentials([usernamePassword(credentialsId: "$DOCKER_CREDENTIALS", usernameVariable: 'shivamsharam', passwordVariable: 'Shivamsharma')]) {
                        sh "echo $DOCKER_PASSWORD | docker login -u $DOCKER_USER --password-stdin"
                    }
                }
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                script {
                    // Push the Docker image to Docker Hub
                    sh 'docker push $DOCKER_IMAGE'
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                script {
                    // Run the Docker container, exposing ports 4000 and 5000
                    sh 'docker run -d -p 4000:4000 -p 5000:5000 $DOCKER_IMAGE'
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
