class ApplicationController < ActionController::Base
  before_filter :authenticate!

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  
  # respond to json and customize json errors
  respond_to :json
  self.responder = ApiResponder
  rescue_from Mongoid::Errors::DocumentNotFound, with: :record_not_found
  
  protected

  def default_serializer_options
    { root: false }
  end

  def record_not_found(exception)
    respond_to do |format|
      format.json { render json: { errors: ['Item was not found.'] }, status: :not_found }
    end
  end
end
