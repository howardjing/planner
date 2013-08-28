require 'spec_helper'

describe TaskSerializer do
  let(:task) { Task.new title: 'cool task', description: 'task description' }
  let(:serializer) { described_class.new task, root: false }
  
  it "serializes the task" do
    serializer.to_json.should == {
      id: task.id.to_s,
      title: 'cool task',
      description: 'task description',
      status: :not_started
    }.to_json
  end
end