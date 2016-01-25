import App from '../App';
import Backbone from 'backbone';
import $ from "jquery";
import PageView from "../views/base/PageView";
import Model from '../models/Model';
import template from '../templates/login.hbs'

export default PageView.extend( {

    el: "#page",

    model: new Model(),

    initialize: function(){
        this.render();
    },

    events: {
        "click .submit": "login",
        "keyup input": "clearError"
    },

    login: function(event){
        var self = this;

        event.preventDefault();

        var user = this.$el.find('[data-map-to="username"]').val();
        var pass = this.$el.find('[data-map-to="password"]').val();

        var formData = {
            username: user,
            password: pass
        };

        $.ajax({
            url: "/login",
            data: formData,
            type:"POST"
        }).done(function( response ){
            self.successfulLogin();
        }).fail(function( error ){
            self.loginFail( error );
        }).always(function(){
            self.successfulLogin();
        });



        return false;
    },

    clearError: function(event){
        var target = $(event.target);
        target.removeClass('error');
    },

    successfulLogin: function(dataPassed){
        Backbone.trigger('routeToMain');
    },

    loginFail: function(dataPassed){
        var loginMessage = "Invalid username or password";
        this.$el.find('input').addClass('error');
    },

    checkForEnter: function(event){
        if(event.which === 13){
            this.login(event);
        }
    },

    onShow: function(){
        this.$el.find('#email').focus();
    },

    render: function(){
        this.$el.html( template() );

        this.$el.find('[data-map-to="username"]').focus();

        return this;
    }

});