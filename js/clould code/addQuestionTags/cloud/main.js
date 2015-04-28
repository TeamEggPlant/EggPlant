Parse.Cloud.define("addQuestionTags", function(request, response) {
    var newTags = new Array();
	var tags = request.params.tags;
	
	for (var tagIndex in tags) {
		var currentTag = tags[tagIndex];
		
		var TagClass = Parse.Object.extend("Tag");
		var newTag = new TagClass();
		newTag.set('name', currentTag.name);
		newTag.set('questionId', currentTag.questionId);
		
		newTags[tagIndex] = newTag;
	};

    Parse.Object.saveAll(newTags,{
		success: function(data) {
		  response.success(data);
		},
		error: function(error) {
		  response.error(error);
		}
	});
});