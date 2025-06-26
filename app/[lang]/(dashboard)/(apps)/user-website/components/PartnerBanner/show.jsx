"use client";

import { useState } from "react";
import PartnerBannerEditor from "./PartnerBannerEditor";
import PartnerBannerPreview from "./PartnerBannerPreview";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/Shared/loading-button";
import { Switch } from "@/components/ui/switch";
import ConfirmationDialog from "../Shared/ConfirmationDialog";
import DataErrorBoundary from "../Shared/DataErrorBoundary";
import { useSettingsAPI } from "../../api/settings-api";
import { Power, PowerOff } from "lucide-react";
import image1 from "@/public/images/card/card2.jpg";
import ourlogo from "@/public/yallalogo.png";
import partnerlogo from "@/public/images/all-img/book-1.png";

export default function PartnerBannerPage() {
  const [editorOpen, setEditorOpen] = useState(false);
  const [toggleConfirm, setToggleConfirm] = useState({
    open: false,
    newState: false,
  });

  const { getBannerSettings, updateSettings, updateSingleSettingMutation } =
    useSettingsAPI();

  // Get banner settings data using the hook
  const { data: bannerData, isLoading, error, refetch } = getBannerSettings;
  const settings = bannerData?.data || {};

  const bannerActive = settings.partner === true || settings.partner === "true";

  const handleToggleClick = (checked) => {
    setToggleConfirm({
      open: true,
      newState: checked,
    });
  };

  const handleToggleConfirm = async () => {
    await updateSingleSettingMutation.mutateAsync({
      key: "partner",
      value: toggleConfirm.newState,
    });
    setToggleConfirm({ open: false, newState: false });
  };

  const handleToggleCancel = () => {
    setToggleConfirm({ open: false, newState: false });
  };

  const handleSaveBanner = async (data) => {
    await updateSettings.mutateAsync({
      settings: {
        title: data.title,
        description: data.description,
        logo: data.logo,
        partner_logo: data.partner_logo,
        banner: data.banner,
      },
    });
    setEditorOpen(false);
  };

  const handleRetry = async () => {
    await refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DataErrorBoundary
      error={error}
      isLoading={isLoading}
      onRetry={handleRetry}
      dataType="banner-settings"
    >
      <div className="container py-10 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Partner Banner</h1>
          <div className="flex gap-2 items-center">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Banner Active</span>
              <Switch
                checked={bannerActive}
                onCheckedChange={handleToggleClick}
                disabled={updateSingleSettingMutation.isPending}
              />
            </div>
            <Button onClick={() => setEditorOpen(true)}>Edit Banner</Button>
          </div>
        </div>

        <PartnerBannerPreview data={settings} />

        <PartnerBannerEditor
          open={editorOpen}
          onClose={() => setEditorOpen(false)}
          onSave={handleSaveBanner}
          initialData={settings}
          loading={updateSettings.isPending}
        />

        <ConfirmationDialog
          open={toggleConfirm.open}
          onClose={handleToggleCancel}
          onConfirm={handleToggleConfirm}
          title={
            toggleConfirm.newState ? "Activate Banner" : "Deactivate Banner"
          }
          description={`Are you sure you want to ${
            toggleConfirm.newState ? "activate" : "deactivate"
          } the partner banner?`}
          confirmText={toggleConfirm.newState ? "Activate" : "Deactivate"}
          cancelText="Cancel"
          loading={updateSingleSettingMutation.isPending}
          variant="default"
          icon={toggleConfirm.newState ? Power : PowerOff}
        />
      </div>
    </DataErrorBoundary>
  );
}
