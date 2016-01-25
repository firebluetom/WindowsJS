import Backbone from "backbone";
import $ from "jquery";

export default Backbone.View.extend( {

    // a PageView (Login or desktop will add a class before removing itself)
    remove: function( callback ){
        var self = this;

        this.$el.addClass('page-exit');
        this.stopListening();

        var removal = function(){

            Backbone.View.prototype.remove.apply(self, arguments);

            $('body').append($('<div/>', {id: 'page'} ) );

            if(callback){
                callback();
            }
        };
        setTimeout(function(){
            removal();
        }, callback ? 1000 : 0);

    }

});