class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :site_url, :code_url
  
  def id
    object.id.to_s
  end

  def description
    object.description || ""
  end
end