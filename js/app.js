App = Ember.Application.create({
	LOG_TRANSITIONS: true
});

// App.Router.reopen({
// 	rootURL: '/foobar'
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
	});
});

App.PostsRoute = Ember.Route.extend({
	model: function () {
		return posts;
	},
	activate: function () {
		console.log("ACTIVATED Posts route");
		// $(document).attr('title', 'Posts');
	}
});

App.IndexRoute = Ember.Route.extend({
	setupController: function (controller) {
		controller.set('title','my app');
	}
})

App.PostRoute = Ember.Route.extend({
	// model: function (params) {
	// 	return posts.findBy('slug', params.post_id);
	// }
	serialize: function (post) {
		return { post_slug: makeSlug(post.title), post_id: post.id };
	}
});

// App.Post = Ember.Object.extend({
// 	find: function (id) {
// 		return posts.findBy('id',id);
// 	}
// });

App.Post = {};
App.Post.find = function (id) {
	return posts.findBy('id', id);
};

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
		return posts;
	}
});

App.PostsFavoritesController = Ember.ArrayController.extend({
	foo: 'bar'
});

// App.AuthorController = Ember.ObjectController.extend({
// });

Ember.Handlebars.helper('date', function (date) {
	return moment(date).fromNow();
});

Ember.Handlebars.helper('marked', function (src) {
	return new Handlebars.SafeString(marked(src));
});



var posts = [
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
