class WelcomeController < ApplicationController
  skip_before_filter :authenticate!
  respond_to :html
end