module Jekyll
  module TruncateHtmlTextFilter
    def truncate_html_text(html, length = 150)
      return '' if html.nil? || html.empty?
      
      # Remove HTML tags using regex
      plain_text = html.gsub(/<[^>]*>/, '')
      
      # Decode common HTML entities
      plain_text = plain_text.gsub(/&amp;/, '&')
                            .gsub(/&lt;/, '<')
                            .gsub(/&gt;/, '>')
                            .gsub(/&quot;/, '"')
                            .gsub(/&#39;|&apos;/, "'")
                            .gsub(/&nbsp;/, ' ')
      
      # Remove extra whitespace and newlines
      plain_text = plain_text.gsub(/\s+/, ' ').strip
      
      # Truncate to specified length
      if plain_text.length > length
        truncated = plain_text[0, length].strip
        # Try to break at a word boundary
        last_space = truncated.rindex(' ')
        if last_space && last_space > length * 0.8
          truncated = truncated[0, last_space]
        end
        truncated + '...'
      else
        plain_text
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::TruncateHtmlTextFilter)
