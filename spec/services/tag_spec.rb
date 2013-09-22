require 'spec_helper'

describe Tag do
  let(:project) { Project.create! title: 'stuff' }
  
  def create_task(title, tags)
    Task.create! title: title, tags: tags, project: project
  end

  describe "#autocomplete(search)" do
    before do
      create_task "cure polio", ['abra', 'kadabra', 'alakazam']
      create_task "sup bro", ['kadabra', 'cadaver']
    end

    it "retrieves all tags containing the search query sorted alphabetically" do
      everything = Tag.autocomplete('')
      everything.should == ['abra', 'alakazam', 'cadaver', 'kadabra']

      Tag.autocomplete(nil).should == everything
      Tag.autocomplete('da').should == ['cadaver', 'kadabra']
    end
  end
  
end