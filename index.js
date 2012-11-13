module.exports.startServer = function startServer(options) {
  String.prototype.contains = function StringContainsProto(substring){
    // It would be better to get this from a generic library
    return this.indexOf(substring) > -1;
  };
  
  if (!options) options = {};
  
  var root = process.cwd() + (options.root ? '/'+options.root : '');
  console.log("ROOT", root);
  
  
  /**
   * Module dependencies.
   */
  
  var express = require('express')
    , http = require('http')
    , path = require('path')
    , fs = require('fs');
  
  var app = express();
  
  app.configure(function appConfig(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', root);
    app.set('view engine', 'ejs'); // Probably don't need this
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    
    // From --sessions
    app.use(express.cookieParser(options.cookieSecret || 'psn trollin'));
    app.use(express.session({ secret: options.sessionSecret || 'PSN TROOOLLLS' }));
    
    app.use(app.router);
    
    // For use .styl files in public and have it 'just work'
    app.use(require('stylus').middleware(root));    
    app.use(express.static(root));
  });
  
  
  app.configure('development', function(){
    app.use(express.errorHandler());
  });
  
  
  var StringifyForCircularRefs = require('JSONUtil').JSONUtil().stringify;
  
  /**
   * Routing:
   *
   * '*' route filters all GET's. We do this so we can filter and handle .ejs files.
   */
  app.get('*', function(req, res, expressNext) {
    
    /**
     * handleEjsRequest handles all the .ejs GET requests
     */
    var handleEjsRequest = function handleEjsRequest(req, res, file){
      file = file.toLowerCase();
      
      // Make request object non-circular
      
      res.render(file, {
        req: req,
        JSON: {
          stringify: StringifyForCircularRefs
        }
      });
    };
  
    // File is the requested file. (aka url)
    file = req.params[0].substr(1, req.params[0].length);
    if (file.contains('.ejs')) {
      handleEjsRequest(req, res, file);
    } else {
      if (file.contains('.')) {
        if (file.contains('?')) {
          throw 'woah, looks like you have a querystring for a non .ejs file. Please use a url to a .ejs file.';
        }
        
        // Forward request to /public folder.
        expressNext();
      } else {
        
        // If last character is a '/'
        if (file.charAt(file.length - 1) === '/') {
          
          // Point to index.ejs of that folder
          file = file + 'index.ejs';
        } else {
          
          // Very very root of whole site
          if (file === '') {
            
            // Point to 'index.ejs'
            file = 'index.ejs';
          } else {
            
            // Append '/index.ejs'
            file = file + '/index.ejs';
          }
        }
        handleEjsRequest(req, res, file);
      }
    }
  });
  
  
  http.createServer(app).listen(app.get('port'), function(){
    console.log('psn server running at: http://localhost:' + app.get('port').toString());
  });
};