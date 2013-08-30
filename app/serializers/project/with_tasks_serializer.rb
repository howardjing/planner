class Project::WithTasksSerializer < ProjectSerializer
  has_many :tasks

  def tasks      
    scope = options[:trashed] ? :trashed : :active
    tag = options[:tagged_with]
    limit = options[:limit] ? options[:limit] :  0

    object.tasks.send(scope)
      .tagged_with(tag)
      .limit(limit)
  end
end