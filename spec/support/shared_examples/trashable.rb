shared_examples_for "a trashable" do
  let(:trashable) { described_class.new }

  it "is not in trash by default" do
    trashable.in_trash?.should be_false
  end

  describe "#trash" do
    before do
      trashable.in_trash = false
    end
    it "puts the trashable into the trash" do
      expect {
        trashable.trash
      }.to change { trashable.in_trash? }.from(false).to(true)
    end
  end

  describe "#untrash" do
    before do
      trashable.in_trash = true
    end
    it "removes the trashable from the trash" do
      expect {
        trashable.untrash
      }.to change { trashable.in_trash? }.from(true).to(false)
    end
  end
end