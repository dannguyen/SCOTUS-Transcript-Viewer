require 'crack'
require 'json'


module PScootus
   
   module Parser
     
     def self.parse_transcripts
       # just an alias
        PScootus::Parser::ScotusGov.parse_transcripts
     end   
   end
   
end

require "#{PScootus::ROOT}/lib/p_scootus/parser/scotus_gov"
