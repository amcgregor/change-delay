(function($) {
    
    $.fn.delay = function(callback, options) {
        if ( callback !== undefined ) {
            if ( $.isFunction(callback) ) this.on('commit', callback);
            else if ( options === undefined ) options = callback;
            // else explode horribly?
        }
        
        var settings = $.extend({
            initial: 1000,  // initial delay value of one second
            highlight: true,  // when entering a field, select its contents
            minimum: 500, // minimum wait time
            threshold: 2  // don't bother if the field has fewer than this many characters
        }, options);
        
        function init(element, self) {
            // Only handle <input type="text"> and <textarea> tags.
            if ( element.type.toUpperCase() != "TEXT" && element.nodeName.toUpperCase() != "TEXTAREA" ) return;
            
            var timeout,
                lastChange = 0,
                delay = settings.initial,
                value = self.val();
            
            function handler() {
                lastChange = 0;
                var nvalue = self.val();
                if ( nvalue.length < settings.threshold || nvalue == value ) return;
                self.trigger('commit', [nvalue]);
                value = nvalue;
            }
            
            function check(event) {
                clearTimeout(timeout);
                
                if ( event.keyCode == 13 && this.type.toUpperCase() == "TEXT" ) handler();
                
                if ( lastChange === 0 ) {
                    lastChange = Date.now();
                    delay = settings.initial;
                    timeout = setTimeout(handler, delay);
                    return;
                }
                
                var t = Date.now();
                delay = (delay + (t - lastChange) * 2) / 2;
                lastChange = t;
                timeout = setTimeout(handler, Math.max(settings.minimum, delay * 2))
            }
            
            self.on('keyup', check);
        }
        
        // Handle the highlighting feature.
        if ( settings.highlight ) this.on('focus.selection', function() { this.select(); });
        
        return this.each(function(index) { init(this, $(this)); });
    }
    
})(jQuery);