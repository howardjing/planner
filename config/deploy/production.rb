set :rails_env, "production"

role :web, "production.planner.dev"                          # Your HTTP server, Apache/etc
role :app, "production.planner.dev"                          # This may be the same as your `Web` server
role :db,  "production.planner.dev", :primary => true # This is where Rails migrations will run