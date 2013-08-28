require 'spec_helper'

describe TasksController do

  def serialized_task(task, serializer = Task::WithProjectSerializer)
    serializer.new(task, root: false).to_json
  end

  let(:project) { Project.create! title: 'Top Secret Project', description: 'no project description' }
  let(:task) { project.tasks.create! title: 'Top Secret Task', description: 'no task description' }
  
  describe "GET /projects/:project_id/tasks/:task_id" do
    it "returns the task's json" do
      get "/projects/#{project.id}/tasks/#{task.id}.json" 
      response.body.should == serialized_task(task)
    end
  end

  describe "POST /projects/:project_id/tasks" do
    it "creates the task and returns the created resource" do
      expect {
        post "/projects/#{project.id}/tasks.json", title: 'Another project for you', description: 'n/a'
      }.to change { Task.count }.from(0).to(1)

      task = Task.first
      task.project.should == project
      task.title.should == 'Another project for you'
      task.description.should == 'n/a'

      response.body.should == serialized_task(task)
    end
  end

  describe "PATCH /projects/:project_id/tasks/:task_id" do
    it "updates the task" do
      patch "/projects/#{project.id}/tasks/#{task.id}.json", title: 'an updated task'
      task.reload
      task.title.should == 'an updated task'

      response.body.should == serialized_task(task)
    end
  end
end