module PScootus
   
   module Converter
     
     PAGES_DELIMITER = '___'
     
     def self.convert_transcripts_to_text
      pdfnames = PScootus::Local.get_transcript_pdf_names
       puts pdfnames.length
       pdfnames.each do |pname|
         PScootus::Converter._transcript_to_text(pname)
       end       
     end
     
     
     def self._transcript_to_text(fname)
       
       base_name = File.basename(fname, '.pdf')
       txt_dir =  File.join( PScootus::Local::DIRS[:scotus][:text], base_name)

       # first, create dir for multiple pages       
       FileUtils.makedirs(txt_dir)
       
       # use pdftk to generate report
       report_fname = File.join(txt_dir, 'report.txt')
       cmd = "pdftk #{ESCAPE[fname]} dump_data output #{report_fname}"
       result = `#{cmd}`.chomp
       raise ConversionFailed, result if !File.exists?(report_fname)

       # read number of pages
       number_of_pages = open(report_fname){|f| f.read.match(/NumberOfPages: (\d+)/)[1]}.to_i
       raise ConversionFailed, "Could not find pagenumber" if !(number_of_pages > 0)
       FileUtils.rm(report_fname) if File.exists?(report_fname)
       
       
       puts "Number of pges found: #{number_of_pages}"
       
       local_base_fname = File.join(txt_dir,base_name)
       
       number_of_pages.times do |_p|
         pnum = _p + 1
         cmd = ["pdftotext -layout #{fname} -f #{pnum} -l #{pnum} #{local_base_fname}", "#{'%04d' % pnum}.txt" ].join(PAGES_DELIMITER)
         result = `#{cmd}`.chomp
         raise ConversionFailed, result if $? != 0
       end
  
     end
     
   
   end
   
end

