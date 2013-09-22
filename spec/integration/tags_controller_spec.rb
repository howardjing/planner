require 'spec_helper'

describe TagsController do

  let(:project) { Project.create! title: 'stuff' }
  def create_task(title, tags)
    Task.create! title: title, tags: tags, project: project
  end

  describe "GET /tags.json" do
    before do
      create_task 'mytask', ['one', 'two']
    end
    it "retrieves tags containing the search" do
      get '/tags.json?search=on'
      response.body.should == ['one'].to_s
    end
  end
end