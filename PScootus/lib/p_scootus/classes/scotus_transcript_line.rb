module PScootus

  # this class contains text cleaning methods
  # but also contains non-OOP-seperated methods that require knowledge of transcript state 

  class ScotusTranscriptLine

    attr_reader :clean_text, :raw_text, :absolute_line_number, :content_line_number
    attr_reader :page, :transcript  # belongs_to
    
    # private: @content_text
    
    delegate :doc_intro?, :to => :page, :prefix=>false
    delegate :doc_toc?, :to => :page, :prefix=>false
    delegate :doc_proceedings?, :to => :page, :prefix=>false
    delegate :doc_index?, :to => :page, :prefix=>false
    
    delegate :transcript, :to => :page, :prefix=>false
    
    
    def initialize(rtxt, params={})
      # called from TranscriptPage
      
      # rtxt is a string
      # params should have :page, :argument set
      @raw_text = rtxt      
      
      @page = params[:page]
      
      # needed to maintain state: e.g. where in the document are we?
      @transcript = @page.transcript
      
    end
    
    def category
      
    end
    
    def determine_content
      # content? is true, so strip down and determine type
      
      # do content_text
    end
    
    def determine_speech
      # speech? is true
    end
    
    
    def process
      @clean_text = @raw_text
    end
    
    
    private
    
    def extract_speaker
      if content_text
        @extract_speaker ||= (s = content_text.match(CONTENT_STATEMENT_PATTERNS["speaker"])) ? s[1] : false
      else
        @extract_speaker ||= false
      end
    end
    
    def content_text
      @content_text ||= (content? ? self.strip_content_number(@raw_text) : false)
    end
    
      
  end
end




#######################

## flags

module PScootus
  class ScotusTranscriptLine
   
    def content?
      @is_content ||=  (@raw_text =~ BASE_PATTERNS[:content_line_start] ? true : false)
    end

    def empty?
      @is_empty ||= (@raw_text =~ BASE_PATTERNS[:strict_content_line_start]) ? true : false
    end   
    
    
    def statement_fragment?
      ## part of a statement
      content? && doc_proceedings?
    end
    
    def statement_fragment_speaker?
      statement_fragment? && extract_speaker
    end

    
  end
end


#######################

# class methods


module PScootus
  class ScotusTranscriptLine
    
    BASE_PATTERNS = {
      :content_line_start => /^(?: \d|\d{2})(?= +)/,                  # the pattern before a numbered line
      :strict_content_line_start => /^(?: [1-9]|[12]\d)(?= +)/,       # assumes lines are numbered from 1-25
      :empty => /^\s*$/                                                # blank line
    }
    
    ## assumes that content_line_start has been matched and stripped
    ##  and that we're in a dialogue section
    CONTENT_STATEMENT_PATTERNS = {
      :speaker => /^\s/,
      
    }
    
    NON_CONTENT_PATTERNS = {
      :empty    =>    BASE_PATTERNS[:empty],
      :reporter_meta => /Alderson Reporting Company|Official - Subject to Final/,
      :page_number => /\s{8,}(\d{1,3})\s*$/
    }
    
    def strip_content_number(line)
      # returns a version of the string with the leading content number removed
      # raises ParseUnexpected if line doesn't match :content_line_start
      
      if mt = line.match(BASE_PATTERNS[:content_line_start])
        return line.sub(mt[0], '')
      else
        raise ParseUnexpected, "Tried to strip a non-content line: #{line}"
      end
    end
    
    
  
  end
end
