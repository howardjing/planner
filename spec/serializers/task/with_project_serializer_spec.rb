require 'spec_helper'

describe Task::WithProjectSerializer do
  let(:project) { Project.new title: 'my proj', description: 'my proj desc' }
  let(:task) { project.tasks.build title: 'my task', description: 'my task desc' }
  let(:serializer) { described_class.new(task, root: false) }

  it "serializes the task with the project" do
    serializer.to_json.should == {
      id: task.id.to_s,
      title: 'my task',
      description: 'my task desc',
      status: :not_started,
      tags: [],
      project: {
        id: project.id.to_s,
        title: 'my proj',
        description: 'my proj desc'
      }
    }.to_json
  end
end