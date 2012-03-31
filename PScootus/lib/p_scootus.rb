module PScootus
  
  
  ROOT            = File.expand_path(File.dirname(__FILE__) + '/..')
  ESCAPE           = lambda {|x| Shellwords.shellescape(x) }
  
  
  def self.fetch_transcripts    
    PScootus::Fetcher::ScotusGov.fetch_transcripts
  end
  
  def self.convert_transcripts_to_text
    PScootus::Converter.convert_transcripts_to_text
  end
  
  def self.parse_transcripts
    PScootus::Parser.parse_transcripts
  end
  



  
  class FetchFailed < StandardError; end
  class ConversionFailed < StandardError; end
  class ParseFailed < StandardError; end
  class ParseUnexpected < StandardError; end
  
  
  

  
  
  def self.get_uid(str)
    # str is either a regular uid or a directory name or a file name
    str = str.split('/')[-1].sub(/\.(?:pdf_txt)$/, '')
  end
  
  def self.get_transcript_dir(str)
    File.join(Local::DIRS[:scotus][:text], self.get_uid(str))
  end
  
  # for local file retrieval and storage
  
  module Local
    BASE_LOCAL_DIR  = File.join "#{PScootus::ROOT}", 'data-hold'
    DIRS      = {
      :scotus => {
        :transcripts => File.join(BASE_LOCAL_DIR, 'scotus', 'transcripts'),
        :text => File.join(BASE_LOCAL_DIR, 'scotus', 'text'),
        :parsed => File.join(BASE_LOCAL_DIR, 'scotus', 'parse') # contains the parsed documents
      }
    }
    
    DIRS.each_value{|c| c.each_value{|d| FileUtils.makedirs(d)}}
    
    
    
    def self.get_transcript_text_dirs
      # returns array of directory names corresponding to each file
      Dir.glob( "#{DIRS[:scotus][:text]}/*")[0..1] # TK FOR TESTING
    end
    
    def self.get_transcript_page_filenames(kn)
      # returns array of sorted text filenames by page number
      Dir.glob("#{PScootus.get_transcript_dir(kn)}/*.txt").sort_by{|t| t.split(PScootus::Converter::PAGES_DELIMITER)[-1] }
    end
    
    def self.get_transcript_pdf_names
      Dir.glob( "#{DIRS[:scotus][:transcripts]}/*.pdf")
    end
    
    
    
    
  end
  
end

require 'rubygems'
require 'fileutils'
require 'shellwords'
require 'active_support/core_ext'
require "#{PScootus::ROOT}/lib/p_scootus/fetcher"
require "#{PScootus::ROOT}/lib/p_scootus/converter"
require "#{PScootus::ROOT}/lib/p_scootus/parser"

# get classes
Dir.glob("#{PScootus::ROOT}/lib/p_scootus/classes/*", &method(:require))