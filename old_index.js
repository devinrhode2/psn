
  
/*
  fs.readDir('public_html', function findingTemplateLang(){
    
  });
*/
  
  
  /**
   * Require 'mu' mustache module
   */
  var mu = require('live-mu')
    , util = require('util');
  mu.root = __dirname + '/public_html';
  
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
    console.log('psn server running at: http://localhost:' + app.get('port'));
  });
};

