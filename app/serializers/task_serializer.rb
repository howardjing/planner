class TaskSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :status, :tags

  def id
    object.id.to_s
  end

  def description
    object.description || ""
  end
end