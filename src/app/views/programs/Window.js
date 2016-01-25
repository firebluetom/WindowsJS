import App from "../../App";
import Backbone from "backbone";
import $ from "jquery";
import Model from "../../models/Model";
import template from "../../templates/window.hbs"

var Window = Backbone.View.extend({

    className: "abs-window",

    tagName: 'div',

    initialize: function(){

    },

    events: {
        'click .window-min': 'minimizeWindow',
        "click .window-resize": "resizeWindow",
        'click .window-close': 'closeWindow',
        'dblclick .window-top': 'resizeWindow'
    },

    minimizeWindow: function(ev) {
        var win = this.$el.closest( 'div.window' );

        if( !win.hasClass('window_full') ){ // if not full screen
            // save the position
            var windowPosition = {
                'top': win.css( 'top' ),
                'left': win.css( 'left' ),
                'right': win.css( 'right' ),
                'bottom': win.css( 'bottom' ),
                'width': win.css( 'width' ),
                'height': win.css( 'height' )
            };
            this.model.set( 'windowPosition', windowPosition );
        }

        // remove all dimensions
        win.css({
            'top': '',
            'left': '',
            'right': '',
            'bottom': '',
            'width': '',
            'height': ''
        });

        win.addClass('minimized');
        // notify bottom bar of minimized state

    },

    resizeWindow: function(){
        var windowPosition;

        var win = this.$el.closest('div.window');
        win.removeClass('minimized');

        // Is it maximized already?
        if( win.hasClass('window_full') ){
            // Restore window position.
            windowPosition = this.model.get( 'windowPosition' );
            win.removeClass( 'window_full' ).css( windowPosition );

        } else {
            // save window position
            windowPosition = {
                'top': win.css( 'top' ),
                'left': win.css( 'left' ),
                'right': win.css( 'right' ),
                'bottom': win.css( 'bottom' ),
                'width': win.css( 'width' ),
                'height': win.css( 'height' )
            };
            this.model.set( 'windowPosition', windowPosition );

            win.addClass('window_full').css({
                'top': '',
                'left': '',
                'right': '',
                'bottom': '',
                'width': '',
                'height': ''
            });
        }

        if(this.resizeCallback){
            this.resizeCallback();
        }
    },

    closeWindow: function() {
        Backbone.trigger('closeWindow', this.model.toJSON());
        this.remove();
    },

    showWindow: function(){
        var win = this.$el.closest( 'div.window' );
        win.removeClass( 'minimized' ).addClass('window-stack');

        if( !win.hasClass('window_full') ){
            win.css( this.model.get( 'windowPosition' ) || {} );
        }
    },

    // direct set the z index of a view
    setZIndex: function( zIndex ){
        this.model.set( 'zIndex', zIndex );
    },

    render: function() {
        var temp = template( this.model.toJSON() );
        this.$el.html(temp);

        this.$el.show();
        Backbone.trigger('windowAdded', this.model.toJSON());

        this.commonListeners();

        return this;
    },

    commonListeners: function(){
        var self = this;

        this.listenTo( this.model, 'change', function(){
            var changes = self.model.changedAttributes();

            for( var i in changes ){
                switch( i ){
                    case 'zIndex':
                        self.$el.closest( 'div.window' ).css( 'zIndex', changes[i] );
                        break;
                }
            }
        });
    },

    remove: function(){

        Backbone.View.prototype.remove.apply(this, arguments);

    }

});

Window.extend = function(child) {
    var view = Backbone.View.extend.apply(this, arguments);
    view.prototype.events = $.extend({}, this.prototype.events, child.events);
    return view;
};

export default Window;