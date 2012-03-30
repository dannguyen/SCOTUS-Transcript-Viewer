module PScootus
  class ScotusArgument
  
    attr_reader :uid, :petitioner, :respondent, :date, :start_time, :end_time
    attr_reader :original_url, :filename
  
    def initialize(fname, o_url)
      # fname is the name of the text file
      # o_url is the original url
      
      @filename = fname
      @original_url = o_url
      
      @raw_text_lines = open(fname){|f| f.readlines}      
    end
    
    
    def process
      # pre: @raw_text_lines has been populated
      
      @raw_text_lines.each_with_index do |line, actual_line_number|
        
        
        
      end            
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