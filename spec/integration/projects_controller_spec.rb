require 'spec_helper'

describe ProjectsController do

  let(:user) { User.new }
  
  def create_project(params)
    Project.create! params
  end

  def serialized_project(project, serializer = ProjectSerializer, serializer_options = {})
    serializer.new(project, {root: false}.merge(serializer_options)).to_json
  end

  let(:project) { create_project title: 'My awesome project', description: 'so nice' }
  
  describe "GET /projects.json" do
    let(:serializer) { Project::WithTasksSerializer }
    before do
      @project1 = create_project title: 'My Cool Project', description: 'So cool'
      @project2 = create_project title: 'My other cool project', description: 'So not cool'
      @trashed =  create_project title: 'My trashed project', in_trash: true
    end

    context "by default" do
      it "returns the serialized projects without trashed projects" do
        get '/projects.json'
        projects = JSON.parse(response.body)
        projects.count.should == 2
        
        # the newest project is first
        projects.to_json.should == '[' + serialized_project(@project2, serializer) + ',' + serialized_project(@project1, serializer) + ']'
      end 
    end

    context "trashed=true" do
      it "returns only trashed projects" do
        get '/projects.json?trashed=true'
        projects = JSON.parse(response.body)
        projects.count.should == 1
        projects.to_json.should == '[' + serialized_project(@trashed, serializer) + ']'
      end
    end
  end

  describe "GET /projects/:id.json" do
    let(:serializer) { Project::WithTasksSerializer }
    let(:active_task) { project.tasks.create! title: 'active task' }
    let(:trashed_task) { 
      project.tasks.build(title: 'trashed task')
      .tap { |t| t.trash }
      .tap { |t| t.save! }
    }

    before do
      active_task
      trashed_task
    end

    it "returns the requested project as json (with active tasks but without trashed tasks)" do
      get "/projects/#{project.id}.json"
      response.body.should == serialized_project(project, serializer)
    end

    context "trashed=true" do
      it "returns the requested project as json (without active tasks but with trashed tasks)" do
        get "/projects/#{project.id}.json?trashed=true"
        response.body.should == serialized_project(project, serializer, trashed: true)
      end
    end
  end

  describe "POST /projects.json" do
    before { login_as user }
    
    it "creates a project on success" do
      expect {
        post '/projects.json', { title: 'New project', description: 'my description' }
      }.to change { Project.count }.from(0).to(1)

      project = Project.first
      project.title.should == 'New project'
      project.description.should == 'my description'
      response.body.should == serialized_project(project)
    end

    it "returns an array of errors on failure" do
      post '/projects.json', { description: 'a cool description' }
      errors = JSON.parse(response.body)['errors'];
      errors.include?("Title can't be blank").should be_true
      Project.count.should == 0
    end
  end

  describe "PATCH /projects/:id.json" do
    before { login_as user }

    it "edits the requested project" do
      patch "/projects/#{project.id}.json", description: 'something cool'
      project.reload
      project.description.should == 'something cool'
      response.body.should == serialized_project(project)
    end
  end

  describe "DELETE /projects/:id.json" do
    before do
      login_as user
      project
    end
    it "puts the requested project in the trash" do
      Project.trashed.count.should == 0
      expect {
        delete "/projects/#{project.id}.json"
      }.to change{ Project.active.count }.from(1).to(0)
      Project.trashed.count.should == 1
    end
  end

  describe "PATCH /projects/:id/revive.json" do
    let(:project) { create_project(title: 'My trashed project', in_trash: true) }
    before do
      login_as user
      project
    end
    it "takes the requested project out of the trash" do
      expect {
        patch "/projects/#{project.id}/revive.json"
      }.to change{ Project.trashed.count }.from(1).to(0)
    end
  end

end