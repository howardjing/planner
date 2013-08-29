module Trashable
  extend ActiveSupport::Concern

  included do
    field :in_trash, type: Boolean, default: false
    scope :trashed, lambda { where(in_trash: true) }
    scope :active, lambda { where(in_trash: false) }
  end

  def trash
    self.in_trash = true
  end

  def untrash
    self.in_trash = false
  end
end