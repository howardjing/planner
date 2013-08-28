require 'spec_helper'

describe Project do

  let(:project) { Project.new }
  
  it "has a unique title" do
    Project.create! title: 'Sup bro'

    invalid_project = Project.new(title: 'Sup bro')
    invalid_project.valid?.should be_false
    invalid_project.errors.include?(:title).should be_true

    valid_project = Project.new(title: 'sup bro')
    valid_project.valid?.should be_true
  end

end