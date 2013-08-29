class ProjectsController < ApplicationController

  def index
    scope = params[:trashed] ? :trashed : :active
    projects = Project.send(scope).order_by('updated_at DESC')
    respond_with projects, each_serializer: Project::WithTasksSerializer, limit: 5
  end

  def show
    project = find_project
    respond_with project, serializer: Project::WithTasksSerializer, trashed: params[:trashed]
  end

  def create
    project = Project.new
    project.update_attributes(project_params)
    respond_with project
  end

  def update
    project = find_project
    project.update_attributes(project_params)
    respond_with project
  end

  def destroy
    project = find_project
    project.trash
    project.save
    respond_with project
  end

  def revive
    project = find_project
    project.untrash
    project.save
    respond_with project
  end

  private

  def find_project
    Project.find(params[:id])
  end

  def project_params
    params.permit(:title, :description)
  end

end