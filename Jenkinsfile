pipeline {
    agent any

    environment {
        EC2_USER = 'ubuntu'
        EC2_HOST = '51.20.98.107'
        REMOTE_APP_DIR = '/home/ubuntu/myapp'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Deploy to EC2 - Multi-Port') {
            matrix {
                axes {
                    axis {
                        name 'PORT'
                        values '3000', '8080'  // Add more ports if needed
                    }
                }

                stages {
                    stage('Copy & Restart on Port') {
                        steps {
                            withCredentials([sshUserPrivateKey(credentialsId: 'ubuntu', keyFileVariable: 'SSH_KEY')]) {
                                sh '''
                                    echo "Deploying to port $PORT on EC2"

                                    # Prepare minimal deployment package
                                    mkdir -p deploy_temp
                                    cp app.js package*.json deploy_temp/

                                    # Copy files to EC2
                                    scp -o StrictHostKeyChecking=no -i $SSH_KEY -r deploy_temp/* $EC2_USER@$EC2_HOST:$REMOTE_APP_DIR/

                                    # Run remote commands
                                    ssh -o StrictHostKeyChecking=no -i $SSH_KEY $EC2_USER@$EC2_HOST <<EOF
                                        cd $REMOTE_APP_DIR
                                        npm install
                                        pm2 delete myapp-$PORT || true
                                        PORT=$PORT pm2 start app.js --name myapp-$PORT
                                    EOF

                                    rm -rf deploy_temp
                                '''
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment succeeded on all ports!"
        }
        failure {
            echo "❌ Deployment failed. Check logs above."
        }
    }
}