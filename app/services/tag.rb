module Tag

  # Responsible for autocompleting tags. Right now only tasks 
  # are taggable and there is not much data, so implementation
  # is super basic / slow.
  def self.autocomplete(search)
    search = search.to_s
    Task.distinct('tags').find_all { |tag| tag.include? search }.sort
  end

end