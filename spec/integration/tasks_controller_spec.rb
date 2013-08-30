require 'spec_helper'

describe TasksController do

  def serialized_task(task, serializer = Task::WithProjectSerializer)
    serializer.new(task, root: false).to_json
  end

  let(:user) { User.new }
  let(:project) { Project.create! title: 'Top Secret Project', description: 'no project description' }
  let(:task) { project.tasks.create! title: 'Top Secret Task', description: 'no task description' }
  
  describe "GET /projects/:project_id/tasks/:task_id.json" do
    it "returns the task's json" do
      get "/projects/#{project.id}/tasks/#{task.id}.json" 
      response.body.should == serialized_task(task)
    end
  end

  describe "POST /projects/:project_id/tasks.json" do
    before { login_as user }
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

  describe "PATCH /projects/:project_id/tasks/:task_id.json" do
    before { login_as user }
    it "updates the task" do
      patch "/projects/#{project.id}/tasks/#{task.id}.json", title: 'an updated task'
      task.reload
      task.title.should == 'an updated task'

      response.body.should == serialized_task(task)
    end
  end

  describe "DELETE /projects/:project_id/tasks/:task_id.json" do
    before { login_as user }
    it "trashes the task" do
      expect {
        delete "/projects/#{project.id}/tasks/#{task.id}.json"
      }.to change { Task.trashed.count }.from(0).to(1)
    end
  end

  describe "PATCH /projects/:project_id/tasks/:task_id/revive.json" do
    before do
      login_as user
      task.trash
      task.save!
    end
    it "revives the task" do
      expect {
        patch "/projects/#{project.id}/tasks/#{task.id}/revive.json"
      }.to change { Task.active.count }.from(0).to(1)
    end
  end
end