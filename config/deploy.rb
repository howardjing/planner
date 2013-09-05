set :stages, %w(production staging)
set :default_stage, "staging"
set :user, "deployer"
require 'capistrano/ext/multistage'
require 'bundler/capistrano'

set :application, "planner"
set :repository,  "git@github.com:howardjing/#{application}.git"

set :scm, :git # You can set :scm explicitly or Capistrano will make an intelligent guess based on known version control directory names
# Or: `accurev`, `bzr`, `cvs`, `darcs`, `git`, `mercurial`, `perforce`, `subversion` or `none`

set :deploy_to, "/var/www/#{application}"
set :deploy_via, :remote_cache

# http://stackoverflow.com/questions/7863070/capistrano-deploy-host-key-verification-failed
# for automatically adding the remote git repo's server to ~/.ssh/known_hosts
set :ssh_options, forward_agent: true
default_run_options[:pty] = true 

# rbenv stuff
set :default_environment, {
  'PATH' => "$HOME/.rbenv/shims:$HOME/.rbenv/bin:$PATH"
}
set :use_sudo, false

# if you want to clean up old releases on each deploy uncomment this:
after "deploy:restart", "deploy:cleanup"

# if you're still using the script/reaper helper you will need
# these http://github.com/rails/irs_process_scripts

# If you are using Passenger mod_rails uncomment this:
# namespace :deploy do
#   task :start do ; end
#   task :stop do ; end
#   task :restart, :roles => :app, :except => { :no_release => true } do
#     run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
#   end
# end

namespace :deploy do
  %w[start stop restart].each do |command|
    desc "#{command} unicorn server"
    task command, roles: :app, except: {no_release: true} do
      run "service unicorn_#{application} #{command}"
    end
  end
end
