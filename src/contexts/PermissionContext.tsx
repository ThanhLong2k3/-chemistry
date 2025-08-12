'use client';

import { getAccountLogin } from '@/env/getInfor_token';
// 1. Import thêm 'useCallback'
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

interface IPermissionContext {
    permissions: string[];
    hasPermission: (code: string) => boolean;
    refreshPermissions: () => void;
}

const PermissionContext = createContext<IPermissionContext>({
    permissions: [],
    hasPermission: () => false,
    refreshPermissions: () => { },
});

export const usePermissions = () => useContext(PermissionContext);

export const PermissionProvider = ({ children }: { children: ReactNode }) => {
    const [permissions, setPermissions] = useState<string[]>([]);

    //Tách logic đọc token ra hàm riêng, bọc trong useCallback
    const updatePermissionsFromToken = useCallback(() => {
        const accountInfo = getAccountLogin();
        if (accountInfo && accountInfo.permissions) {
            setPermissions(accountInfo.permissions);
        } else {
            // Nếu không có token, reset permissions về mảng rỗng
            setPermissions([]);
        }
    }, []);


    // 3. useEffect sẽ gọi hàm này khi component được mount lần đầu
    useEffect(() => {
        updatePermissionsFromToken();
    }, [updatePermissionsFromToken]);

    const hasPermission = (requiredPermission: string): boolean => {
        return permissions.includes(requiredPermission);
    };

    // 4. Định nghĩa hàm refreshPermissions để cung cấp ra ngoài
    const refreshPermissions = () => {
        updatePermissionsFromToken();
    };


    return (
        // 5. Cung cấp hàm mới qua Provider
        <PermissionContext.Provider value={{ permissions, hasPermission, refreshPermissions }}>
            {children}
        </PermissionContext.Provider>
    );
};