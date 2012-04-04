require 'state_machine'

module PScootus
  class ScotusTranscript
    
    # supplied
    attr_reader :directory, :uid

    # derived
    attr_reader :page_filenames, :appearances, :arguments

    # belongs_to
    attr_reader :scotus_case 
    
    # TK remove this
    attr_reader :current_docstate
    
    # meta matter
    attr_reader :cases, :case_location, :case_date, :case_start_time
    attr_reader :people , :arguments
    
    DOCSTATES = [
      :start, :intro, :toc, :proceedings, :index, :end
    ]
    
    # deprecate this
      DOCSTATES.each do |dstate|
        define_method("docstate_#{dstate}?".to_sym) do
          @current_docstate == dstate
        end
      end


    
    PAGESTATES ={
      # get case numbers, people w/parties, start_time, date
      
      :intro => [
          :first_line,
          :cases, # petitioner/appellant v. respondent, and case number
          :location, # Washington, D.C.
          :date, # day, month dd, yyyy
          :narrative, # the above-entitled matter...at h:mm p.m.
          :appearances,
          :end
        ],
        
      # get arguments and the line to be looking for  
      :toc => [
        :first_line,
          :argument_title,
          :arguer_name,
          :on_behalf,
          :argument_end # may be same line as behalf
        
      ]    }
    
    
  
    
    state_machine :intro_page, :initial => :start do
      event :reached_first_line do
        transition :start => :first_line
      end
      
      event :reached_cases do
        transition :first_line => :cases
      end

      event :reached_location do
        transition :cases => :location
      end

      event :reached_date do
        transition :location => :date
      end

      event :reached_narrative do
        transition :date => :narrative
      end
      
      event :reached_appearances do
        transition :narrative => :appearances
      end
        
    end
    
    state_machine :doc_state, :initial => :start do
      
      after_transition [:start, :optional_meta_intro]=>:intro, :do => :start_process_intro
      after_transition :intro=>:toc, :do => :start_process_toc
      after_transition :toc=>:proceedings, :do => :start_process_proceedings
      
      after_transition [:intro,:toc,:proceedings] =>same, :do => :process_content
      
      event :reached_optional_meta_intro  do
        transition :start => :optional_meta_intro
      end
      
      event :reached_intro do
      # line 1: IN THE SUPREME COURT
        transition [:start, :optional_meta_intro] => :intro
      end
      
      event :reached_toc do
      # line 1: C O N T E N T S
        transition :intro=>:toc
      end
      
      event :reached_proceedings do
        transition :toc=>:proceedings
      end
      
#      event :reached_proceedings_end do
#        transition :proceedings=>:proceedings_end
#      end
      
      event :continue_processing_content do
        transition [:intro, :toc, :proceedings] => same
      end
      
      event :reached_index do
        transition :proceedings => :index
      end
      
      event :reached_end do
        transition :index => :end
      end
      
      event :reached_section_change do
        transition :proceedings => same
      end
      
      
      ### transitions
#      after_transition :on => :reached_toc, :do => :test_intro
        
      ###########
      ## states
      

      
 
    end # end of state_machine declaration
  
   

    
          ###      ###      ###      ###      ###      ###      ###
      ### END OF STATE MACHINE STUFF
      ###      ###      ###      ###      ###      ###      ###    

      
    ### processing steps
    
    def start_process_intro
      # called upon event reached_intro
      
      puts "Processing intro"
      process_content
    end

    def start_process_toc
      puts "Processing toc"
      process_content
    end
    
    def start_process_proceedings
      puts "!!\t\t\tprocess_proceedings"
      process_content
    end
    
    def process_content
      # pre:  start_process_x MUST have occurred for the state;
      #        valid states are : intro, toc, proceedings
      #        thus, necessary variables for intro, toc, and proceedings have been initialized
      puts "** \t\tprocess content!!"
      
      
      
      case doc_state
      when 'intro'
        
        
        
      when 'toc'
        
      when 'proceedings'
        
      end
         
      
    end







    def initialize(fdir, params={})
    # fdir is transcripts directory with textfiles per page name
      @directory = fdir
      @uid = params[:uid]
      @current_docstate = DOCSTATES.first
      
      @cases = [] # includes hashes of {:party_a, :party_b, :party_a_desc, :party_b_desc, case_number}
                  # for rare cases of multiple cases
                  
      @people =            
                  
      
      attr_reader :cases, :case_location, :case_date, :case_start_time
       attr_reader :people , :arguments
      
      
      @page_filenames = PScootus::Local.get_transcript_page_filenames(@directory)
      puts "Transcript#Initialize  for #{@uid}, \t #{page_filenames.length} pages"
      super()
    end
    
    
    
    def process
      # called from: ScotusCase
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
        
        puts "Current state: #{self.doc_state}"

        # page.lines, page.content_lines is set
        page.process

=begin
        # first check to see if page has content
        if !page.has_content?
          puts "Page #{page_number} has no content"
          next
        end
        
       # page contains content, so check validations
        if !page.validated?
          raise ParseUnexpected, "Failed validations: #{page.invalidations.join(' ')}"
        end
=end        
        
        # now read each line
        puts "** Transcript#process, line by line: #{page.lines.length} lines"
        
        
        if self.doc_state == "index"
          puts "we're done"
        else
            if page.is_meta_introduction?
              self.reached_optional_meta_intro!
            elsif page.is_introduction? 
              self.reached_intro!
            elsif page.is_toc?
              self.reached_toc!
            elsif page.is_proceedings_start?
              self.reached_proceedings!
         #   elsif page.is_section_start?
        #      self.reached_section_change!
        #    elsif page.is_proceedings_end?
        #      self.reached_proceedings_end!
            elsif page.is_index_page?
              self.reached_index!
            elsif page.has_content?
              # in cases where intro, toc, or proceedings continues for more than one page
              self.continue_processing_content!
            else
              raise "What the"
#              self.continue_proceedings!
            end
        end
        
        

        
      end      
    end




=begin
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
=end    
    
  end
end


