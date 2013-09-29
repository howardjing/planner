require 'spec_helper'

describe Project::WithTasksSerializer do
  let(:project) { Project.new title: 'cool proj', description: 'hey' }

  def build_task(options)
    project.tasks.build(options)
  end

  def serializer(options = {})
    described_class.new(project, { root: false }.merge(options) )
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
      site_url: '',
      code_url: '',
      tasks: [
        # second task serialized first
        { 
          id: second_task.id.to_s,
          title: 'cool task 2',
          description: 'woah 2',
          status: :not_started,
          tags: []
        },

        # first task serialized last
        {
          id: first_task.id.to_s,
          title: 'cool task',
          description: 'woah',
          status: :not_started,
          tags: []
        }
      ]
    }.to_json

    # only serialize first task
    serializer(limit: 1).to_json.should == {
      id: project.id.to_s, 
      title: 'cool proj', 
      description: 'hey',
      site_url: '',
      code_url: '',
      tasks: [
        { 
          id: second_task.id.to_s,
          title: 'cool task 2',
          description: 'woah 2',
          status: :not_started,
          tags: []
        },
      ]
    }.to_json
  end

  context "filters" do
    let(:active_task) { project.tasks.create! title: 'active task' }
    let(:trashed_task) { project.tasks.build(title: 'trashed task').tap { |t| t.trash }.tap { |t| t.save! } }
    let(:tagged_task) { project.tasks.create! title: 'tagged task', tags: ['some tag'] }
    before { project.save! }

    def tasks_json(serializer)
      JSON.parse(serializer.to_json)['tasks'].to_json
    end

    it "only includes tasks tagged with 'some tag' when tagged_with: 'some tag'" do
      active_task
      tagged_task

      # when tag is present, only include tasks tagged with 'some tag'
      tasks_json(serializer(tagged_with: 'some tag')).should == [{ 
        id: tagged_task.id.to_s,
        title: 'tagged task',
        description: '',
        status: :not_started,
        tags: ['some tag']
      }].to_json

      # when tag is not present, include everybody
      tasks_json(serializer(tagged_with: '')).should == [{
        id: tagged_task.id.to_s,
        title: 'tagged task',
        description: '',
        status: :not_started,
        tags: ['some tag']
      },
      {
        id: active_task.id.to_s,
        title: 'active task',
        description: '',
        status: :not_started,
        tags: []
      }].to_json
    end

    it "filters out active tasks when trashed: true" do
      active_task
      trashed_task

      tasks_json(serializer(trashed: true)).should == [{
        id: trashed_task.id.to_s,
        title: 'trashed task',
        description: '',
        status: :not_started,
        tags: []
      }].to_json
    end
  end
end