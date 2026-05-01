"use client";

import SettingsForm from "@/components/SettingsForm";
import {
  useGetAuthUserQuery,
  useUpdateManagerSettingsMutation,
} from "@/state/api";
import React from "react";

import { useAuth } from "@/app/(auth)/authProvider";

const ManagerSettings = () => {
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  const { user: contextUser } = useAuth();
  const [updateManager] = useUpdateManagerSettingsMutation();

  if (isLoading) return <>Loading...</>;

  const initialData = {
    name: authUser?.userInfo?.name || contextUser?.name || "",
    email: authUser?.userInfo?.email || contextUser?.email || "",
    phoneNumber: authUser?.userInfo?.phoneNumber || contextUser?.phoneNumber || "",
  };

  const handleSubmit = async (data: typeof initialData) => {
    const managerAuthId = authUser?.userInfo?.authId || contextUser?.authId;
    if (!managerAuthId) return;

    await updateManager({
      authId: managerAuthId,
      ...data,
    });
  };

  return (
    <SettingsForm
      initialData={initialData}
      onSubmit={handleSubmit}
      userType="manager"
    />
  );
};

export default ManagerSettings;
