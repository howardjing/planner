class ProjectsController < ApplicationController

  def index
    projects = Project.all.order_by('updated_at DESC')
    respond_with projects, each_serializer: Project::WithTasksSerializer
  end

  def show
    project = find_project
    respond_with project, serializer: Project::WithTasksSerializer, limit: false
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

  private

  def find_project
    Project.find(params[:id])
  end

  def project_params
    params.permit(:title, :description)
  end

end