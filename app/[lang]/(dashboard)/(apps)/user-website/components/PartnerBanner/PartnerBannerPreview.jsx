// components/PartnerBannerPreview.jsx
"use client";

const PartnerBannerPreview = ({ data }) => {
  if (!data) return null;

  const { title, description, logo, partner_logo, banner } = data;

  return (
    <div className="">
      <div className="w-full grid grid-cols-2 items-center py-10 px-20 bg-default-100  relative overflow-hidden">
        {/* Background Banner Image */}

        {/* Overlay Content */}
        <div className="">
          <div className="flex items-center gap-4 mb-4">
            {logo && (
              <img
                src={logo?.src || logo}
                alt="Our Logo"
                className="h-12 rounded object-contain"
              />
            )}
            <span className="text-xl font-bold">×</span>
            {partner_logo && (
              <img
                src={partner_logo?.src || partner_logo}
                alt="Partner Logo"
                className="h-12 rounded object-contain"
              />
            )}
          </div>

          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="max-w-lg mt-2 text-sm">{description}</p>
        </div>

        <div className="overflow-hidden relative rounded-lg flex items-center justify-center">
          {banner && (
            <img
              src={banner?.src || banner}
              alt="Banner"
              className="w-full object-cover"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerBannerPreview;
