Rails.configuration.middleware.use RailsWarden::Manager do |manager|
  manager.default_strategies :password
  manager.failure_app = Auth::SessionsController.action(:new)
end

# Setup Session Serialization
class Warden::SessionSerializer
  def serialize(record)
    [record.class.name, record.id]
  end

  def deserialize(keys)
    klass, id = keys
    klass.constantize.find(id)
  end
end

# Password strategy
Warden::Strategies.add(:password) do
  def valid?
    params[:login] || params[:password]
  end

  def authenticate!
    user = User.find_by_login(params[:login])
    if user && user.authenticate(params[:password])
      success! user
    else
      fail "Invalid login."
    end
  end
end