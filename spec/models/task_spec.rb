require 'spec_helper'

describe Task do
  let(:valid_task) { Task.new title: 'proj', project: Project.new }
  let(:proj1) { Project.create! title: 'Cool project' }
  let(:proj2) { Project.create! title: 'Lame project' }

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
  
end