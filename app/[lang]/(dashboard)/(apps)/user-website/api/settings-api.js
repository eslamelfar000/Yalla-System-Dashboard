import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGetData } from "@/hooks/useGetData";
import { useAxios } from "@/config/axios.config";
import toast from "react-hot-toast";

export const useSettingsAPI = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  const getBannerSettings = useGetData({
    endpoint: "dashboard/get-settings",
    queryKey: ["banner-settings"],
  });

  const getContactSettings = useGetData({
    endpoint: "dashboard/get-settings",
    queryKey: ["contact-settings"],
  });

  const refetchBannerSettings = () => {
    queryClient.invalidateQueries(["banner-settings"]);
  };

  const refetchContactSettings = () => {
    queryClient.invalidateQueries(["contact-settings"]);
  };

  // ✅ Format to FormData with nested keys like: settings[title], settings[email]
  const formatSettingsFormData = (settings) => {
    const formData = new FormData();
    Object.entries(settings).forEach(([key, value]) => {
      const formattedKey = `settings[${key}]`;
      
      // Handle file uploads (images)
      if (value instanceof File) {
        formData.append(formattedKey, value);
      } 
      // Skip blob URLs (they should be File objects instead)
      else if (typeof value === 'string' && value.startsWith('blob:')) {
        console.warn(`Skipping blob URL for ${key}. Expected File object instead.`);
        return; // Skip this field
      }
      // Handle null/undefined values
      else if (value === null || value === undefined) {
        formData.append(formattedKey, '');
      }
      // Handle regular values (strings, numbers, booleans)
      else {
        formData.append(formattedKey, String(value));
      }
    });
    return formData;
  };

  const getChangedSettings = (currentSettings, newSettings) => {
    const changed = {};
    Object.entries(newSettings).forEach(([key, value]) => {
      const currentValue = currentSettings[key];
      
      // Special handling for files - if it's a File object, it's considered changed
      if (value instanceof File) {
        changed[key] = value;
        return;
      }
      
      // For non-file values, compare as strings
      const currentValueStr = String(currentValue ?? "").trim();
      const newValueStr = String(value ?? "").trim();
      
      if (currentValueStr !== newValueStr) {
        changed[key] = value;
      }
    });
    return changed;
  };

  const updateSingleSetting = async (key, value) => {
    const formData = new FormData();
    const formattedKey = `settings[${key}]`;
    
    // Handle file uploads (images)
    if (value instanceof File) {
      formData.append(formattedKey, value);
    } 
    // Skip blob URLs (they should be File objects instead)
    else if (typeof value === 'string' && value.startsWith('blob:')) {
      console.warn(`Skipping blob URL for ${key}. Expected File object instead.`);
      return { success: false, message: "Invalid file format" };
    }
    // Handle null/undefined values
    else if (value === null || value === undefined) {
      formData.append(formattedKey, '');
    }
    // Handle regular values (strings, numbers, booleans)
    else {
      formData.append(formattedKey, String(value));
    }
    
    const response = await axiosInstance.post("dashboard/settings", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  };

  const updateSettings = useMutation({
    mutationFn: async (data) => {
      const currentBanner = queryClient.getQueryData(["banner-settings"])?.data || {};
      const currentContact = queryClient.getQueryData(["contact-settings"])?.data || {};
      const currentSettings = { ...currentBanner, ...currentContact };

      const changedSettings = getChangedSettings(currentSettings, data.settings);
      if (Object.keys(changedSettings).length === 0) {
        return { success: true, message: "No changes detected" };
      }

      const formData = formatSettingsFormData(changedSettings);
      const response = await axiosInstance.post("dashboard/settings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      const currentBanner = queryClient.getQueryData(["banner-settings"])?.data || {};
      const currentContact = queryClient.getQueryData(["contact-settings"])?.data || {};
      const currentSettings = { ...currentBanner, ...currentContact };

      const changedSettings = getChangedSettings(currentSettings, variables.settings);

      if (changedSettings.title || changedSettings.description || changedSettings.logo || changedSettings.partner_logo || changedSettings.partner || changedSettings.banner) {
        refetchBannerSettings();
        queryClient.setQueryData(["banner-settings"], (old) => ({
          ...old,
          data: { ...old?.data, ...changedSettings },
        }));
      }

      if (changedSettings.email || changedSettings.phone) {
        refetchContactSettings();
        queryClient.setQueryData(["contact-settings"], (old) => ({
          ...old,
          data: { ...old?.data, ...changedSettings },
        }));
      }

      toast.success("Settings updated successfully");
    },
    onError: (error) => {
      const msg = error?.response?.data?.msg || "Failed to update settings";
      toast.error(msg);
    },
  });

  const updateSingleSettingMutation = useMutation({
    mutationFn: async ({ key, value }) => {
      return await updateSingleSetting(key, value);
    },
    onSuccess: (data, variables) => {
      const { key, value } = variables;

      if (['title', 'description', 'logo', 'partner_logo', 'partner', 'banner'].includes(key)) {
        refetchBannerSettings();
        queryClient.setQueryData(["banner-settings"], (old) => ({
          ...old,
          data: { ...old?.data, [key]: value },
        }));
      }

      if (['email', 'phone'].includes(key)) {
        refetchContactSettings();
        queryClient.setQueryData(["contact-settings"], (old) => ({
          ...old,
          data: { ...old?.data, [key]: value },
        }));
      }

      toast.success("Setting updated successfully");
    },
    onError: (error) => {
      const msg = error?.response?.data?.msg || "Failed to update setting";
      toast.error(msg);
    },
  });

  return {
    getBannerSettings,
    getContactSettings,
    updateSettings,
    updateSingleSettingMutation,
    refetchBannerSettings,
    refetchContactSettings,
  };
};