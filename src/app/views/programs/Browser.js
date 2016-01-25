import App from "../../App";
import Backbone from "backbone";
import $ from 'jquery';
import Model from "../../models/Model";
import template from "../../templates/browser.hbs";
import Window from "./Window";

export default Window.extend({

    className: "abs-window browser",

    tagName: 'div',

    initialize: function(options) {
    	// Inception browser
        this.model = new Model();

        for(var i in options ){
            this.model.set( i, options[i] );
        }
    },

    events :{
        'keyup .address': 'addressTyping',
        'click .go': 'loadPage'
    },

    addressTyping: function( ev ){
        this.model.set( 'address', $(ev.target).val() );
    },

    loadPage: function(){
        var addr = this.model.get( 'address' );

        if( addr.indexOf('http') === -1){
            addr = 'http://' + addr;
        }

        this.$el.find( 'iframe' ).attr( 'src', addr );
    },

    render: function() {
        var self = this;

        this.$el.html( template( this.model.toJSON() ) );
        this.$el.show();

        Backbone.trigger('windowAdded', this.model.toJSON());

        this.commonListeners();

        return this;
    },

    remove: function(){
        this.stopListening();
        Window.prototype.remove.apply(this, arguments);

    }

});