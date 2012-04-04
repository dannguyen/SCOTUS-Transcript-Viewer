module PScootus

  # this class contains text cleaning methods
  # but also contains non-OOP-seperated methods that require knowledge of transcript state 

  class ScotusTranscriptLine

    attr_reader :raw_text, :absolute_line_number, :line_number
    
    attr_reader :content_line_number,  :content_text

    # belongs_to
    attr_reader :page, :transcript  
    
    
    delegate :transcript, :to => :page, :prefix=>false
    
    # spaghetti warning: require the knowledge of transcript docstate
    # should modularize this TK
    
    delegate :docstate_start?, :to => :page, :prefix=>false
    delegate :docstate_intro?, :to => :page, :prefix=>false
    delegate :docstate_toc?, :to => :page, :prefix=>false
    delegate :docstate_proceedings?, :to => :page, :prefix=>false
    delegate :docstate_index?, :to => :page, :prefix=>false
    
    
    
    def initialize(rtxt, params={})
      # called from: TranscriptPage
      # pre: rtxt is a string
      #      params should have :page, :argument set
      
      @raw_text = rtxt      
      
      @page = params[:page]
      @line_number = params[:line_number]
      @absolute_line_number = params[:absolute_line_number]
      
      # needed to maintain state: e.g. where in the document are we?
      @transcript = @page.transcript
      
    end
    
      
    
    def process
      
      if self.content?
        @content_line_number = ScotusTranscriptLine.extract_content_number(@raw_text)
        @content_text = ScotusTranscriptLine.strip_content_number(@raw_text)
      else
        
      end
      
    end
    
    
    private
    
    def extract_speaker!
      if @content_text
        @extract_speaker ||= (s = content_text.match(CONTENT_STATEMENT_PATTERNS["speaker"])) ? s[1] : false
      else
        @extract_speaker ||= false
      end
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
    
    
    def first_content_line?
      @content_line_number == 1
    end
    
    def first_raw_line?
      @line_number == 0
    end

=begin TK kill    
    def statement_fragment?
      ## part of a statement
      content? && docstate_proceedings?
    end
    
    def statement_fragment_speaker?
      statement_fragment? && extract_speaker
    end
=end    

    
  end
end


#######################

# class methods


module PScootus
  class ScotusTranscriptLine
    
    BASE_PATTERNS = {
      :content_line_start => /^(?: ?\d|\d{2})(?= {2,})/,                  # the pattern before a numbered line
#      :strict_content_line_start => /^(?: [1-9]|[12]\d)(?= +)/,       # assumes lines are numbered from 1-25
      :empty => /^\s*$/  ,                                              # blank line
      :meta_intro_header =>/OFFICIAL TRANSCRIPT/
    }
    
    ## assumes that content_line_start has been matched and stripped
    ##  and that we're in a dialogue section
    CONTENT_STATEMENT_PATTERNS = {
      :intro_line => /IN THE SUPREME COURT OF THE UNITED STATES/,
      :toc_header => /C O N T E N T S/,
      :proceedings_header => /P R O C E E D I N G S/,
      :speaker => /^\s/     
    }
    
    NON_CONTENT_PATTERNS = {
      :official_tagline => /^ *(?:Official(?: - Subject to Final Review)?|OFFICIAL TRANSCRIPT|CERTIFICATION) *$/,
    #  :reporter_meta => /Alderson Reporting Company/,
      :page_number => /\s{8,}(?:Page *)?(\d{1,3})\s*$/
    }
    
    
    ALL_PATTERNS = BASE_PATTERNS.merge(CONTENT_STATEMENT_PATTERNS).merge(NON_CONTENT_PATTERNS)
    
    # this could be DRYer
    BASE_PATTERNS.each_pair do |patt, pattex|
      define_method("matches_#{patt}?".to_sym) do 
        self.raw_text =~ pattex ? true : false
      end      
    end
    
    CONTENT_STATEMENT_PATTERNS.each_pair do |patt, pattex|
      define_method("matches_#{patt}?".to_sym) do 
        self.content_text =~ pattex ? true : false
      end      
    end
    
    NON_CONTENT_PATTERNS.each_pair do |patt, pattex|
      define_method("matches_#{patt}?".to_sym) do 
        self.raw_text =~ pattex ? true : false
      end      
    end
    
    def self.strip_content_number(line)
      # pre: 
      #   line is a string with a content number
      # post:
      #   returns a version of the string with the leading content number removed
      #   raises ParseUnexpected if line doesn't match :content_line_start
            
      if x = self.extract_content_number(line)
        return line.sub(x.to_s, '')
      else
        raise ParseUnexpected, "Tried to strip a non-content line: #{line}"
      end
    end
    
    def self.extract_content_number(line)
      # pre: 
      #     line is a string
      #     expects that the regex contains a string of digits, possibly pre-padded with space
      if x = line.match(BASE_PATTERNS[:content_line_start])
        return x[0].to_i
      else
        return nil
      end
    end
    
    
  
  end
end
