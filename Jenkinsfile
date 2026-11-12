pipeline {
    agent any
    stages{
        stage('1.code copy chesthuna from githu'){
            steps{
                git branch: 'main',url: 'https://github.com/798939ashok/agritech.frontend.git'
            }
        }
        stage('2. ippudu image build chesthuna'){
            steps{
                sh 'docker build -t agrfrontend .'
            }
        }
        stage('3.ippudu container ne deploy chesthuna'){
            steps{
                sh 'docker rm -f agrifrontend || true'
                sh 'docker run -d -p 3002:80 --name agrifrontend agrifrontend'
            }
        }
    }
        post{
            success{
                echo 'success build'
                echo 'localhost:3002'
            }
            failure{
                echo 'build failed'
            }
        }
    
}