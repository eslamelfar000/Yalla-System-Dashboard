// components/PartnerBannerPreview.jsx
"use client";

const PartnerBannerPreview = ({ data }) => {
  if (!data) return null;

  const { title, description, ourLogo, partnerLogo, bannerImage } = data;

  return (
    <div className="" >
      <div className="w-full grid grid-cols-2 items-center py-10 px-20 bg-default-100  relative overflow-hidden">
        {/* Background Banner Image */}

        {/* Overlay Content */}
        <div className="">
          <div className="flex items-center gap-4 mb-4">
            {ourLogo && (
              <img
                src={ourLogo?.src || ourLogo}
                alt="Our Logo"
                className="h-12 rounded"
              />
            )}
            <span className="text-xl font-bold">×</span>
            {partnerLogo && (
              <img
                src={partnerLogo?.src || partnerLogo}
                alt="Partner Logo"
                className="h-12 rounded"
              />
            )}
          </div>

          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="max-w-lg mt-2 text-sm">{description}</p>
        </div>

        <div className="overflow-hidden relative rounded-lg flex items-center justify-center">
          {bannerImage && (
            <img
              src={bannerImage?.src || bannerImage}
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
