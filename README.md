# FGI-Tracker

## Fear and Greed Index
The [Fear and Greed Index](http://money.cnn.com/data/fear-and-greed/) is an investment tool by [CNN Money](money.cnn.com) used to measure the emotions driving the market.  It uses various market indicators to report a value representing investor sentiment.  Lower values indicate fear (Bear Market) while higher values indicate greed (Bull Market).  This can help predict when the market may swing in a given direction.

## Project Overview
The FGI Tracker is a web application that handles the aggregation of the Fear and Greed Index data and delivers it in a RESTful API.  For information on the API and its usage, please see the [FGI API Documentation](leejustin.github.io/FGI-Tracker-Slate).

## Technology Used
### Libraries/Frameworks
* nodejs
* cheerio - HTML parser
* mongoose - abstract mongoDB
* nconf - handle config data
* request - remote web requests
* restify - RESTful API

### Infrastructure
* Google Cloud, App Engine
* mongoDB
