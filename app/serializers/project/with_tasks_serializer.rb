class Project::WithTasksSerializer < ProjectSerializer
  has_many :tasks

  def tasks      
    scope = options[:trashed] ? :trashed : :active
    limit = options[:limit] ? options[:limit] :  0
    object.tasks.send(scope).limit(limit)
  end
end