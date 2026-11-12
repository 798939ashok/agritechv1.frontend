pipeline {
    agent: any
    stages{
        stage('1.code copy chesthuna from githu'){
            step{
                git branch: 'main',url: 'https://github.com/798939ashok/agritech.frontend.git'
            }
        }
        stage('2. ippudu image build chesthuna'){
            step{
                sh 'docker build -t agrfrontend .'
            }
        }
        stage('3.ippudu container ne deploy chesthuna'){
            step{
                sh 'docker rm agrifrontend || true',
                sh 'docker run -d -p 3002:80 --name agrifrontend agrifrontend'
            }
        }
    }
        post{
            success{
                echo 'success build',
                echo 'localhost://8080:80'
            }
            failed{
                echo 'build failed'
            }
        }
    
}