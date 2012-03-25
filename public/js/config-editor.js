$(function() {

var Config = Backbone.Model.extend({
    url: '/api/config',
});

var ConfigView = Backbone.View.extend({

    el: "div#config",
    template: _.template($("#tpl-config").html()),

    events: {
        "change input"        : "change",
        "click button#save"   : "save",
        "click button#cancel" : "cancel"
    },

    change : function(e) {
        var target = e.target;
        console.log("changing " + target.name + " from " + target.defaultValue + ' to: ' + target.value);
    },

    save   : function() {
        console.log("saving");
        this.model.set({ mode: "asdfasdfasdf" });
    },

    cancel : function() { console.log("cancel"); },

    initialize: function() {
        console.log("initializing");
        this.model.bind("change", this.render, this);
        this.model.fetch();
    },

    render: function() {
        console.log("rendering");
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

var app = new ConfigView({ model: new Config });

});
