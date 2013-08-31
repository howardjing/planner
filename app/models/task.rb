class Task
  include Mongoid::Document
  include Mongoid::Timestamps
  include Trashable
  
  belongs_to :project
  after_save { project.touch }

  field :title, type: String
  field :description, type: String
  field :status, type: Symbol, default: :not_started
  field :tags, type: Array, default: []
  index({ title: 1, project_id: 1 }, { unique: true })

  validates_presence_of :title
  validates_uniqueness_of :title, scope: :project_id
  validates_presence_of :project
  validates_inclusion_of :status, in: [:not_started, :completed]

  scope :tagged_with, lambda { |tag| tag.blank? ? all : any_in(tags: tag) }

  def tags=(tags)
    if tags.present?
      self[:tags] = tags.map(&:strip).uniq.find_all { |t| t.present? }
    else
      self[:tags] = []
    end
  end
end