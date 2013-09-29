class Project
  include Mongoid::Document
  include Mongoid::Timestamps
  include Trashable

  has_many :tasks, order: 'updated_at DESC'

  field :title, type: String
  field :description, type: String

  # url to the project's code repository
  field :code_url, type: String, default: ''
  
  # url to the project's site
  field :site_url, type: String, default: ''

  index({ title: 1 }, { unique: true })

  validates_presence_of :title
  validates_uniqueness_of :title
end