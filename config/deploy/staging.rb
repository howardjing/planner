set :repository,  "howard@git.dev:#{application}.git"
set :rails_env, "staging"

role :web, "staging.planner.dev"                          # Your HTTP server, Apache/etc
role :app, "staging.planner.dev"                          # This may be the same as your `Web` server
role :db,  "staging.planner.dev", :primary => true # This is where Rails migrations will run