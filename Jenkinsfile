pipeline {
    agent any

    environment {
        APP_NAME                 = 'healthcare-frontend'
        IMAGE_NAME               = 'healthcare-frontend'
        IMAGE_TAG                = 'latest'
        PORT                     = '3000'
        NEXT_TELEMETRY_DISABLED  = '1'
        NEXT_PUBLIC_API_BASE_URL = 'http://localhost/api/v1'
        INTERNAL_API_BASE_URL    = 'http://healthcare_nginx/api/v1'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
        timeout(time: 25, unit: 'MINUTES')
        timestamps()
    }

    stages {
        stage('1. Checkout SCM') {
            steps {
                echo '📥 [SCM] Checking out repository branch...'
                checkout scm
                script {
                    def rawBranch = env.BRANCH_NAME ?: env.GIT_BRANCH ?: 'unknown'
                    echo "🌿 Detected Branch from SCM: ${rawBranch}"
                    echo "🔖 Git Commit SHA: ${env.GIT_COMMIT ?: 'local'}"

                    // Intelligent check: Does rawBranch or commit belong to origin/main?
                    def isMainCommit = (rawBranch.contains('main') || rawBranch.contains('master') || (sh(script: "git branch -r --contains HEAD 2>/dev/null | grep -E 'origin/main|origin/master'", returnStatus: true) == 0))
                    if (isMainCommit) {
                        echo "🎯 Target Commit is verified on origin/main. Activating Production Deployment (CD)!"
                        env.IS_PRODUCTION = 'true'
                    } else {
                        echo "🛡️ Target Commit is restricted to dev branch. Activating CI Testing Gate."
                        env.IS_PRODUCTION = 'false'
                    }
                }
            }
        }

        stage('2. Install Dependencies') {
            steps {
                echo '📦 [NPM] Installing frontend dependencies (including devDependencies)...'
                sh '''
                    echo "Node version: $(node -v)"
                    echo "NPM version: $(npm -v)"
                    npm install --legacy-peer-deps --include=dev
                '''
            }
        }

        stage('3. ESLint Code Quality') {
            steps {
                echo '🔍 [Lint] Running ESLint code audit...'
                sh 'npm run lint'
            }
        }

        stage('4. TypeScript Strict Verification') {
            steps {
                echo '⚙️ [TypeScript] Verifying compilation integrity and strict type safety...'
                sh 'npx tsc --noEmit'
            }
        }

        stage('5. Dev Branch Gate (CI Only)') {
            when {
                expression {
                    return env.IS_PRODUCTION != 'true'
                }
            }
            steps {
                echo '========================================================================'
                echo '🛡️  [DEV CI VERIFIED] Frontend code quality & types are 100% healthy!'
                echo "🌿 Branch [${env.GIT_BRANCH ?: env.BRANCH_NAME}] is certified clean."
                echo '🚀 Safe to open a Pull Request (PR) to merge into main.'
                echo 'ℹ️  Production Docker build & deploy are bypassed for dev branch.'
                echo '========================================================================'
            }
        }

        stage('6. Production Docker Image Build') {
            when {
                expression {
                    return env.IS_PRODUCTION == 'true'
                }
            }
            steps {
                echo '🐳 [Docker] Building production multi-stage Next.js container image...'
                sh '''
                    docker build \
                        --build-arg NEXT_PUBLIC_API_BASE_URL="${NEXT_PUBLIC_API_BASE_URL}" \
                        --build-arg INTERNAL_API_BASE_URL="${INTERNAL_API_BASE_URL}" \
                        --build-arg IS_DOCKER="true" \
                        -t ${IMAGE_NAME}:${IMAGE_TAG} \
                        -t ${IMAGE_NAME}:${BUILD_NUMBER} \
                        -f Dockerfile .
                '''
            }
        }

        stage('7. Production Deploy & Health Probe') {
            when {
                expression {
                    return env.IS_PRODUCTION == 'true'
                }
            }
            steps {
                echo '🚀 [Deploy] Deploying Next.js container via Docker Compose...'
                sh '''
                    if [ ! -f .env ]; then
                        if [ -f .env.example ]; then
                            cp .env.example .env
                        fi
                    fi
                    docker compose up -d --build --remove-orphans
                    echo "⏳ Waiting 10 seconds for Next.js standalone server initialization..."
                    sleep 10
                    docker compose ps
                '''
            }
        }
    }

    post {
        success {
            script {
                if (env.IS_PRODUCTION == 'true') {
                    echo '========================================================================'
                    echo '✅ [PRODUCTION CD SUCCESS] Healthcare Frontend deployed & operational!'
                    echo "🏷️ Image Tag: ${IMAGE_NAME}:${BUILD_NUMBER} & ${IMAGE_TAG}"
                    echo '========================================================================'
                } else {
                    echo '========================================================================'
                    echo '✅ [DEV CI SUCCESS] Frontend PR Verification Passed cleanly!'
                    echo 'No production deployment was triggered. Staging code is verified.'
                    echo '========================================================================'
                }
            }
        }
        failure {
            echo '========================================================================'
            echo '❌ [PIPELINE FAILED] Frontend stage execution encountered an error.'
            echo 'Please review the stage console logs above for diagnostics.'
            echo '========================================================================'
        }
    }
}
