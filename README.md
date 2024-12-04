# BruinDate

## Table of Contents
1. [Description](#description)
2. [Set Up](#set-up)
3. [Technologies](#technologies)
4. [Authors](#authors)

## Description
BruinDate is a browser dating app

## Set Up
1. Clone the repo using the following command:
    ```bash
    git clone https://github.com/thejoey6/dating-app.git
    ```
2. Add `.env` to the 'server' directory with the following text:
    ```env
    ATLAS_URI= [Your own MongoDB Database here]
    JWT_SECRET= [Your own JWT Secret here]
    ```
3. Open CMD Prompt, run 'cd /server', and run 'npm install' to install all backend dependencies.
5. run 'npm start' to start the server. Leave CMD Prompt open.
6. Open a new CMD Prompt, run 'cd /client', and run 'npm install' to install all frontend dependencies.
8. Run `npm start' to start the client. Leave CMD Prompt open.
9. The CMD Prompt will tell you the URL to open in your browser.
    
## Technologies
MongoDB, Express.js, React.js, Node.js

## Authors
BruinDate was made as the final project for CS 35L taught by Professor Paul Eggert at UCLA in Spring 2024. Made by: Andrew Sun, Brian Brito, Catherine Di, Joseph Read, Melody Myae.
