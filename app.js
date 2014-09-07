$(function() {

  // Model definition.
  // Provides model structure and default values if needed.
  var Article = Backbone.Model.extend({
    idAttribute: 'nid'
  });

  // Collection definition.
  // Provides the model used to include data in the collection and also
  // the URL where the data is going to be fetched.
  var ArticleCollection = Backbone.Collection.extend({

    model: Article,

    url: 'http://rteijeiro-macbook.local:8081/drupal/articles/rest'

  });

  // Articles list view definition.
  // Provides the template used to display a list of articles.
  var ArticlesListView = Backbone.View.extend({

    tagName: 'ul',

    initialize: function() {
      this.model.bind('reset', this.render, this);
    },

    render: function(event) {
      _.each(this.model.models, function(article) {
        this.$el.append(new ArticleListItemView({ model: article }).render().el);
      }, this);

      return this;
    }

  });

  // Article list item view definition.
  // Provides the template used to display an article item in
  // the articles list.
  var ArticleListItemView = Backbone.View.extend({

    tagName: 'li',

    template: _.template($('#article-item-view').html()),

    render: function(event) {
      this.$el.html(this.template(this.model.toJSON()));

      return this;
    }

  });

  // Single article view definition.
  // Provides the template used to display a single article.
  var ArticleView = Backbone.View.extend({

    template: _.template($('#article-details').html()),

    render: function(event) {
      this.$el.html(this.template(this.model.toJSON()));

      return this;
    }

  });

  // Application Router.
  // Provides the routes for application navigation.
  var AppRouter = Backbone.Router.extend({

    routes: {
      '': 'articlesList',
      'article/:id': 'articleDetails'
    },
    articlesList: function() {
      App.list();
    },
    articleDetails: function(id) {
      App.details(id);
    }

  });

  var App = {

    list: function() {
      this.articlesList = new ArticleCollection();
      self = this;
      this.articlesList.fetch({
        
        success: function(response) {

          self.articlesListView = new ArticlesListView({ model: self.articlesList });
          $('#main-container').html(self.articlesListView.render().el);
          if (self.requestedId) {
            self.details(self.requestedId);
          }
        }

      });
    },

    details: function(id) {
      if (this.articlesList) {
        this.article = this.articlesList.get(id);
        this.articleView = new ArticleView({ model: this.article });
        $('#article-details-container').html(this.articleView.render().el);
      }
      else {
        this.requestedId = id;
        this.list();
      }
    }
  }

  var router = new AppRouter;
  Backbone.history.start({ root: '/drupal/app/' });

});
