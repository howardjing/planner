class Crawler::AjaxInterceptor

  # it's a google crawler request 
  # if one of the query string keys is '_escaped_fragment_'
  # https://developers.google.com/webmasters/ajax-crawling/docs/getting-started
  CRAWLER_REQUEST_KEY = '_escaped_fragment_'
  HASHBANG            = '#!'

  def initialize(app)
    @app = app
  end

  def call(env)
    request = Rack::Request.new(env)
    params = request.params
    return @app.call(env) unless ajax_crawler_request?(params.keys)

    # the actual url that the ajax crawler was trying to reach
    hashbanged_url = translate_url(request.url)

    [200, headers, [snapshot(hashbanged_url)]]
  end

  private

  def ajax_crawler_request?(keys)
    keys.include? CRAWLER_REQUEST_KEY
  end

  def translate_url(crawler_url)
    crawler_url.sub("#{CRAWLER_REQUEST_KEY}=", HASHBANG)
  end

  def headers
    { 'Content-Type' => 'text/html' }
  end

  # take an html snapshot of the angular page
  def snapshot(url)
    `phantomjs #{File.dirname(__FILE__)}/take_snapshot.js '#{url}'`
  end
end