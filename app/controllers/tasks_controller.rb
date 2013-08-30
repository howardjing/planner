class TasksController < ApplicationController
  skip_before_filter :authenticate!, only: [:show]

  def show
    task = find_task
    respond_with task, serializer: Task::WithProjectSerializer
  end

  def create
    task = project.tasks.build
    task.update_attributes(task_params)
    respond_with project, task, serializer: Task::WithProjectSerializer
  end

  def update
    task = find_task
    task.update_attributes(task_params)
    respond_with task, serializer: Task::WithProjectSerializer
  end

  def destroy
    task = find_task
    task.trash
    task.save
    respond_with task, serializer: Task::WithProjectSerializer
  end

  def revive
    task = find_task
    task.untrash
    task.save
    respond_with task
  end

  private

  def project
    @project ||= Project.find(params[:project_id])
  end

  def find_task
    Task.find(params[:id])
  end

  def task_params
    params.permit(:title, :description, :status)
  end

end