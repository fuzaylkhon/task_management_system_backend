#!/bin/bash

# EC2 Deployment Script for Backend

SERVER_IP=$1
KEY_PATH=$2

if [ -z "$SERVER_IP" ] || [ -z "$KEY_PATH" ]; then
    echo "Usage: ./deploy-ec2.sh <server-ip> <key-path>"
    exit 1
fi

echo "🚀 Deploying Backend to EC2..."

# Copy files to server
scp -i $KEY_PATH -r ./* ubuntu@$SERVER_IP:/home/ubuntu/task-backend/

# SSH and deploy
ssh -i $KEY_PATH ubuntu@$SERVER_IP << 'ENDSSH'
    cd /home/ubuntu/task-backend
    
    # Install dependencies
    npm install
    
    # Build TypeScript
    npm run build
    
    # Restart with PM2
    pm2 stop task-backend || true
    pm2 start dist/server.js --name task-backend
    pm2 save
    
    echo "✅ Backend deployed successfully!"
ENDSSH