$(function() {

window.Tweet = Backbone.Model.extend();

window.TweetCollection = Backbone.Collection.extend({
    model: Tweet,
    url:   '/api/list'
});

window.TweetListView = Backbone.View.extend({

    tagName: 'table',

    className: 'table table-bordered table-striped',

    template: _.template($("#tpl-tweet-list").html()),

    initialize: function () {
        this.model.bind("reset", this.render, this);
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

window.TweetSingleView = Backbone.View.extend({

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

window.TweetListCount = Backbone.View.extend({

    el: 'span#tweet-count',

    initialize: function () {
        this.model.bind("reset", this.render, this);
    },

    render: function () {
        this.$el.html(this.model.length);
    }
});
       
var AppRouter = Backbone.Router.extend({

    routes: {
        "":"list",
        "tweet/:id":"details"
    },

    list: function() {
        this.tweetList = new TweetCollection();
        this.tweetListView  = new TweetListView ({model: this.tweetList});
        this.tweetListCount = new TweetListCount({model: this.tweetList});
        this.tweetList.fetch();
        $('div#tweets-list').html(this.tweetListView.render().el);

        // Make rows clickable
        console.log($('tr.tweet').length);
        $('tr.tweet').click(function(){ console.log("abcd"); });
    },

    details: function(id) {
        this.tweet = this.tweetList.get(id);
        console.log("Tweet " + id + " selected");
        this.tweetView = new TweetSingleView({model: this.tweet});
    }
});

var app = new AppRouter();
Backbone.history.start();

// Enable delete button to be a toggle
$("#btn-delete").button();

});

