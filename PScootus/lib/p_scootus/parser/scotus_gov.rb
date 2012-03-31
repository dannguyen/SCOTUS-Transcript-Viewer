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
          argument = PScootus::ScotusArgument.new(dirname)  
          
          # build argument
          argument.build
          
          ## create json
          parsefile_name = File.join( PScootus::Local::DIRS[:scotus][:parsed], argument.uid ) +'.json'
          
        
        end
        
        def self._parse_page(pagename)
          # fname is a page's textfile name
          puts "\t#{pagename}"
        end
     
    
        
     
     end
   end   
end

