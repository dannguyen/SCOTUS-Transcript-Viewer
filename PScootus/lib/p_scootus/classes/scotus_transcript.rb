module PScootus
  class ScotusTranscript
    
    attr_reader :directory, :page_filenames, :uid
    attr_reader :argument # belongs_to
    
    
    def initialize(fdir, params={})
    # fdir is transcripts directory with textfiles per page name
      @directory = fdir
      @uid = params[:uid]
      @page_filenames = PScootus::Local.get_transcript_page_filenames(@directory)
      
      puts "Transcript#Initialize  for #{@uid}, \t #{page_filenames.length} pages"
      
    end
    
    def process
      # called from: ScotusArgument
      # pre: @page_filenames is populated
      # post: populates array of ScotusTranscriptPages 
      
      ## TK todo: maintain state for each page
      
      # __current_state = __
      puts "Transcript#process\n"
      @page_filenames.each do |tname|
        page_number = tname.split(PScootus::Converter::PAGES_DELIMITER)[-1].to_i
        
        rlines = File.open(tname){|f| f.readlines.map{|x| x.chomp}}
        page = PScootus::ScotusTranscriptPage.new(rlines, {
          :page_number=>page_number,
          :transcript=>self
        })
        
        page.process
      end      
      
      
    end
    
    
  end
end