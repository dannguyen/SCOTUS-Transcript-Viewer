module PScootus
  class ScotusTranscript
    DOCSTATES = [
      :start, :intro, :toc, :proceedings, :index, :end
    ]
    
    DOCSTATES.each do |dstate|
      define_method("docstate_#{dstate}?".to_sym) do
        @current_docstate == dstate
      end
    end
    
    # supplied
    attr_reader :directory, :uid
    
    # derived
    attr_reader :page_filenames, :current_docstate

    # belongs_to
    attr_reader :argument 
    
    
    def initialize(fdir, params={})
    # fdir is transcripts directory with textfiles per page name
      @directory = fdir
      @uid = params[:uid]
      @current_docstate = DOCSTATES.first
      
      @page_filenames = PScootus::Local.get_transcript_page_filenames(@directory)
      
      
      puts "Transcript#Initialize  for #{@uid}, \t #{page_filenames.length} pages"
      
    end
    
    def process
      # called from: ScotusArgument
      # pre: @page_filenames is populated
      # post: populates array of ScotusTranscriptPages 
      
      ## TK todo: maintain state for each page
      
      # __current_docstate = __
      puts "Transcript#process\n"
      @page_filenames.each do |tname|
        page_number = tname.split(PScootus::Converter::PAGES_DELIMITER)[-1].to_i
        
        rlines = File.open(tname){|f| f.readlines.map{|x| x.chomp}}
        page = PScootus::ScotusTranscriptPage.new(rlines, {
          :page_number=>page_number,
          :transcript=>self
        })
        
        puts "Current state: #{@current_docstate}"

        # page.lines, page.content_lines is set
        page.process


        # first check to see if page has content
        if !page.has_content?
          puts "Page #{page_number} has no content"
          next
        end
        
        
        # now read each line
        puts "Back to Transcript#process, line by line: #{page.lines.length} lines"
        page.lines.each do |line|
        
          if line.first_raw_line?
            puts "First raw line: #{line.raw_text}"
          end
          
          if line.first_content_line?
            puts "First content line: #{line.raw_text}"
          end
          ## for first line number, there may be a state shift  
          
        end


        
      end      
    end

    private
    
    # poor man's state machine
    
    def move_to_next_docstate(dsym)
      # dsym 
      if(dsym == self.next_docstate)
        self.move_docstate
      else
        raise ParseUnexpected, "Tried to move to invalid docstate: #{@current_docstate} >> #{dsym}"        
      end
    end
    
    def move_docstate
      @current_docstate = self.next_docstate
    end

    def next_docstate
      if(i = DOCSTATES.index(@current_docstate) )
        d = DOCSTATES[i+1]
      else
        raise ParseUnexpected, "DocState problem: #{@current_docstate}"
      end
      return d
    end
    
    
  end
end