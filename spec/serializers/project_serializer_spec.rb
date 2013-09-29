require 'spec_helper'

describe ProjectSerializer do
  let(:project) { Project.new(
    title: 'Cool proj', 
    description: 'Niiice', 
    site_url: 'www.site.com',
    code_url: 'www.example.com',
    tasks: []
  ) }
  let(:serializer) { described_class.new(project, root: false) }
  
  it "serializes a project without tasks" do
    serializer.to_json.should == {
      id: project.id.to_s, 
      title: 'Cool proj', 
      description: 'Niiice',
      site_url: 'www.site.com',
      code_url: 'www.example.com'
    }.to_json
  end
end