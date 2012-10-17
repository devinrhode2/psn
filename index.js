exports = module.exports;

exports.startServer = function startServer(options) {
  
  var express = require('express')
    , http = require('http');
  
  require('colors');
  
  var app = express();
  
  app.configure(function appConfigure(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/public_html');
    
    // Removed view engine line because we're using .node files
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    
    // From --sessions build option
    if (!options) options = {};
    app.use(express.cookieParser(options.cookieSecret || 'psn trollin'));
    app.use(express.session({ secret: options.sessionSecret || 'PNS TROOOLLLS' }));
    
    // For use .styl files in public and have it 'just work'
    app.use(require('stylus').middleware(__dirname + '/public_html'));
    app.use(express.static(__dirname + '/public_html'));
  });
  
  app.configure('development', function(){
    app.use(express.errorHandler());
  });
  
  
  /**
   * Require 'mu' mustache module
   */
  var mu = require('live-mu')
    , util = require('util');
  mu.root = __dirname + '/views';
  
  /**
   * Routing:
   *
   * '*' route filters all GET's. We do this so we can filter and handle .node files.
   */
  app.get('*', function(req, res, expressNext) {
    
    /**
     * handleNodeRequest handles all the .node GET requests
     */
    var handleNodeRequest = function handleNodeRequest(req, res, file){
      file = file.toLowerCase();
      
      if (process.env.NODE_ENV == 'DEVELOPMENT') {
        mu.clearCache();
      }
      
      // This streams the file to the client as it's rendered!
      util.pump(mu.compileAndRender(file, {req: req}), res);
      // ...and that's it!
    };
  
    // File is the requested file. (aka url)
    file = req.params[0].substr(1, req.params[0].length);
    if (file.contains('.node')) {
      handleNodeRequest(req, res, file);
    } else {
      if (file.contains('.')) {
        if (file.contains('?')) {
          throw 'woah, looks like you have a querystring for a non .node file. Please use a url to a .node file.';
        }
        
        // Forward request to /public folder.
        expressNext();
      } else {
        
        // If last character is a '/'
        if (file.charAt(file.length - 1) === '/') {
          
          // Point to index.node of that folder
          file = file + 'index.node';
        } else {
          
          // Very very root of whole site
          if (file === '') {
            
            // Point to 'index.node'
            file = 'index.node';
          } else {
            
            // Append '/index.node'
            file = file + '/index.node';
          }
        }
        handleNodeRequest(req, res, file);
      }
    }
  });
  
  
  /**
   * Start server
   */
  http.createServer(app).listen(app.get('port'), function serverStarted(){
    console.log(
      'PSN SERVER RUNNING FROM YOU to: ' +
      'http://localhost:'.blue.underline + app.get('port').toString().blue.underline
    );
  });
};

