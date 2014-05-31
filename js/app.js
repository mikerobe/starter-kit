EmberENV = {ENABLE_ALL_FEATURES:true};
var attr = DS.attr;

App = Ember.Application.create({
	LOG_TRANSITIONS: true
});

App.ApplicationAdapter = DS.FixtureAdapter;

App.Router.map(function() {
  this.route('catchall', {path: '/*wildcard'});
});

// App.ApplicationRoute = Ember.Route.extend({
// 	actions: {
// 		error: function (err, transition, originRoute) {
// 			debugger;
// 			console.error("args:", arguments);
// 			return true;
// 		}
// 	}
// });

App.ApplicationRoute = Ember.Route.extend({
  actions: {
    error: function (err) {
      console.log("ERROR",err, err.stack);
    }/*,
    willTransition: function (transition) {
    	transition.abort();
    }*/
  }
});

// App.Router.reopen({
// 	rootURL: '/foobar'
// });

// App.Router.reopen({
// 	location: 'history'
// });

function makeSlug(title) {
	return title.replace(/ /g, '-');
}

App.test = function () {
	// var Person = Ember.Object.extend({
	// 	name: Ember.computed('firstName', 'lastName', function (key, value, previousValue) {
	// 		console.log("Calling name... with ",arguments);

	// 		return this.get('firstName') + " " + this.get('lastName');
	// 	})
	// });

	// var a = Person.create({firstName: 'foo', lastName: 'bar'});
	// console.log(a.get('name'));

	// a.set('firstName','foobar');
	// console.log(a.get('name'));
	// console.log(a.get('name'));
	// a.set('name','foo bar');


	var model = [
	Ember.Object.create({ name: "foo", done: false }),
  Ember.Object.create({ name: "bar", done: true }),
  Ember.Object.create({ name: "baz", done: true })
	];

	var Thing = Ember.Object.extend({
		model: Ember.A(model),
		done: Ember.computed('model.@each.done', function () {
			console.log("updating done count");
			return this.get('model').filterBy('done',true).get("length");
		}),
		foo: Ember.observer('done',function () {
			console.log("yay re-running foo");
		})
	});

	var a = Thing.create();
	// console.log(a.get('done'));
	console.log(a.get('done'));

	// console.log(a.get('model').objectAt(0).set('name','baz'));
	// console.log(a.get('done'));

	a.addObserver('done', function () { console.log("YAY instance done observer")});
	a.get('model').pushObject(Ember.Object.create({name: 'bo', done: true}));
	
};

App.Router.map(function () {
	this.resource('about');
	this.resource('posts', function () {
		this.resource('post',{ path: ':post_slug/:post_id'});
		this.route('favorites', {path: '/favs'});
		this.route('new');
	});
	this.resource('commits');
});

// App.AboutRoute = Ember.Route.extend({
// 	actions: {
// 		willTransition: function (transition) {
// 			transition.abort();
// 		}
// 	}
// });

App.PostsRoute = Ember.Route.extend({
	model: function () {
		// return posts;
		return this.store.find('post');
	},
	activate: function () {
		console.log("ACTIVATED Posts route");
		// $(document).attr('title', 'Posts');
	},
	renderTemplate: function () {
		this.render();
		this.render('post',{outlet: 'favorite', controller: this.controllerFor('post'), model: this.store.find('post',1)});
	}
});

App.CommitsRoute = Ember.Route.extend({
	model: function () {
		return Ember.$.getJSON('https://api.github.com/repos/emberjs/ember.js/pullsucker').then(function (results) {
			return results;
		});
	},
	actions: {
		// error: function (reason) {
		// 	console.error("COMMITS ROUTE HANDLED ERROR",arguments);
		// }
		/*,
		loading: function (transition, originRoute) {

			return true;
		}*/
	}
});

// App.CommitsLoadingRoute = Ember.Route.Extend({});

App.PostsController = Ember.ArrayController.extend({
	foo: 'hello from posts controller',
	queryParams: ['foo']
});

App.PostsIndexController = Ember.ArrayController.extend({
	foo: 'hello from posts *index* controller'
});



App.PostsNewController = Ember.ObjectController.extend({
	foo: 'hello from posts new controller'
});

App.IndexRoute = Ember.Route.extend({
	setupController: function (controller) {
		controller.set('title','my app');
	}
	// beforeModel: function () {
	// 	this.transitionTo('posts');
	// }
})

App.PostRoute = Ember.Route.extend({
	model: function (params) {
		// return posts.findBy('slug', params.post_id);
		return this.store.find('post', params.post_id);
	},
	serialize: function (post) {
		return { post_slug: makeSlug(post.get('title')), post_id: post.get('id') };
	}
});

// App.Post = Ember.Object.extend({
// 	find: function (id) {
// 		return posts.findBy('id',id);
// 	}
// });

// App.Post = {};
// App.Post.find = function (id) {
// 	return posts.findBy('id', id);
// };


App.Post = DS.Model.extend({
  title: attr(),
  author: attr(),
  date: attr(),
  excerpt: attr(),
  body: attr()
});

App.Post.FIXTURES = [
	{
		id: '1',
		title: 'foo bar',
		author: {name: 'baz'},
		date: new Date('2012-01-02'),
		excerpt: 'excerpt',
		body: 'hello'
	},
	{
		id: '2',
		title: 'baz bo',
		author: {name: 'baz'},
		date: new Date('2012-01-03'),
		excerpt: 'excerpt again',
		body: 'hello again'
	}
];

App.PostController = Ember.ObjectController.extend({
	isEditing: false,

	actions: {
		edit: function () {
			this.set('isEditing',true);
		},
		doneEditing: function () {
			this.set('isEditing', false);
		}
	}
});

App.PostsFavoritesRoute = Ember.Route.extend({
	model: function () {
		return this.store.find("post");
	},
	search: 'search value',
	actions: {
		query: function () {
			console.log(this.store);
			// alert("search is " + this.get('search'));
		}
	}
});

App.PostsFavoritesController = Ember.ArrayController.extend({
	foo: 'bar',
	actions: {
		showAlert: function (text) {
			alert(text || "default text");
		},
		confirmAction: function () {
			alert("YAY CONFIRMED");
		}
	}
});

App.ConfirmationButtonComponent = Ember.Component.extend({
	actions: {
		showConfirmation: function () {
			// this.toggleProperty('showingConfirmation');
			this.set('showingConfirmation', true);
		},
		confirm: function () {
			// this.toggleProperty('showingConfirmation');
			this.set('showingConfirmation',false);
			this.sendAction('action');
		}
	}
});

// App.AuthorController = Ember.ObjectController.extend({
// });

Ember.Handlebars.helper('date', function (date) {
	return moment(date).fromNow();
});

Ember.Handlebars.helper('marked', function (src) {
	return new Handlebars.SafeString(marked(src));
});

App.ByAuthorComponent = Ember.Component.extend({
	tagName: 'span'
});
