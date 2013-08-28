require 'spec_helper'

describe Project::WithTasksSerializer do
  let(:project) { Project.new title: 'cool proj', description: 'hey' }

  def build_task(options)
    project.tasks.build(options)
  end

  def serializer(options = {})
    described_class.new(project, { root: false}.merge(options) )
  end

  it "serializes project with tasks" do
    first_task = build_task(title: 'cool task', description: 'woah')
    first_task.save!

    second_task = build_task(title: 'cool task 2', description: 'woah 2')
    second_task.save!


    # serialize all tasks
    serializer.to_json.should == {
      id: project.id.to_s, 
      title: 'cool proj', 
      description: 'hey',
      tasks: [
        # second task serialized first
        { 
          id: second_task.id.to_s,
          title: 'cool task 2',
          description: 'woah 2',
          status: :not_started
        },

        # first task serialized last
        {
          id: first_task.id.to_s,
          title: 'cool task',
          description: 'woah',
          status: :not_started
        }
      ]
    }.to_json

    # only serialize first task
    serializer(limit: 1).to_json.should == {
      id: project.id.to_s, 
      title: 'cool proj', 
      description: 'hey',
      tasks: [
        { 
          id: second_task.id.to_s,
          title: 'cool task 2',
          description: 'woah 2',
          status: :not_started
        },
      ]
    }.to_json
  end
end