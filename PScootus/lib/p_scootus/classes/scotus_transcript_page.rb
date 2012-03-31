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
    
    # params should include :argument, :page_number
      @raw_lines = raw_line_array
      @transcript = params[:transcript]
      @page_number = params[:page_number]
      
      @lines = []
      @content_lines = []
      
      puts "\nPage#initialize, #{@page_number}:\t#{self.raw_line_count} raw lines"
      
    end
    
    
    # check for expected entities, such as page number
    
    def process
      # called from: ScotusTranscript
      # pre: raw_lines has been populated
      # post: @lines, @content_lines is populated with ScotusTranscriptLines
      
      @raw_lines.each_with_index do |rline, l_num|  
        line = PScootus::ScotusTranscriptLine.new(rline, {
          :line_number=>l_num, :page=>self
        })  
              
        line.process
        @lines << line
        @content_lines << line if line.content?
      end      
      
      puts "* Page#process, \t#{self.content_line_count} content lines"
      
    end
    
    
    
    
  end
end



module PScootus
  class ScotusTranscriptPage
    
    def has_content?
      content_line_count > 0
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
