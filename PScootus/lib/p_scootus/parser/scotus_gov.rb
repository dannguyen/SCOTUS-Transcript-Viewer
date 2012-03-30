require 'nokogiri'
require 'restclient'
require 'open-uri'
require 'uri'


module PScootus
   
   module Parser
     
     module ScotusGov
      
     
        def self.parse_transcripts
          PScootus::Local.get_transcript_text_dirs.each do |tdirname|
            self._parse_transcript(tdirname)
          end
        end
        
        def self._parse_transcript(dirname)
          # dirname is a directory corresponding to transcript pages
          base_tname = File.basename(dirname)
          

          
          pagenames = PScootus::Local.get_transcript_textfile_names(base_tname)
          pagenames.each do |pagename|
            self._parse_page(pagename)
          end
          
          parsefile_name = File.join( PScootus::Local::DIRS[:scotus][:parsed], base_tname ) +'.json'
          
          
          
          
        end
        
        def self._parse_page(pagename)
          # fname is a page's textfile name
          puts "\t#{pagename}"
        end
     
    
        
     
     end
   end   
end

