# Isopleth 2.0

A platform for following interesting paths through JavaScript.

## To install:
    
Install nvm and node (https://github.com/creationix/nvm)
    
    nvm install v0.10.32
    nvm alias default v0.10.32
    
Install redis (via homebrew, or if on windows google it)
    
    brew install redis
       
Install npm dependencies for all the sub-projects
    
    cd isopleth/fondue-api
    rm -rf node_modules
    npm install
    
    cd isopleth/isopleth
    rm -rf node_modules
    npm install
    
    cd isopleth/socket-fondue-jsbin
    rm -rf node_modules
    npm install

    cd isopleth/tests
    rm -rf node_modules
    npm install
    
Setup Chrome
    
    - Open google chrome
    - Update your chrome flags to allow localhost to spoof https certs:
        chrome://flags > Allow invalid certificates for resources loaded from localhost

    - chrome://extensions
    - check "Developer Mode"
    - Load upnacked extension...
    - Navigate to isopleth/chrome-extension
    - Ok

## To run:
    
    cd isopleth/fondue-api/redis
    redis-server
    
    cd isopleth/fondue-api
    node app-cluster.js  #start fondue api on all cores
    
    cd isopleth/socket-fondue-jsbin
    node app.js
    
    cd isopleth/isopleth
    node app.js

    cd isopleth/tests
    node app.js
    
    # All four must be up and running for the test app to work.
    
## To run a test app:

    Open http://localhost:3004/demo/index3.html
             
    Open Dev Tools
             
    Open Isopleth Dev Tool Pane
    
    Open Chrome Dev Tools
    
    Reload Page with Ibex
    
    It Instruments Pages, wait a few minutes for source tracing, watch fondue-api logs for activity
    
    Refresh web page, reload with ibex again (this time is uses cached values)
    
    Wait for page to fully reappear and work
    
    Click on the isopleth tab that auto-opened
    
    Hit Draw button at bottom

## Other helpful notes:

Isopleth is built on top of fondue: 
- https://github.com/adobe-research/fondue
- https://adobe-research.github.io/fondue/

Isopleth Installation Troubleshooting:
- use these node_modules if yours don't work:  
- don't put code in a folder synced to Box or Dropbox or whatnot
- comment out lines 2 and 4 in crossOriginMiddleware.js
- rerun as needed in each of the 4 servers you need to run: `nvm install v0.10.32 ; nvm alias default v0.10.32`
- redis-server is the command to run
- to fix isopleth tab loading with an error just quit all servers, redo nvm install/alias, and retry
- run some samples this way: http://localhost:3004/demo/index.html to get the demo to work you may have to uncomment out code in home.js (confirmed this is right)

To solve instrumentation issues:
- add problematic urls reported in console to the blocked domains and restart the servers

## Limitations:

- does not address minified code so we need to use it on sites that don't have unminified code
- does not instrument google / facebook / top 10 alexa ranking sites
- samples in isopleth/public/javascripts/util/samples are supposed to be loadable by going to http://localhost:3007/[sample folder name]]/ but when you actually try to load the the cached invokes, they don't work in this repo - they may work in this branch of the original isopleth repo https://github.com/NUDelta/Isopleth/tree/feature/file-loading but you'd have to check

- our fork of fondue provides us all the nodes that we need and yellow arrows (sync relationships)
- however it is an open issue that it does not provide all the orange arrows (arrow from the async declaration context to the callback, the declaration context is the function inside which the callback is bound to its trigger)
    - specifically the issue is that there are some nodes in rawInvokes (which is directly from fondue) such their invoke.parents property contains invocationIds that are not present in rawInvokes.
    - in reaction to this limitation we removed the "if the orange arrow isn't right / gonna show, then don't show purple arrows" type of logic in InvokeGraph.js (see the code near the second "README LIMITATIONS RELATED NOTE")
- for this study we are focused on nodes, yellow arrows, and purple arrows (which are all fine given our new fixes) so we will continue without addressing this limitation
