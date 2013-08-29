require 'spec_helper'

describe Project do

  let(:project) { Project.new }
  
  it_behaves_like "a trashable" 

  it "has a unique title" do
    Project.create! title: 'Sup bro'

    invalid_project = Project.new(title: 'Sup bro')
    invalid_project.valid?.should be_false
    invalid_project.errors.include?(:title).should be_true

    valid_project = Project.new(title: 'sup bro')
    valid_project.valid?.should be_true
  end

  context "scopes" do
    let(:active) { described_class.new(title: 'cool beans', in_trash: false).tap { |t| t.save!(validate: false) } }
    let(:trashed) { described_class.new(title: 'beans cool', in_trash: true).tap { |t| t.save!(validate: false) } }

    before do
      active
      trashed
    end

    describe ".active" do
      it "returns trashables that have not been trashed" do
        described_class.active.to_a.should == [active]
      end
    end
    
    describe ".trashed" do
      it "returns trashables that have been trashed" do
        described_class.trashed.to_a.should == [trashed]
      end
    end
  end

end