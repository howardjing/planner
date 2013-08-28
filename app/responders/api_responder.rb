class ApiResponder < ActionController::Responder

  # overrides ActionController::Responder#api_behavior(error)
  def api_behavior(error)
    raise error unless resourceful?

    # put and patch displays head :no_content by default
    if put? || patch?
      display resource
    else
      super(error)
    end
  end

  # format json errors prettier
  def json_resource_errors
    { errors: resource.errors.full_messages }
  end
end