# FT-Headline-Challenge

FT-Headline-Challenge is JavaScript and Node.js app for showing headlines from Financial Times

## Setup

Use 'git clone git@github.com:naderakhgari/FT-Challenge.git' to clone the repository into your local machin.
Use 'cd FT-Challenge' to go into the repo direcotory.
Use 'npm install' to install the dependencies.

## run

For running the application in your local machin, you need to create a '.env' file in the root of the app. Create a variable called 'URL' and value 'https://api.ft.com/content/search/v1'.
Create a variable called 'APIKEY' and then cantact me on nader90akhgari@gmail.com to provide you the value of APIKEY.
Use 'npm run dev' to run the application in your localhost.

## Usage

After running the app in localhost, open 'localhost:3003'. You will see the navbar and headlines on the main part of the application and pagination bar at the butom of the page.
It will show 10 headlines by default.
You can search for specific headline and then click on the search button, it will show the headlines related to your search keyword.
When you have serveral pages, you can change the page by clicking on the specific page number or clicking on the next and previous buttons.If you are on the first page the previous button is not working and if you are on the last page the next button is not working.

##  Task points

This app has been built using Javascript and node.js
It has been deployed on Heroku at : https://nader-ft-challenge.herokuapp.com/
It does not relay on any client-side frameworks
I used media query to make the app be responsive
Have a similar look and feel as ft.com
I created a pagination for the app.
I used accessible names for the elements and also used role and aria label to make the app be accessible.
The application has been implemented with server-side render. I sued 'Handlebars' to render the data on the page. so the application is progressively enhanced.

## In future

I would use service worker to make the app capable of working offline
I will use Origami component to design the app
I will write unit test and deploy it in circle-CI for automatic testing

