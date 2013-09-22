class TagsController < ApplicationController
  skip_before_filter :authenticate!, only: [:index]
  def index
    tags = Tag.autocomplete(params[:search])
    respond_with tags
  end
end