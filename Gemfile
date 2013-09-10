source 'https://rubygems.org'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.0.0'

# angularjs
gem 'angularjs-rails'

# mongodb
gem 'mongoid', github: 'mongoid/mongoid'
gem 'bson_ext'

# Use SCSS for stylesheets
gem 'sass-rails', '~> 4.0.0'

# twitter bootstrap with sass
gem 'bootstrap-sass', github: 'thomas-mcdonald/bootstrap-sass', branch: '3'

# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'

# JSON serialization
gem 'active_model_serializers'

# authentication
gem 'rails_warden'

group :doc do
  # bundle exec rake doc:rails generates the API under doc/api.
  gem 'sdoc', require: false
end

group :development, :test do
  gem 'rspec-rails'
  gem 'database_cleaner'
end

# Use ActiveModel has_secure_password
gem 'bcrypt-ruby', '~> 3.0.0'

# Use unicorn as the app server
gem 'unicorn'

group :development do
  # Use Capistrano for deployment
  gem 'capistrano'

  # suppress asset pipeline debug statements
  gem 'quiet_assets'
  gem 'puma'
end


# Use debugger
# gem 'debugger', group: [:development, :test]
