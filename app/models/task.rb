class Task
  include Mongoid::Document
  include Mongoid::Timestamps
  
  belongs_to :project
  after_save { project.touch }

  field :title, type: String
  field :description, type: String
  field :status, type: Symbol, default: :not_started
  index({ title: 1, project_id: 1 }, { unique: true })

  validates_presence_of :title
  validates_uniqueness_of :title, scope: :project_id
  validates_presence_of :project
  validates_inclusion_of :status, in: [:not_started, :completed]
end