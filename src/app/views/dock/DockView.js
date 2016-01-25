import App from '../../App';
import Backbone from 'backbone';
import $ from 'jquery';
import Model from '../../models/Model';
import DockIconsCollection from '../../collections/DockIconsCollection';
import template from '../../templates/dock/dock.hbs';
import taskbarIconTemplate from "../../templates/dock/taskbarIcon.hbs"

export default Backbone.View.extend( {

    el: '#taskbar',

    model: new Model(),

    initialize: function(){
        var self = this;

        this.iconsCollection = new DockIconsCollection();

        this.render();

        this.listenTo( this.model, 'change', function(){
            self.modelChanged();
        });
        this.listenTo(Backbone, 'windowAdded', function( modelData ){
            self.iconsCollection.create( modelData );
        });
        this.listenTo(Backbone, 'closeWindow', function( modelData ){
            self.windowClosed( modelData );
        });
        this.listenTo(Backbone, 'windowClicked', function( data ){
            self.windowClicked( data );
        });
        this.listenTo( this.iconsCollection, 'add', function( model ){
            self.windowAdded( model.toJSON() );
        });
    },

    events: {
        'click .start-icon': 'start',
        'click .taskbar-dock .taskbar-icon, .taskbar-dock .taskbar-icon-child': 'showWindowClicked',
        'contextmenu ': 'onRightClick',
        'click .context-menu li': 'contextChoice'
    },

    modelChanged: function(){
        var changes = this.model.changedAttributes();

        for( var i in changes ){
            switch( i ){
                default:
                    break;
            }
        }
    },

    start: function() {

    },

    showWindowClicked: function( ev ){
        var self = this;

        var target = $(ev.target).closest('[data-parent-window]');
        var parentId = target.attr('data-parent-window');

        if( parentId ){

            Backbone.trigger( 'windowFlat' );
            Backbone.trigger( 'showWindowFromDock', parentId );

        } else {

            var iconGroupingEl = target.find('.icon-grouping');

            var children = iconGroupingEl.find('.taskbar-icon-child');

            var activeEl = children.filter( '.active' );
            var childToActivate;

            if( activeEl.length > 0 ){
                var indexOfActive = activeEl.index();
                children.removeClass( 'active' );

                childToActivate = $( children.get( (indexOfActive + 1) % children.length ) );
            } else {
                childToActivate = $( children.get( 0 ) );
            }

            childToActivate.addClass( 'active' );
            parentId = childToActivate.attr('data-parent-window');

            Backbone.trigger( 'windowFlat' );
            Backbone.trigger( 'showWindowFromDock', parentId );

        }

        target.addClass( 'active' ).closest( '.taskbar-icon-contain').addClass( 'active' );
        target.siblings().removeClass('active');
    },

    windowAdded: function( modelData ){
        var icon;

        var models = this.iconsCollection.where({
            windowTitle: modelData.windowTitle
        });

        var dockWindowsSection = this.$el.find('.taskbar-dock .dock-windows');

        if( models.length > 1){
            var data = {
                children: models.map(function(model){
                    return model.toJSON();
                }),
                icon: modelData.icon,
                windowTitle: modelData.windowTitle
            };
            icon = $( taskbarIconTemplate( data) );
            dockWindowsSection.find( "[title='" + modelData.windowTitle + "']" ).replaceWith( icon );
        } else {
            icon = $( taskbarIconTemplate( modelData) );
            dockWindowsSection.append( icon );
        }

        modelData.title = modelData.windowTitle;

        this.windowClicked( modelData );

    },

    windowClicked: function( data ){
        this.$el.find( '.taskbar-icon-contain' ).removeClass( 'active' );
        var thisItem = this.$el.find('.taskbar-icon-contain[title="' + data.title + '"]');
        thisItem.addClass('active');

        this.$el.find( '.taskbar-icon-child' ).removeClass( 'active' );
        thisItem.find( '.taskbar-icon-child[data-parent-window="'+data.id+'"]' ).addClass( 'active' );
    },

    windowClosed: function( modelData ){
        this.iconsCollection.remove( modelData.id );

        this.$el.find("[data-parent-window='"+modelData.id+"']").remove();

        var models = this.iconsCollection.where({
            windowTitle: modelData.windowTitle
        });

        if(models.length === 0){
            // if not docked

            this.$el.find('[title="'+modelData.windowTitle+'"]').remove();
        } else {
            var dock = this.$el.find('.taskbar-dock');
            var icon;
            if( models.length > 1){
                var data = {
                    children: models.map(function(model){
                        return model.toJSON();
                    }),
                    icon: modelData.icon,
                    windowTitle: modelData.windowTitle
                };
                icon = $( taskbarIconTemplate( data) );
            } else {
                icon = $( taskbarIconTemplate( modelData) );
            }
            dock.find( "[title='" + modelData.windowTitle + "']" ).replaceWith( icon );
        }
    },

    onRightClick: function( ev ){
        event.preventDefault();

        var target = $( ev.target );

        var container;

        if( target.closest( '.taskbar-icon-child').length > 0 ){
            // if you clicked a child then show the child context
            container = target.closest( '.taskbar-icon-child');
            container.find( '.context-menu' ).removeClass( 'hidden' );
        } else {
            // if you clicked a parent then show the parent context
            container = target.closest( '.taskbar-icon-contain');
            container.children( '.context-menu' ).removeClass( 'hidden' );
        }
        container.one( 'mouseleave' , function(){
            container.find( '.context-menu' ).addClass( 'hidden' );
        });
    },

    contextChoice: function( ev ){
        var target = $( ev.target );

        var action = target.attr('data-action');
        var windowTitle = target.closest('[title]').attr( 'title' );

        switch( action ){
            case 'close':
                // close all windows
                Backbone.trigger( 'closeAllWindows', windowTitle );
                break;
            case 'pin':
                // pin to dock
                break;
        }

    },

    render: function(){

        var temp = template( this.model.toJSON() );

        this.$el.html( temp );
        this.$el.show();

        return this;
    }

});