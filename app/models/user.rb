class User
  include Mongoid::Document
  include ActiveModel::SecurePassword
  has_secure_password

  field :username, type: String
  field :email, type: String
  field :first_name, type: String
  field :last_name, type: String
  field :password_digest, type: String
  index({ username: 1 }, { unique: true })
  index({ email: 1 }, { unique: true })

  validates_presence_of :username
  validates_presence_of :email
  validates_uniqueness_of :username
  validates_uniqueness_of :email, with: /@/
  validates_length_of :password, minimum: 8, if: lambda { |m| m.password.present? }

  def self.find_by_login(login)
    normalized_login = login.present? ? login.downcase : ""
    any_of({ username: normalized_login }, { email: normalized_login }).first
  end

  # make all usernames and emails lowercase 
  %w(username email).each do |attribute|
    define_method "#{attribute}=" do |new_attribute|
      if new_attribute.present?
        self[attribute] = new_attribute.downcase
      else
        self[attribute] = ""
      end
    end
  end
end