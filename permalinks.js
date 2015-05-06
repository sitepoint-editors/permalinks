Posts = new Meteor.Collection('posts');

Router.route('/', function(){
    this.render('home'); 
});

Router.route('/post/:permalink', function(){
    var permalinkValue = this.params.permalink;
    this.render('post', {
        data: function(){
            return Posts.findOne({permalink: permalinkValue});
        }
    });
}, {
    name: 'post'
});

if(Meteor.isClient){

    Template.home.events({
      'submit form': function(event){
          event.preventDefault();
          var title = event.target.title.value;
          var content = event.target.content.value;
          var post = Posts.insert({
              title: title,
              content: content
          });
          Posts.update({_id: post}, {$set: {permalink: post}});
      }
    });

    Template.post.events({
    'keypress .permalink': function(event, template){
        var permalink = template.find('.permalink').innerHTML;
        if(event.which == 13){
            event.preventDefault();
            Posts.update({_id: this._id}, {$set: {permalink: permalink}});
            event.target.blur();
            Router.go('post', {permalink: permalink});
        }
    }
});

}