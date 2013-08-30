class Auth::SessionsController < ApplicationController
  skip_before_filter :authenticate!, only: [:new, :create]

  def new
    if warden.message
      render json: { errors: [warden.message] }, status: :unprocessable_entity
    else
      render json: { errors: ['Unauthorized access.'] }, status: :unauthorized
    end
  end

  def create
    authenticate! :password, action: :failure
    cookies[:username] = current_user.username
    render json: current_user, status: :ok
  end

  def destroy
    logout
    cookies[:username] = nil
    render json: { messages: ["Logged out successfully."] }, status: :ok
  end

end