require 'spec_helper'

describe ProjectsController do 

  def create_project(params)
    Project.create! params
  end

  def serialized_project(project, serializer = ProjectSerializer)
    serializer.new(project, root: false).to_json
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
    it "returns the requested project as json (without tasks)" do
      get "/projects/#{project.id}.json"
      response.body.should == serialized_project(project, Project::WithTasksSerializer)
    end
  end

  describe "POST /projects.json" do
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
    it "edits the requested project" do
      patch "/projects/#{project.id}.json", description: 'something cool'
      project.reload
      project.description.should == 'something cool'
      response.body.should == serialized_project(project)
    end
  end

  describe "DELETE /projects/:id.json" do
    before do
      project
    end
    it "puts the requested project in the trash" do
      Project.trashed.count.should == 0
      expect {
        delete "/projects/#{project.id}.json"
      }. to change{ Project.active.count }.from(1).to(0)
      Project.trashed.count.should == 1
    end
  end

end