# Keep the theme's navigation and search entry without generating a CV page.
module SiteNavigation
  class PdfLink < Jekyll::PageWithoutAFile; end

  class CvPdfNavigation < Jekyll::Generator
    safe true

    def generate(site)
      link = PdfLink.new(site, site.source, "assets/pdf", "Zhenzhi_Tan_Resume-en.pdf")
      link.data.merge!(
        "title" => "CV",
        "description" => "English CV (PDF).",
        "nav" => true,
        "nav_order" => 5,
        "layout" => nil,
        "sitemap" => false,
        "permalink" => "/assets/pdf/Zhenzhi_Tan_Resume-en.pdf"
      )
      site.pages << link
    end
  end
end

# Navigation/search have rendered; only the static PDF should reach the writer.
Jekyll::Hooks.register :site, :post_render do |site|
  site.pages.reject! { |page| page.is_a?(SiteNavigation::PdfLink) }
end
