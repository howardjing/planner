class Task::WithProjectSerializer < TaskSerializer
  has_one :project
end