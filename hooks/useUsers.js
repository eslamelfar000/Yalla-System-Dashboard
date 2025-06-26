import { usePathname } from "next/navigation";
import { useGetData } from "./useGetData";
import { useMutate } from "./useMutate";
import { createUser, updateUser, deleteUser } from "@/config/users.config";
import { useEffect, useMemo, useState } from "react";
import { type } from "os";

// Debounce utility
function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

// Hook to get users by role
export const useUsers = (role = null, page = 1, refetch) => {
  const endpoint = role 
    ? `dashboard/users?roles[0]=${role}&page=${page}` 
    : `dashboard/users?page=${page}`;
  const queryKey = role ? ["users", role, page] : ["users", page];
  
  return useGetData({
    endpoint,
    queryKey,
    enabledKey: true,
    refetch
  });
};

// Hook to get single user
export const useUser = (userId) => {
  const endpoint = `dashboard/users/${userId}`;
  const queryKey = ["user", userId];
  
  return useGetData({
    endpoint,
    queryKey,
    enabledKey: !!userId,
  });
};




// Hook to get students with filters/search
export const useStudents = (params = {}, page = 1) => {
  // params: { search, filters, ... }
  // Debounce search/filter params
  const debouncedParams = useDebounce(params, 500);

  console.log(debouncedParams);

  // Build query string
  const queryString = useMemo(() => {
    const searchParams = new URLSearchParams();
    // searchParams.append("roles[0]", "student");
    if (debouncedParams.search) {
      searchParams.append("name", debouncedParams.search);
    }
    if(debouncedParams.types){
      debouncedParams.types.map((type, index) => {
        searchParams.append(`type[${index}]`, type);
      });
    }
    if(debouncedParams.sessions){
      debouncedParams.sessions.map((session, index) => {
        searchParams.append(`sessions[${index}]`, session);
      });
    }
    // ...add more as needed
    return searchParams.toString();
  }, [debouncedParams, page]);


  const endpoint = `dashboard/users?roles[0]=student&${queryString}&page=${page}`;
  const queryKey = ["users", "student", debouncedParams, page];

  return useGetData({
    endpoint,
    queryKey,
    enabledKey: true,
  });
};



// Hook to get teachers
export const useTeachers = () => {
  return useUsers('teacher');
};

// Hook to get quality assurance users
export const useQualityUsers = () => {
  return useUsers('quality');
};

// Hook to create user
export const useCreateUser = (role = null, onSuccess = null, refetch) => {
  const queryKeysToInvalidate = [
    ["users"],
    ["users", "teacher"],
    ["users", "quality"],
  ];

  return useMutate({
    method: "POST",
    endpoint: `dashboard/users`,
    queryKeysToInvalidate,
    text: `${role === 'teacher' ? 'Teacher' : role === 'quality' ? 'Quality Assurance User' : 'User'} created successfully`,
    onSuccess,
    refetch
  });
};

// Hook to update user
export const useUpdateUser = (userId, role = null, onSuccess = null, refetch) => {
  const queryKeysToInvalidate = [
    ["users"],
    ["users", "teacher"],
    ["users", "quality"],
  ];

  return useMutate({
    method: "PUT",
    endpoint: `dashboard/users/${userId}`,
    queryKeysToInvalidate,
    text: `${role === 'teacher' ? 'Teacher' : role === 'quality' ? 'Quality Assurance User' : 'User'} updated successfully`,
    onSuccess,
    refetch
  });
};

// Hook to delete user
export const useDeleteUser = (userId, role = null, onSuccess = null, refetch) => {
  const queryKeysToInvalidate = [
    ["users"],
    ["users", "teacher"],
    ["users", "quality"],
  ];

  return useMutate({
    method: "DELETE",
    endpoint: `dashboard/users/${userId}`,
    queryKeysToInvalidate,
    text: `${role === 'teacher' ? 'Teacher' : role === 'quality' ? 'Quality Assurance User' : 'User'} deleted successfully`,
    onSuccess,
    refetch
    });
};

// Hook to update teacher status
export const useUpdateTeacherStatus = (userId, onSuccess = null, refetch) => {
  const queryKeysToInvalidate = [
    ["users"],
    ["users", "teacher"],
    ["user", userId],
  ];

  return useMutate({
    method: "POST",
    endpoint: `dashboard/users/${userId}/change-is-new`,
    queryKeysToInvalidate,
    text: "Teacher status updated successfully",
    onSuccess,
    refetch
  });
}; 