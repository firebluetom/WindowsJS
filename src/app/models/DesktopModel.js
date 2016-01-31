import App from "../App";
import $ from "jquery";
import jqueryui from "jquery-ui";
import Backbone from "backbone";
import desktopIconTemplate from "../templates/desktop/desktopIcon.hbs"

export default Backbone.Model.extend({

    initialize: function( options ) {
        if(!options || !options.view){
            throw new Error("Need to set view on worker!");
        }

        this.iconPos = {left: 0, top: 5, column: 0};

        this.view = options.view;

        this.desktopWrap = this.view.$el.find('.desktop-contain');
        // this.dock = this.view.$el.find('.taskbar-dock');

        this.addIconToDesktop('weather');
        this.addIconToDesktop('mycomputer');
        this.addIconToDesktop('mydocuments');
        this.addIconToDesktop('recyclebin');
        this.addIconToDesktop('browser');
    },

    addIconToDesktop: function( iconName ){

        var iconTemplateData = {
            iconPos: this.iconPos,
            iconName: iconName
        };

        var temp = desktopIconTemplate( iconTemplateData );

        this.desktopWrap.append( temp );

        this.makeIconsDraggable();

        this.iconPos.top += 100;
        if(this.iconPos.top > window.innerHeight - 250){
            this.iconPos.top = 5;
            this.iconPos.column++;
        }

        this.iconPos.left = 100 * this.iconPos.column;

    },

    makeIconsDraggable: function() {
        var selected, self = this;

        var offset;
        self.view.$el.find(".desktop-icon-contain").draggable({
            revert: false,
            containment: 'parent',
            start: function(ev, ui) {
                if ($(this).hasClass("ui-selected")){
                    selected = self.view.$el.find(".ui-selected").not(this).each(function() {
                       var el = $(this);
                       el.data("offset", el.offset());
                    });
                    // console.log('selected', selected);
                }  else {
                    // console.log('else');
                    selected = $([]);
                    self.view.$el.find(".ui-selected").removeClass("ui-selected");
                }
                offset = $(this).offset();
            },
            drag: function(ev, ui) {
                var dt = ui.position.top - offset.top, dl = ui.position.left - offset.left;
                if(!selected){
                    // console.log('none selected');
                    return;
                }
                selected.not(this).each(function() {
                    var el = $(this), off = el.data("offset");
                    if(off.left > window.innerWidth){
                        off.left = window.innerWidth - 100;
                    }
                    if(off.top > window.innerHeight){
                        off.top = window.innerHeight - 100;
                    }
                    el.css({top: off.top + dt, left: off.left + dl});
                });
            }
        });
    }

});