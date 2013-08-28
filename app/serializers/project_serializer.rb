class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :title, :description
  
  def id
    object.id.to_s
  end

  def description
    object.description || ""
  end
end