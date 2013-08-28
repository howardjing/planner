require 'spec_helper'

describe ProjectSerializer do
  let(:project) { Project.new(title: 'Cool proj', description: 'Niiice', tasks: []) }
  let(:serializer) { described_class.new(project, root: false) }
  
  it "serializes a project without tasks" do
    serializer.to_json.should == {
      id: project.id.to_s, 
      title: 'Cool proj', 
      description: 'Niiice'
    }.to_json
  end
end