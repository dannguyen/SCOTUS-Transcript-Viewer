module PScootus
  class ScotusArgument
  
    attr_reader :uid, :original_url, :transcript_dir

    # calculated from ScotusTranscript#process
    attr_reader  :petitioner, :respondent, :date, :start_time, :end_time

    # has one
    attr_reader :transcript 
  
    def initialize(_uid, params={})
      # Given a set of transcripts/ as:
      #   transcripts/xx-xxx-xx/xx-xxx-xx____0001.txt
      #   transcripts/xx-xxx-xx/xx-xxx-xx____0002.txt
      
      # _uid accepts either a string for the directory name or just xx-xxx-xx
            
      # o_url is the original url
      
      
      @uid = PScootus.get_uid(_uid)
      @transcript_dir = PScootus.get_transcript_dir(@uid)
      @original_url = params[:original_url]
      
      puts "\n\n****\nArgument#initialize: #{@uid}"
      
      
      @transcript = PScootus::ScotusTranscript.new(@transcript_dir, {:uid=>@uid})
     # @raw_text_lines = open(fname){|f| f.readlines}      
     
    end
    
    
    def build
      ## pre: @transcript has been set
      ## post: @transcript#process called, self attributes set
      
      puts "* In ScotusArgument#build, uid = #{@uid}"
      
      ## should be called "process" instead?
      @transcript.process
      
    end
    
    
  
  
  end


end



#### calculated atttributes

module PScootus
  class ScotusArgument
    
    def case_name
      [@petitioner, @respondent].join(" v. ")
    end
    
  end
end