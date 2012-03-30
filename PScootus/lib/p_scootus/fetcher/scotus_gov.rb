
module PScootus
   
   module Fetcher
     
     module ScotusGov
      
      BASE_URL = 'http://www.supremecourt.gov'
      URLS = {
         :transcripts => File.join(BASE_URL, '/oral_arguments/argument_transcripts.aspx')
      }
     
     
        def self.fetch_transcripts
          puts File.join(URLS[:transcripts])
          page = self.get_transcripts_page
          hrefs = self.get_transcripts_links(page)
          self.download_transcripts(hrefs)
        end
        
        
     
        def self.get_transcripts_page
          RestClient.get(URLS[:transcripts])
        end
        
        def self.get_transcripts_links(html)
          remote_base_dir = File.dirname(URLS[:transcripts])
          Nokogiri::HTML(html).css("div#maincontentbox table tr table a").select{|k| k['href'] =~ /argument_transcripts/}.map{|k| URI.encode(File.join(remote_base_dir, k['href'])) }
        end
        
        def self.download_transcripts(hrefs)
          hrefs.each do |href|
            local_fname = File.join(PScootus::Local::DIRS[:scotus][:transcripts], File.basename(href))
            puts local_fname
            open(href, 'rb'){|rf| File.open(local_fname, 'wb'){|wf| wf.write(rf.read) }}
            sleep rand
          end
        end
        
        
     
     end
   end   
end

