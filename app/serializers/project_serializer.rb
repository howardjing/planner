class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :title, :description
  
  def id
    object.id.to_s
  end
end