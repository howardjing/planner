class Project::WithTasksSerializer < ProjectSerializer
  has_many :tasks

  def tasks
    return object.tasks if options[:limit] == false
      
    limit = options[:limit] || 5
    object.tasks.limit(limit)
  end
end