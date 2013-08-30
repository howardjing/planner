require 'spec_helper'

describe User do
  let(:user) { User.new(
    username: 'hello', 
    email: 'example@email.com', 
    password: 'aaaaaaaa', 
    password_confirmation: 'aaaaaaaa' 
  )}

  def should_validate_presence_of(user, attribute)
    user.send("#{attribute}=", '')
    user.valid?.should be_false
    user.errors.include?(attribute).should be_true

    user.send("#{attribute}=", 'bob')
    user.valid?.should be_true
  end

  def should_validate_uniqueness_of(user, attribute)
    expect {
      described_class.new("#{attribute}" => user.send(attribute), password_digest: 'bob').save!(validate: false)
    }.to change { user.valid? }.from(true).to(false)
    user.errors.include?(attribute).should be_true
  end

  it { should_validate_presence_of(user, :username) }
  it { should_validate_presence_of(user, :email) }

  it { should_validate_uniqueness_of(user, :username) }
  it { should_validate_uniqueness_of(user, :email) }

  it "validates length of password, minimum: 8" do
    expect {
      user.password = 'a' * 7
    }.to change { user.valid? }.from(true).to(false)

    expect {
      user.password = 'a' * 8
    }.to change { user.valid? }.from(false).to(true)
  end

  it "downcases username and email" do
    user = User.new(username: 'HELLO', email: 'WORLD')
    user.username.should == 'hello'
    user.email.should == 'world'
  end

  describe ".find_by_login(login)" do
    before do
      user.save!
    end
    it "returns the user when login matches the user's username or email" do
      described_class.find_by_login('HELLO').should == user
      described_class.find_by_login('EXAMPLE@EMAIL.COM').should == user

      described_class.find_by_login('hello').should == user
      described_class.find_by_login('example@email.com').should == user

      described_class.find_by_login('aaa').should == nil
      described_class.find_by_login('eee@eee.com').should == nil
    end
  end

  describe "#authenticate(password)" do
    it "returns the user when true, false otherwise" do
      user.authenticate('aaaaaaaa').should == user
      user.authenticate('bob').should be_false
    end
  end
end