$(function() {

  // Model definition.
  // Provides model structure and default values if needed.
  var Article = Backbone.Model.extend({

    idAttribute: 'nid',

    sync: function(method, model, options) {

      // Set authentication.
      options = options || (options = {});
      options.beforeSend = function(xhr) {
        var user = 'user';
        var pass = 'password';

        xhr.setRequestHeader('Authorization', ("Basic " + btoa(user + ':' + pass)));
      };

      switch(method) {

        case 'patch':
        case 'delete':
          options.url = '../node/' + this.get('nid');
          break;

      }

      return Backbone.sync.apply(this, arguments);
    }

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

  // Article add/edit form.
  // Provides the template used to display the form to add
  // or edit an article.
  var ArticleEditView = Backbone.View.extend({

    template: _.template($('#article-form').html()),

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
      'article/:nid': 'articleDetails',
      'article/:nid/edit': 'articleEdit',
      'article/:nid/delete': 'articleDelete'
    },
    articlesList: function() {
      App.list();
    },
    articleDetails: function(nid) {
      App.details(nid);
    },
    articleEdit: function(nid) {
      App.edit(nid);
    },
    articleDelete: function(nid) {
      App.delete(nid);
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

    details: function(nid) {
      if (this.articlesList) {
        this.article = this.articlesList.get(nid);
        this.articleView = new ArticleView({ model: this.article });
        $('#article-details-container').html(this.articleView.render().el);
      }
      else {
        this.requestedId = nid;
        this.list();
      }
    },

    edit: function(nid) {
      if (this.articlesList) {
        this.article = this.articlesList.get(nid);
        this.articleView = new ArticleEditView({ model: this.article });
        $('#article-details-container').html(this.articleView.render().el);
      }
      else {
        this.requestedId = nid;
        this.list();
      }
    },

    delete: function(nid) {
      if (this.articlesList) {
        this.article = this.articlesList.get(nid);
        this.article.destroy();
      }
      else {
        this.requestId = nid;
        this.list();
      }
    },

  }

  var router = new AppRouter;
  Backbone.history.start({ root: '/drupal/app/' });

});
