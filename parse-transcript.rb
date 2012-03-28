require 'rubygems'
require 'fileutils'
require 'json'

DIR_DATA = 'data-hold'
DIR_TRANSCRIPTS = DIR_DATA + '/transcripts'
SCOTUS_JUSTICES_JS = JSON.parse(File.open(File.join(DIR_DATA,'scotus.js')).read)

PAGE_PATTERNS = [
  ['empty', /^ *$/],
  ['page_number', /^ {5,}\d+ *&/] ,
  ['empty_content_line', /^(?: \d|\d{2})\s*$/],
  ['content_line' , /^(?: \d|\d{2})\b/],  
  ['page_break' , /Official - Subject to Final Review/]
]

LINE_PATTERNS = {
  'speaker' => /^([A-Z '\.\-]+): +/,
  'person_intro' => /^[A-Z][A-Z\. \-',]+/,
  'proceedings' => /P R O C E E D I N G S/,
  'appearances' => /APPEARANCES:/,
  'contents'=>/C O N T E N T S/,
  'section_break'=>/ARGUMENT OF|\(Whereupon, /,
}

PAGE_STATUS = {
  'page_number'=>0,
  'line_number'=>0,
  'total_line_number'=>0,
}


def content_line_type(str)
    (idx = PAGE_PATTERNS.index{|r| str =~ r[1]}) ? PAGE_PATTERNS[idx][0] : 'none'
end

def content_line_cleaner(str)
  # strips leading line number
  # and leading/trailing whitespace
  # and collapses consecutive whitespace
  
  str.sub(/^ *\d+ +/, '').gsub(/ {2,}/, ' ').strip  
end


def process_line_and_get_type(str)
  typ = content_line_type(str)
  PAGE_STATUS['total_line_number'] += 1

  case typ
  when 'page_break'
    PAGE_STATUS['page_number'] += 1
    PAGE_STATUS['line_number'] = 0
  when 'content_line'
    PAGE_STATUS['line_number'] += 1
  end
  
  return typ
end


transcripts = Dir.glob("#{DIR_TRANSCRIPTS}/*.txt")
case_filenames = transcripts.map{|f| File.basename(f, '.txt').match(/.+?(?=\d{4}-\d{2}-\d{2}$)/)[0] }.uniq

puts "There are #{case_filenames.length} case names"
puts "There are #{transcripts.length} transcripts"



case_filenames.each do |case_filename|
  
  # collect cases
  case_code, case_name = File.basename(case_filename, '.txt').split('--')
  case_obj = {
    'case_code' => case_code,
    'case_name' => case_name,
    'hearings' => [],
    'people' => SCOTUS_JUSTICES_JS
  }
  
  
  # collect transcripts and group them by case name/code
  transcripts.select{|_t| File.basename(_t) =~ /#{case_code}--#{case_name}/ }.each do |t_filename|

    hearing = {'hearing_date' => File.basename(t_filename, '.txt').split('--')[-1] }
    
    speeches = []
    current_speech = nil
    
    doc = File.open(t_filename)

    ## get meta information
    while (file_line = doc.readline.chomp) && !(file_line =~ /#{LINE_PATTERNS['appearances']}/)
      line_type = process_line_and_get_type(file_line)
      if line_type == 'content_line'      
      end
    end
    # done with meta
  
  
    ## get people
    people = []
    person = nil
    while (file_line = doc.readline.chomp) && !(file_line =~ /#{LINE_PATTERNS['contents']}/)
       line_type = process_line_and_get_type(file_line)
       if line_type == 'content_line'
         file_line = content_line_cleaner(file_line)
         if file_line =~ LINE_PATTERNS['person_intro']
           person = {'name'=>file_line, 'key_name'=>file_line, 'category'=> 'Someone', 'description'=>[]}
           people <<  person
         else
           person['description'] << file_line if person
         end
       end
    end
    
    # fill out each person's category based on description
    people.each do |person|
      person['description'] = person['description'].join(' ')
      
      if person['description'] =~ /Petitioner/
        person['party'] = 'Petitioner'
      elsif person['description'] =~ /Respondent/
        person['party'] = 'Respondent'
      elsif person['description'] =~ /amicus curiae/i
        person['party'] = 'Amicus curaie'
      else
        person['party'] = 'Unknown'
      end
      
       case_obj['people'][person['key_name']] = person
    end
    
    
  
    # skip everything until proceedings section
    while !(file_line =~ /#{LINE_PATTERNS['proceedings']}/)
      file_line = doc.readline.chomp
      process_line_and_get_type(file_line)
      # do nothing
    end
  
  
  
    # Processing the proceedings
  
  
    puts "\n****\nProcessing proceedings\n****\n"

    while (file_line = doc.readline.chomp) && !doc.eof?    
      line_type = process_line_and_get_type(file_line)
    
      case line_type
      when 'content_line'
      
        file_line = content_line_cleaner(file_line)
      
        if file_line =~ LINE_PATTERNS['section_break']
          # push current speech onto list
          current_speech = nil
        elsif speaker = file_line.match(LINE_PATTERNS['speaker'])
          # push current speech onto list
          # new speaker here  
          speaker_name = speaker[1]
          if speaker_name =~ /JUSTICE/
            speaker_cat = 'SCOTUS'
            speaker_key = speaker_name.split(/JUSTICE/,2)[-1].strip
          else
            speaker_key = speaker_name.match(/\w+$/)[0]
            speaker_cat = "Someone"
          end
          
          person_object = case_obj['people'].map.select{|_o| _o[1]['category'] == speaker_cat && _o[0] =~ /#{speaker_key}/  }
          
          raise "Person object length is #{person_object.length}: #{person_object}" if person_object.length != 1
          person_key = person_object[0][0]

          current_speech = {'speaker_cat'=>speaker_cat, 'speaker_key'=>person_key, 'lines'=>[]}        
          speeches << current_speech
          
          # Remove speaker title from the line
          file_line = file_line.sub(LINE_PATTERNS['speaker'], '')

        end
      
        if current_speech
          current_speech['lines'] << {'content' => file_line, 'line_number'=>PAGE_STATUS['line_number'], 'page_number'=>PAGE_STATUS['page_number']}
        end
    
      else
      
      end
    
    end  
    # end of file
  

    # concatenate all lines of speech
    speeches.each do |speech|
      first_line = speech['lines'][0]
      last_line = speech['lines'][-1]
      text = speech['lines'].map{|s| s['content']}.join(" ")
      speech.merge!({
        'text'=>text,
        'word_count'=>text.scan(/\S*\w+\S*/).length,
        'start_position'=>{'page'=>first_line['page_number'], 'line'=>first_line['line_number']},
        'end_position'=>{'page'=>last_line['page_number'], 'line'=>last_line['line_number']}
      })
    
      speech.delete('lines')
    
    #  puts "\n\n---\n#{speech['speaker']}\n"
     # puts "From #{speech['start_position']['page']}:#{speech['start_position']['line']} to #{speech['end_position']['page']}:#{speech['end_position']['line']}"
    #  puts speech['text']
    end
    
    hearing['speeches'] = speeches
    case_obj['hearings'] << hearing
    # end of transcript
    
  end
  # end of transcript group

  
  output_fname = File.join(DIR_TRANSCRIPTS, "#{case_filename}.js")
  File.open(output_fname, 'w'){|w| w.write(JSON.pretty_generate(case_obj))}
  
end
