Jekyll::Hooks.register [:pages, :documents], :post_render do |doc|
  next unless doc.output_ext == ".html"
  next if doc.output.include?("site-palette.css")

  baseurl = doc.site.config["baseurl"].to_s
  href = "#{baseurl}/assets/css/site-palette.css"
  tag = %(<link rel="stylesheet" href="#{href}">)

  doc.output = doc.output.sub(%r{</head>}i, "  #{tag}\n</head>")
end
