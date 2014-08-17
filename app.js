$(function() {

  var Article = Backbone.Model.extend({});

  var Articles = Backbone.Collection.extend({
    model: Article,
    url: 'http://path-to-your-localhost/drupal/articles/rest'
  });

  var ArticleView = Backbone.View.extend({
    tagName: 'li',

    template: _.template($('#article-view').html()),

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));

      return this;
    }
  });

  var ArticlesList = Backbone.View.extend({
    el: $('#main-container'),

    template: _.template($('#articles-list').html()),

    initialize: function() {
      self = this;
      this.collection.fetch({
        success: function() {
          self.render();
        }
      });
    },

    render: function() {
      this.el.innerHTML = this.template();
      var ul = this.$el.find('ul');
      this.collection.forEach( function(model) {
        ul.append((new ArticleView({ model: model })).render().el);
      }, this);

      return this;
    }
  });

  var App = {
    showArticles: function() {
      var AppArticles = new ArticlesList({ collection: new Articles });
    },
    showArticle: function(nid) {
      console.log(nid);
    }
  }

  var Router = Backbone.Router.extend({
    routes: {
      '': 'showArticles',
      'article/:nid': 'showArticle'
    },
    showArticles: function() {
      App.showArticles();
    },
    showArticle: function(nid) {
      App.showArticle(nid);
    }
  });

  var AppRouter = new Router;
  Backbone.history.start({ pushState: true, root: '/headless/' });

});
