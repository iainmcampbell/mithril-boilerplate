/*

  Cutting The Mustard

    Conditionally load the large CSS/JS files etc so we don’t
    destroy data plans just to disappoint folks on mobile

  using

    EnhanceJS: a progressive enhancement boilerplate.
    Copyright 2014 @scottjehl, Filament Group, Inc. Licensed MIT

*/

(function(window, undefined){
  "use strict";

  var mustard = {};

  var bowser = window.bowser || {};
  var Modernizr = window.Modernizr || {};
  var setTimeout = window.setTimeout;

  // Define some variables to be used throughout this file
  var docElem = window.document.documentElement;
  var head = window.document.head || window.document.getElementsByTagName( "head" )[ 0 ];

  docElem.className = ''

  /*

    "Cutting the Mustard"

    Add your qualifications for major browser experience divisions here.

    Browser levels:

    0. Unsupported (show sorry page)
    1. Supported
    ...additional levels as required

  */

  // some basic browser elimination, replace with Bowser for anything serious
  if( !( "querySelector" in window.document ) )
    mustard.level = 0;
  else
    mustard.level = 1;

  // some basic feature detection, replace with Modernizr for anything serious
  mustard.touch = !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch);
  mustard.orientation = !!(window.DeviceOrientationEvent);

  window.mustard = mustard;

  /*

    Stuff for all browsers, even unsupported ones

  */

  docElem.className += (mustard.touch) ? ' touch' : ' no-touch';


  /*

    Unsupported browsers

  */

  if( mustard.level === 0 ){
    docElem.className += ' unsupported'
    return;
  }


  /*

    Supported: Level 1+

      load full css, js, fonts

  */

  // Add scoping classes to HTML element: useful for upgrading the presentation of elements that will be enhanced with JS behavior
  docElem.className = 'supported';

  var fullJS = getMeta( 'fulljs' );
  if( fullJS ) loadJS( fullJS.content );

  var fullCSS = getMeta( 'fullcss' );
  if(fullCSS) loadCSS( fullCSS.content );

  var fonts = getMeta( 'fonts' );
  if( fonts ) loadCSS( fonts.content );








  /*

    ##### ##   ## ###  ##  ##### ###### ####  ######  ###  ##  ####
    ##    ##   ## #### ## ##       ##    ##  ##    ## #### ## ##
    ####  ##   ## ## #### ##       ##    ##  ##    ## ## ####  ####
    ##    ##   ## ##  ### ##       ##    ##  ##    ## ##  ###     ##
    ##     #####  ##   ##  #####   ##   ####  ######  ##   ## #####

  */




  /*

    loadJS

      load a JS file asynchronously. Included from https://github.com/filamentgroup/loadJS/

  */
  function loadJS( src ){
    var ref = window.document.getElementsByTagName( "script" )[ 0 ];
    var script = window.document.createElement( "script" );
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore( script, ref );
    return script;
  }

  /*

    loadCSS

    Arguments explained:
      `href` [REQUIRED] is the URL for your CSS file.
      `before` [OPTIONAL] is the element the script should use as a reference for injecting our stylesheet <link> before
        By default, loadCSS attempts to inject the link after the last stylesheet or script in the DOM. However, you might desire a more specific location in your document.
      `media` [OPTIONAL] is the media type or query of the stylesheet. By default it will be 'all'

  */
  function loadCSS( href, before, media ){

    var doc = window.document;
    var ss = doc.createElement( "link" );
    var ref;
    if( before ){
      ref = before;
    }
    else {
      var refs = ( doc.body || doc.getElementsByTagName( "head" )[ 0 ] ).childNodes;
      ref = refs[ refs.length - 1];
    }

    var sheets = doc.styleSheets;
    ss.rel = "stylesheet";
    ss.href = href;
    // temporarily set media to something inapplicable to ensure it'll fetch without blocking render
    ss.media = "only x";

    // Inject link
      // Note: the ternary preserves the existing behavior of "before" argument, but we could choose to change the argument to "after" in a later release and standardize on ref.nextSibling for all refs
      // Note: `insertBefore` is used instead of `appendChild`, for safety re: http://www.paulirish.com/2011/surefire-dom-element-insertion/
    ref.parentNode.insertBefore( ss, ( before ? ref : ref.nextSibling ) );
    // A method (exposed on return object for external use) that mimics onload by polling until document.styleSheets until it includes the new sheet.
    var onloadcssdefined = function( cb ){
      var resolvedHref = ss.href;
      var i = sheets.length;
      while( i-- ){
        if( sheets[ i ].href === resolvedHref ){
          return cb();
        }
      }
      setTimeout(function() {
        onloadcssdefined( cb );
      });
    };

    // once loaded, set link's media back to `all` so that the stylesheet applies once it loads
    ss.onloadcssdefined = onloadcssdefined;
    onloadcssdefined(function() {
      ss.media = media || "all";
    });
    return ss;
  };

  // getMeta function: get a meta tag by name
  // NOTE: meta tag must be in the HTML source before this script is included in order to guarantee it'll be found
  function getMeta( metaname ){
    var metas = window.document.getElementsByTagName( "meta" );
    var meta;
    for( var i = 0; i < metas.length; i ++ ){
      if( metas[ i ].name && metas[ i ].name === metaname ){
        meta = metas[ i ];
        break;
      }
    }
    return meta;
  }

  // cookie function from https://github.com/filamentgroup/cookie/
  function cookie( name, value, days ){
    var expires;
    // if value is undefined, get the cookie value
    if( value === undefined ){
      var cookiestring = "; " + window.document.cookie;
      var cookies = cookiestring.split( "; " + name + "=" );
      if ( cookies.length == 2 ){
        return cookies.pop().split( ";" ).shift();
      }
      return null;
    }
    else {
      // if value is a false boolean, we'll treat that as a delete
      if( value === false ){
        days = -1;
      }
      if ( days ) {
        var date = new Date();
        date.setTime( date.getTime() + ( days * 24 * 60 * 60 * 1000 ) );
        expires = "; expires="+date.toGMTString();
      }
      else {
        expires = "";
      }
      window.document.cookie = name + "=" + value + expires + "; path=/";
    }
  }


}(this));
