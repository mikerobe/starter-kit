App = Ember.Application.create();

function makeSlug(title) {
	return title.replace(/ /g, '-');
}

App.Router.map(function () {
	this.resource('about');
	this.resource('posts', function () {
		this.resource('post',{ path: ':post_slug/:post_id'});
	});
});

App.PostsRoute = Ember.Route.extend({
	model: function () {
		return posts;
	}
});

App.PostRoute = Ember.Route.extend({
	// model: function (params) {
	// 	return posts.findBy('slug', params.post_id);
	// }
	serialize: function (post) {
		return { post_slug: makeSlug(post.title), post_id: post.id };
	}
});

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
