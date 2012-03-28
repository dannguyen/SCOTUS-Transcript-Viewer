## scrape bios
## this produces a json that you can just paste into whatever file you want

require 'rubygems'
require 'nokogiri'
require 'open-uri'
require 'json'
require 'chronic'


#DATA_DIR = 'data-hold'
BIOS_URL = 'http://www.supremecourt.gov/about/biographies.aspx'

judges = {}

Nokogiri::HTML(open(BIOS_URL)).css('.bio').each do |bio|
  
  obj = {'party'=>'Justice' }
  nametxt = bio.css('.bioname').text
  next if nametxt =~ /Retired/i

  nametxt = nametxt.split(',').map{|t| t.strip}
  obj['position'] = nametxt.pop
  obj['suffix'] = nametxt.pop if nametxt.length > 1

  nametxt = nametxt.join.split(' ')
  
  obj['last_name'] = nametxt.pop
  
  # ...close enough
  obj['first_name'], obj['middle_name'] = nametxt
  
  ### parse body
  txt = bio.text
  
  if bd = txt.match(/was born .+?, ([A-Z][a-z]+ \d+, \d+)/)
    obj['birth_date'] = Chronic.parse(bd[1]).strftime("%Y-%m-%d")
  end

  # this is a little loose, but seems to work
  if nd = txt.match(/([A-Z][a-z]+ \d+, \d+)\.\s*$/)
    obj['start_date'] = Chronic.parse(nd[1]).strftime("%Y-%m-%d")
  end
  
  keyname = obj['last_name'].upcase
  judges[keyname] = obj.merge({'category'=>'SCOTUS', 'key_name'=>keyname})
  
end

puts judges.to_json