module PScootus
  class ScotusTranscriptPage
    
    attr_reader :raw_lines, :page_number
    
    # derived
    attr_reader  :lines, :content_lines

    # belongs_to
    attr_reader :transcript 
    
    # spaghetti warning: require the knowledge of transcript docstate
    delegate :docstate_start?, :to => :transcript, :prefix=>false
    delegate :docstate_intro?, :to => :transcript, :prefix=>false
    delegate :docstate_toc?, :to => :transcript, :prefix=>false
    delegate :docstate_proceedings?, :to => :transcript, :prefix=>false
    delegate :docstate_index?, :to => :transcript, :prefix=>false
    
    
    
    def initialize(raw_line_array, params={})
    # raw_line_array is readlines result from textfile, with line-ending chomped
    
    # params should include :page_number, :transcript
      @raw_lines = raw_line_array
      @transcript = params[:transcript]
      @page_number = params[:page_number]
      
      @is_validated = false
      @lines = []
      @content_lines = []
      
      
      puts "\nPage#initialize, #{@page_number}:\t#{self.raw_line_count} raw lines"
      
      
    end
    
    
    # check for expected entities, such as page number
    
    def process
      # called from: ScotusTranscript
      # pre: raw_lines has been populated
      # post: @lines, @content_lines is populated with ScotusTranscriptLines
      
      # expected entities should also be filled
      
      
      @raw_lines.each_with_index do |rline, l_num|  
        line = PScootus::ScotusTranscriptLine.new(rline, {
          :line_number=>l_num, :page=>self
        })  
              
        line.process
        @lines << line
        @content_lines << line if line.content?
      end      
      
      puts "* Page#process, \t#{self.content_line_count} content lines"
      validate_content! if has_content?
      
    end
    
    
    
    
  end
end



module PScootus
  class ScotusTranscriptPage
    
    def has_content?
      content_line_count > 0
    end
    
    def is_validated?
      @is_validated
    end
    
    
    # docstate checks
    
    def is_introduction?
      @lines[0].matches_official_tagline? &&  @content_lines[0].andand.matches_intro_line?
    end
    
    def is_meta_introduction?
      # only a few transcripts have these
      @lines[0].matches_meta_intro_header?
    end
    
    def is_toc?
      @content_lines[0].andand.matches_toc_header?
    end
    
    def is_proceedings_start?
      @content_lines[0].andand.matches_proceedings_header?
    end
    
    def is_index_page?
      #TK to be made more specific
      !(self.has_content?)
    end
    
    
    
    ### page state checks
    
    def is_proceedings_end?
      @conten
    end


    
    
    def content_line_count
      @content_lines.length
    end
    
    def line_count
      @lines.length
    end
    
    def raw_line_count
      @raw_lines.length
    end
  end
end

# validation methods
module PScootus
  class ScotusTranscriptPage

    # poor man's meta-validation
    VALIDATORS = {
      :has_lines => lambda{ |_p| return _p.lines.length > 0 || false},
      :first_line_is_official_tagline => lambda{|_p| l = _p.lines.first;  l.matches_official_tagline? || _p.lines.first.raw_text}, 
      :last_line_is_blank => lambda{|_p| l = _p.lines.last; return  l.matches_empty? || l.raw_text },
      
      # for content pages
      
      :second_line_is_blank_or_pgnumber => lambda{|_p| l=_p.lines[1]; return (l.matches_empty? || l.matches_page_number?) || l.raw_text }

    }
    
    VALIDATORS.each_pair do |v_meth, v_proc|
      define_method("validate_#{v_meth}".to_sym) do 
        v_proc.call(self)
      end
    end
    
    
    def invalidations
      if @failed_validations.nil?
        return nil 
      else
        @failed_validations
      end
    end
    
    def validated?
      !invalidations.nil? && invalidations.empty?      
    end
    
    private    
    
    def validate_content!
      
      # called by: at the end of process for pages with content
      # post: @failed_validations has been set and populated
         
      @failed_validations = []
      VALIDATORS.each_key do |v_name|
        val = self.send("validate_#{v_name}")
        @failed_validations << [v_name, val] if val != true
      end
    end

  end
end

