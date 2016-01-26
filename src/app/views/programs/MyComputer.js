import App from "../../App";
import Backbone from "backbone";
import Model from "../../models/Model";
import template from "../../templates/mycomputer.hbs";
import Window from "./Window";

export default Window.extend({

    className: "abs-window",

    tagName: 'div',

    initialize: function(options) {

        this.model = new Model();

        for(var i in options ){
            this.model.set( i, options[i] );
        }
    },

    events :{

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