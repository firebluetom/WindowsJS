import WindowManager from "../collections/WindowManager";
import App from "../App";
import $ from "jquery";
import Backbone from "backbone";
import PageView from "../views/base/PageView";
import Model from "../models/Model";
import template from "../templates/desktop/desktop.hbs";
import DesktopModel from "../models/DesktopModel";
import DockView from "../views/dock/DockView";


export default PageView.extend({

    el: "#page",

    initialize: function() {
        this.render();
    },

    events: {
        'click a': 'handleAnchor',
        'mousedown div.window': 'mouseOnWindow', // Focus active window.
        'click .desktop-contain a[icon-type]': 'clickIcon'
    },

    handleAnchor: function(ev) {
        var target = $(ev.target).closest('a');
        target.blur();
        ev.preventDefault();
        ev.stopPropagation();
    },

    mouseOnWindow: function(ev){
        var target = $(ev.target);

        if( target.closest('.window-close').length > 0){
            return;
        }
        var targetWindow = target.closest('div.window');

        this.windowFlat();
        targetWindow.addClass('window-stack');

        var topEl = targetWindow.find(".window-top");
        var title = topEl.attr('title');
        var id = topEl.attr('data-id');
        var zIndex = targetWindow.css('zIndex');

        this.windowManager.setAsTopWindow( id, zIndex );
        Backbone.trigger('windowClicked', { title: title, id: id });
    },

    clickIcon: function(ev) {
        var target = $(ev.target).closest('a[icon-type]');

        this.windowManager.addNewWindow( target.attr('icon-type') );
        // Bring window to front.
        this.windowFlat();
    },

    highlightIcon: function(ev) {
        var target = $(ev.target).closest('a[icon-type]');

        this.$el.find('a.active').removeClass('active');
        target.addClass('active');
    },

    windowFlat: function() { // Zero out window z-index.
        this.$el.find('div.window').removeClass( 'window-stack' );
    },

    render: function() {
        var self = this;

        this.$el.html( template() );

        // initialize the Dock
        this.dock = new DockView();

        // listen to global events

        this.listenTo(Backbone, 'windowFlat', function(){
            self.windowFlat();
        });

        this.DesktopModel = new DesktopModel({view: this});

        this.windowManager = new WindowManager();

        return this;

    }

});