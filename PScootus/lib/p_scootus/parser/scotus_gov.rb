require 'nokogiri'
require 'restclient'
require 'open-uri'
require 'uri'


module PScootus
   module Parser     
     module ScotusGov
      
     
        ### TOP LEVEL to be called by rake
        def self.rake_parse_transcripts
          PScootus::Local.get_transcript_text_dirs.each do |tdirname|
            self._parse_transcript(tdirname)
          end
        end
        #############
        
        
        
        def self._parse_transcript(dirname)
          # dirname is a directory corresponding to transcript pages
        
          # intialize argument
          scotus_case = PScootus::ScotusCase.new(dirname)  
          
          # build argument
          scotus_case.build
          
          ## create json
          parsefile_name = File.join( PScootus::Local::DIRS[:scotus][:parsed], scotus_case.uid ) +'.json'
          
        
        end
        
        def self._parse_page(pagename)
          # fname is a page's textfile name
          puts "\t#{pagename}"
        end
     
    
        
     
     end
   end   
end

