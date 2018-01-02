#!/bin/sh

# Followed the following tutorial:
# https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-debian-8

echo "Running build script..."
sudo apt-get update -y
# Install NodeJS
mkdir ~/temp
cd ~/temp
curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh
sudo chmod 700 nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt-get -y install nodejs
sudo apt-get -y install build-essential
rm -rf ~/temp
# Install PM2
sudo npm install -g npm2
# Pull repository code
sudo apt-get install -y git-core
cd ~
git clone https://github.com/leejustin/fgi-tracker.git
# Set up config
mkdir ~/fgi-tracker/config/
gsutil cp gs://indextracker-179600.appspot.com/config/keys.json ~/fgi-tracker/config/
# Run application
cd fgi-tracker/
npm install --save
npm install mongoose --save

# Temporary band-aid fix for directory
mkdir ~/fgi-tracker/node_modules/grpc/src/node
npm install --save

pm2 start index.js
