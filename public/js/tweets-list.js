$(function() {

var Tweet = Backbone.Model.extend();

var TweetCollection = Backbone.Collection.extend({
    model: Tweet,
    url:   '/api/list'
});

var TweetSingleView = Backbone.View.extend({

    tagName: 'tr',
    className: 'tweet',
    template: _.template($('#tpl-single-tweet').html()),

    render: function () {
        this.$el.html(this.template({tweet: this.model.toJSON()}));
        return this;
    }
});

var TweetListCount = Backbone.View.extend({

    el: 'span#tweet-count',

    initialize: function () {
        this.model.bind("reset", this.render, this);
    },

    render: function () {
        this.$el.html(this.model.length);
    }
});

var AppView = Backbone.View.extend({

    el: "table#tweet-list",
    template: _.template($("#tpl-tweet-list").html()),

    initialize: function () {
        this.model.bind("reset", this.render, this);
        this.countView = new TweetListCount({model: this.model});
        
        this.model.fetch();
    },

    render: function () {
        if (this.model.length == 0)
            return this;

        var tbody = $('<tbody></tbody>');

        this.model.each(function(tweet) {
            tbody.append(new TweetSingleView({model: tweet}).render().el);
        });

        // Pass a tweet to template to calculate column names
        this.$el.html(this.template({
            tweet: this.model.models[0].toJSON(),
            tbody: tbody.html(),
        }));

        return this;
    }
});

var app = new AppView({ model: new TweetCollection });

});

