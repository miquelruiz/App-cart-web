$(function() {

var Tweet = Backbone.Model.extend();

var TweetCollection = Backbone.Collection.extend({
    model: Tweet,
    url:   '/api/list'
});


var TweetListView = Backbone.View.extend({

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

        // Add each tweet to a tbody element
        var tbody = $('<tbody></tbody>');
        var last_tweet;
        this.model.each(function(tweet) {
            tbody.append(new TweetSingleView({model:tweet}).render().el);
            last_tweet = tweet.toJSON();
        }, this);

        // Pass a tweet to template to calculate column names
        this.$el.html(this.template({
            tweet: last_tweet,
            tbody: tbody.html(),
        }));

        return this;
    }
});

var TweetSingleView = Backbone.View.extend({

    tagName: 'tr',
    className: 'tweet',
    template: _.template($('#tpl-single-tweet').html()),

    delete: function(e) {
        console.log("called delete");
        if (! $('button#btn-delete').hasClass('active'))
            return;

        console.log("removing");
        this.model.destroy();
    },

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

var app = new TweetListView({ model: new TweetCollection });

});

