import App from "../App";
import $ from "jquery";
import Backbone from "backbone";
import Desktop from "../views/Desktop";
import Collection from "../collections/Collection";
import LoginView from "../views/LoginView"

var routes = {};

export default Backbone.Router.extend({

    initialize: function() {
        var self = this;
        // Tells Backbone to start watching for hashchange events
        Backbone.history.start();

        Backbone.listenTo(Backbone, 'routeToMain', function(){
            self.navigate('/', {trigger: true});
        });
    },

    // All of your Backbone Routes (add more)
    routes: {

        // When there is no hash on the url, the home method is called
        "": "index",
        "login": "login"

    },

    index: function() {
        var createDesktop = function(){
            setTimeout(function(){
                routes.desktop = new Desktop();
            });
        };
        if(routes.login){
            routes.login.remove(createDesktop);
        } else {
            createDesktop();
        }

    },

    login: function(){
        if(routes.login){
            routes.login.remove();
        }
        setTimeout(function(){
            routes.login = new LoginView();
        });
    }

});
