import $ from 'jquery';
import Backbone from 'backbone';
import App from '../App';
import Model from '../models/Model';
import windowPartial from '../templates/partials/windowPartial.hbs';
// import Window from '../views/programs/Window';
import MyComputer from '../views/programs/MyComputer';
import RecycleBin from '../views/programs/RecycleBin';
import Browser from '../views/programs/Browser';
import Weather from '../views/programs/Weather';


// map the views to a variable
var viewMap = {
    // 'window': Window,
    recyclebin: RecycleBin,
    mycomputer: MyComputer,
    browser: Browser,
    weather: Weather
};

// keep a map of all windows created
var windowMap = {};

var topZ = 2; // starting z index of two so as not to clash with icons

export default Backbone.Collection.extend({

    model: Model,

    initialize: function(){
        var self = this;

        // manage windows with a listener on the collection
        this.listenTo( this, 'add', function( model ){
            self.addWindowToDesktop( model.toJSON() );
        });

        this.listenTo( Backbone, 'addNewWindow', function( windowName ){
            self.addNewWindow( windowName );
        });

        this.listenTo(Backbone, 'closeWindow', function( modelData ){
            self.closeWindow( modelData );
        });

        this.listenTo(Backbone, 'closeAllWindows', function( title ){
            self.closeAllWindowsByType( title );
        });

        this.listenTo( Backbone, 'showWindowFromDock', function( id ){
            self.setAsTopWindow( id );
        });

    },

    // create a new model for adding a window, this will fire an add event
    addNewWindow: function( windowName ){
        var data = {
            icon: windowName.toLowerCase(),
            windowTitle: windowName,
            id: App.guid("w"),
            zIndex: topZ ++
        };
        // creates the model
        this.create( data );
    },

    addWindowToDesktop: function( modelData ){
        var self = this;
        var newDiv = $('<div/>', {
            "class": 'abs window hidden ' + modelData.windowTitle.toLowerCase(),
            css: {
                left: Math.random() * (window.innerWidth/2),
                top: 50 +  Math.random() * (window.innerHeight/2),
                zIndex: modelData.zIndex
            }
        });
        newDiv.appendTo( $('.desktop-contain') );


        windowMap[ modelData.id ] = new viewMap[ modelData.windowTitle ]( modelData );

        windowMap[ modelData.id ].setElement( newDiv ).render();

        // for animating window size
        newDiv.removeClass( 'hidden' );

        newDiv.draggable({
            cancel: 'a',
            containment: 'parent', // Confine to desktop.
            handle: 'div.window-top' // Movable via top bar only.
        }).resizable({
            containment: 'parent',
            handles: "se",
            helper: "ui-resizable-helper",
            minWidth: 400,
            minHeight: 200
        });

    },

    closeWindow: function( modelData ){
        this.remove( modelData.id );
        delete windowMap[ modelData.id ];
    },

    closeAllWindowsByType: function( type ){
        var models = this.where({
            windowTitle: type
        });

        for( var i in models ){
            var modelData = models[ i ].toJSON();
            // this.closeWindow( models[i].toJSON() );
            // leave as event since dock will deal with closing as well
            windowMap[ modelData.id ].closeWindow();
            // this will trigger a window close from each window view
            // Backbone.trigger( 'closeWindow', models[ i ].toJSON() );
        }
    },

    setAsTopWindow: function( id ){
        windowMap[ id ].setZIndex( topZ++ );
    }


});
