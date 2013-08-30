require 'spec_helper'

describe Task do
  let(:valid_task) { Task.new title: 'proj', project: Project.new }
  let(:proj1) { Project.create! title: 'Cool project' }
  let(:proj2) { Project.create! title: 'Lame project' }

  it_behaves_like "a trashable"
  
  it "has unique title relative to project" do
    proj1.tasks.create!(title: 'learn piano')
    
    # can't use learn piano title in proj1
    invalid_task = proj1.tasks.build(title: 'learn piano')
    invalid_task.valid?.should be_false
    invalid_task.errors.include?(:title).should be_true

    # can use another one though
    valid_task1 = proj1.tasks.build(title: 'learn piano again')
    valid_task1.valid?.should be_true

    # can use learn piano in a different project
    valid_task2 = proj2.tasks.build(title: 'learn piano')
    valid_task2.valid?.should be_true
  end

  it "updates the project's updated_at field after saving" do
    original_time = proj1.updated_at
    proj1.tasks.create!(title: 'new task')
    
    proj1.reload
    proj1.updated_at.should be > original_time
  end

  it "allows :not_started and :completed as valid statuses" do
    expect {
      valid_task.status = :sup_bro
    }.to change { valid_task.valid? }.from(true).to(false)

    expect {
      valid_task.status = :not_started
    }.to change { valid_task.valid? }.from(false).to(true)

    expect {
      valid_task.status = :nope
    }.to change { valid_task.valid? }.from(true).to(false)

    expect {
      valid_task.status = :completed
    }.to change { valid_task.valid? }.from(false).to(true)
  end

  it "has unique tags" do
    valid_task.tags = ['ehllo', 'ehllo', 'hi']
    valid_task.tags.count.should == 2
    %w(ehllo hi).each do |tag|
      valid_task.tags.include?(tag).should be_true
    end
  end

  describe ".tagged_with(tag)" do
    let(:task1) { Task.create! title: 'cool task', tags: ['cool'], project: proj1 }
    let(:task2) { Task.create! title: 'lame task', tags: ['lame'], project: proj1 }
    
    before do
      task1
      task2
    end
    
    it "returns tasks tagged with the given tag" do
      Task.tagged_with('cool').to_a.should == [task1]
      Task.tagged_with('lame').to_a.should == [task2]
    end

    it "returns all tasks when tag is blank" do
      tasks = Task.tagged_with('')
      tasks.count.should == 2
      [task1, task2].each do |t|
        tasks.include?(t).should be_true
      end
    end
  end

end