class RunSlower
  # middleware for delaying application responses (unless we are serving assets)
  
  def initialize(app, delay)
    @app = app
    @delay = delay || 0
  end

  def call(env)  
    unless env['PATH_INFO'].start_with?('/assets')
      sleep @delay
    end
    
    @app.call(env)
  end
end